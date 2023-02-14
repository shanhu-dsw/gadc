class Admin::ProblemsController < Admin::ResourcesController
  include AdminProblemsConcern

  def create
    @resource = @model.new(resource_params)
    if @resource.save
      params[:problem_camera_capture_ids].split(',').each do |camera_capture_id|
        camera_capture = CameraCapture.find(camera_capture_id)
        img_data = camera_capture.img_data[:src]
        if img_data
          problem_evidence = ProblemEvidence.create(problem: @resource)
          filename = File.basename(URI.parse(img_data).path)
          file = URI.open(img_data)
          problem_evidence.img.attach(io: file, filename: filename)
        end
      end if params[:problem_camera_capture_ids]
      flash[:success] = "#{t 'manage.resources.create_success'} #{@model.model_name.human}"
      render json: create_json, status: :ok
    else
      render json: { data: @resource.errors.full_messages.first }, status: :unprocessable_entity
    end
  end

  def stats_problem_map_modal
    @location = Location.find_by_name(params[:name])
    if params[:time] == 'day'
      @resources = @location.all_descendant_problems.query_from_date((Time.zone.now.beginning_of_day).to_s)
    elsif params[:time] == 'week'
      @resources = @location.all_descendant_problems.query_from_date((Time.zone.now.beginning_of_week).to_s)
    elsif params[:time] == 'month'
      @resources = @location.all_descendant_problems.query_from_date((Time.zone.now.beginning_of_month).to_s)
    end
    render 'admin/dashboard/map_problem_module', layout: false
  end

  def stats_problem_group_type
    @data = Problem.accessible_by(current_ability, :read).filterable(filter_params).group(:problem_status).count
    @result = {}
    Problem.problem_statuses.keys.each_with_index do |status|
      @result[(t "activerecord.attributes.problem.problem_status.#{status}")] = @data[status] ? @data[status] : 0
    end
    render json: { data: @result }
  end

  def stats_problem_group_division
    @result1 = {}
    @result2 = {}
    @result3 = {}
    current_admin_user.source.location.children.each do |location|
      @result1[location.name] = location.all_descendant_problems.query_from_date((Time.zone.now.beginning_of_day).to_s).size
      @result2[location.name] = location.all_descendant_problems.query_from_date((Time.zone.now.beginning_of_week).to_s).size
      @result3[location.name] = location.all_descendant_problems.query_from_date((Time.zone.now.beginning_of_month).to_s).size
    end
    render json: { data1: @result1, data2: @result2, data3: @result3 }
  end

  def report_problems
    @resources_all = @model.accessible_by(current_ability, :read).filterable(filter_params)
    render 'admin/problems/report_problems', layout: false
  end

  def report_generation_0
    @current_location_level_index = current_admin_user.source.location.location_level.index

    if @current_location_level_index == 0
      @current_location_title = current_admin_user.source.location.name + '公安厅警务督察总队'
    elsif @current_location_level_index == 1
      @current_location_title = current_admin_user.source.location.name + '公安局警务督察支队'
    elsif @current_location_level_index == 2
      @current_location_title = current_admin_user.source.location.name + '公安局警务督察大队'
    else
      @current_location_title = current_admin_user.source.location.name + '警务督察'
    end

    @resources = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_params)
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"巡查报告.docx\"" }
    end
  end

  def report_generation_1
    @current_location_level_index = current_admin_user.source.location.location_level.index

    if @current_location_level_index == 0
      @current_location_title = current_admin_user.source.location.name + '公安厅警务督察总队'
    elsif @current_location_level_index == 1
      @current_location_title = current_admin_user.source.location.name + '公安局警务督察支队'
    elsif @current_location_level_index == 2
      @current_location_title = current_admin_user.source.location.name + '公安局警务督察大队'
    else
      @current_location_title = current_admin_user.source.location.name + '警务督察'
    end

    @resources = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_params)
    @category = @resources.where(problem_status: 'correcting'..'corrected').group_by { |j| j.problem_category.name rescue '未知问题类型' }.map { |k, v| [k, v.size] }.sort_by { |v| -v[1] }

    @publishing_unit = current_admin_user.source.location.name

    @location_pro = {}
    current_admin_user.source.location.children.each do |location|
      @location_pro[location.name] = @resources.where(problem_status: 'correcting'..'corrected').where(location_id: location.subtree_ids).size
    end

    @location_pro = @location_pro.map { |k, v| [k, v] }.sort_by { |v| -v[1] }
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"研判报告.docx\"" }
    end
  end

  def report_generation_2
    @resources = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_params)
    @category = @resources.where(problem_status: 'correcting'..'corrected').group_by { |j| j.problem_category.name rescue '未知问题类型' }.map { |k, v| [k, v.size] }.sort_by { |v| -v[1] }
    @location_pro = {}

    current_admin_user.source.location.children.each do |location|
      @location_pro[location.id] = @resources.where(location_id: location.subtree_ids)
    end

    @search_pro = {}
    ProblemCategory.all.each do |category|
      @search_pro[category.id] = @resources.where(problem_status: 'correcting'..'corrected').where(admin_id: current_admin_user.source.id).where(discover_type: 'search').where(problem_category_id: category.id)
    end

    @pro_category = ''
    @category.first(3).each do |k, v|
      if v != 0
        @pro_category = @pro_category + k + '。'
      end
    end

    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"抽查报告.docx\"" }
    end
  end

  def report_generation_3
    require "sablon"
    template = Sablon.template(File.expand_path(Rails.root.join('public', 'checkpoint/template.docx')))

    @resources = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_params)
    from_date = Time.zone.parse(params[:query_from_date])
    to_date = Time.zone.parse(params[:query_to_date])
    count = ((Time.zone.parse(params[:query_from_date]) - Time.zone.parse('2021-06-10')) / 1.day).to_i

    summary = "#{from_date.strftime('%-m月%-d日%-H时')}到#{to_date.strftime('%-m月%-d日%-H时')}，省厅警务督察总队组织全省“大数据+网上督察”战队网上督察专班，对我省环京“护城河”各公安检查站执行安保维稳查控勤务情况开展网上督察，共发现问题#{@resources.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read).size}个。"

    problems_sets = []

    problem_categories = ['查控工作不细致', '勤务设置不合理', '内部管理不规范', '其它问题']

    problem_categories.each do |problem_category|
      problems_set = []
      if (ProblemCategory.find_by_name('检查站专题').children rescue nil)
        @resources.where(problem_category_id: ProblemCategory.find_by_name('检查站专题').children.where(name: problem_category).first.descendant_ids).each do |problem|
          problems_set.append({
                                time: "#{problem.issued_at.strftime('%-m月%-d日%-H时%-M分')}到#{problem.active_at.strftime('%-H时%-M分')}，",
                                city: problem.location.path.query_location_level_name('地级市').first.name,
                                location: "#{(problem.location.path.query_location_level_name('区县').first.name rescue '')}#{(problem.location.path.query_location_level_name('单位').first.name rescue '')}#{(problem.location_events.first.location.path.query_location_level_name('房间').first.name rescue '')}",
                                description: "，发现#{problem.problem_category.name}的问题。"
                              })
        end
      end

      problems_sets.append(problems_set)
    end

    context = {
      count: count,
      summary: summary,
      full_date: to_date.strftime('%Y年%-m月%-d日'),
      from_date: from_date.strftime('%-m月%-d日'),
      to_date: to_date.strftime('%-m月%-d日'),
      problems_1: problems_sets[0],
      problems_2: problems_sets[1],
      problems_3: problems_sets[2],
      problems_4: problems_sets[3],
    }

    # 标题
    file_name = "网上督察检查站专报第#{count}期.docx"

    # 存放路径
    file_path = Rails.root.join('public/checkpoint/', file_name + '.docx')

    # 生成文件并且发送
    template.render_to_file File.expand_path(file_path), context

    File.open(file_path, 'r') do |f|
      send_data f.read, :type => "text/docx", :filename => file_name
    end

    File.delete(file_path) if File.exist?(file_path)
  end

  def report_generation_4
    @resources = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_params)
    @category = @resources.where(problem_status: 'correcting'..'corrected').group_by { |j| j.problem_category.name rescue '未知问题类型' }.map { |k, v| [k, v.size] }.sort_by { |v| -v[1] }
    @location_pro = {}
    current_admin_user.source.location.children.each do |location|
      @location_pro[location.id] = @resources.where(location_id: location.subtree_ids)
    end


    respond_to do |format|
      format.xlsx { headers["Content-Disposition"] = "attachment; filename=\"督察周报.xlsx\"" }
    end
  end

  def report_generation_5
    @days = (DateTime.parse(params[:query_to_date]) - DateTime.parse(params[:query_from_date]) + 1).to_i
    @resources1 = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_params)
    @resources2 = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_report_params).query_from_date((DateTime.parse(params[:query_from_date]) - @days.day).to_s).query_to_date((DateTime.parse(params[:query_to_date]) - @days.day).to_s)
    @resources3 = @model.accessible_by(current_ability, :read).where.not(problem_category_id: nil).filterable(filter_report_params).query_from_date((DateTime.parse(params[:query_from_date]) - (@days*2).day).to_s).query_to_date((DateTime.parse(params[:query_to_date]) - (@days*2).day).to_s)
    @resources = @resources1.query_problem_status_arr('corrected,correcting') + @resources2.query_problem_status_arr('corrected,correcting') + @resources3.query_problem_status_arr('corrected,correcting')

    @place_problems = {}
    @place_problems1 = {}
    @place_problems2 = {}
    @place_problems3 = {}
    @place_problems_ranking = {}
    Location.accessible_by(current_ability, :read).query_location_level_name('区县').each do |location|
      size1 = @resources1.query_problem_status_arr('corrected,correcting').where(location_id: location.descendant_ids).size
      if size1 > 0
        @place_problems1[location.id] = size1
      end
      size2 = @resources2.query_problem_status_arr('corrected,correcting').where(location_id: location.descendant_ids).size
      if size2 > 0
        @place_problems2[location.id] = size2
      end
      size3 = @resources3.query_problem_status_arr('corrected,correcting').where(location_id: location.descendant_ids).size
      if size3 > 0
        @place_problems3[location.id] = size3
      end
    end
    @place_problems1 = @place_problems1.map { |k, v| [k, v] }.sort_by { |v| -v[1] }
    @place_problems2 = @place_problems2.map { |k, v| [k, v] }.sort_by { |v| -v[1] }
    @place_problems3 = @place_problems3.map { |k, v| [k, v] }.sort_by { |v| -v[1] }
    @place_problems = @place_problems1.first(3) + @place_problems2.first(3) + @place_problems3.first(3)
    @place_problems.each do |place|
      if @place_problems_ranking.include?(place[0])
        @place_problems_ranking[place[0]]['count'] = @place_problems_ranking[place[0]]['count'] + 1
        @place_problems_ranking[place[0]]['problem'] = @place_problems_ranking[place[0]]['problem'] + place[1]
        @place_problems_ranking[place[0]]['proportion'] = 100*@place_problems_ranking[place[0]]['problem']/@resources.size
        @place_problems_ranking[place[0]]['index'] = @place_problems_ranking[place[0]]['proportion'] + (@place_problems_ranking[place[0]]['count']*100*place[1]/@resources.size)
      else
        @place_problems_ranking[place[0]] = {'problem' => place[1], 'count' => 1, 'proportion' => 100*place[1]/@resources.size, 'index' => (100/Location.accessible_by(current_ability, :read).query_location_level_name('区县').size) + (100*place[1]/@resources.size)}
      end
    end
    @place_problems_ranking = @place_problems_ranking.group_by().map { |k, v| [k, v] }.sort_by{ |v| - v[1]['index'] }.first(3)

    @division_problems1 = {}
    @division_problems2 = {}
    @division_problems3 = {}
    @division_problems_ranking = {}
    Location.accessible_by(current_ability, :read).query_location_level_name('单位').each do |location|
      size1 = @resources1.query_problem_status_arr('corrected,correcting').where(location_id: location.subtree_ids).size
      if size1 > 0
        @division_problems1[location.id] = size1
      end
      size2 = @resources2.query_problem_status_arr('corrected,correcting').where(location_id: location.subtree_ids).size
      if size2 > 0
        @division_problems2[location.id] = size2
      end
      size3 = @resources3.query_problem_status_arr('corrected,correcting').where(location_id: location.subtree_ids).size
      if size3 > 0
        @division_problems3[location.id] = size3
      end
    end
    @division_problems1 = @division_problems1.map { |k, v| [k, v] }.sort_by { |v| -v[1] }
    @division_problems2 = @division_problems2.map { |k, v| [k, v] }.sort_by { |v| -v[1] }
    @division_problems3 = @division_problems3.map { |k, v| [k, v] }.sort_by { |v| -v[1] }
    @division_problems = @division_problems1.first(5) + @division_problems2.first(5) + @division_problems3.first(5)
    @division_problems.each do |place|
      if @division_problems_ranking.include?(place[0])
        @division_problems_ranking[place[0]]['count'] = @division_problems_ranking[place[0]]['count'] + 1
        @division_problems_ranking[place[0]]['problem'] = @division_problems_ranking[place[0]]['problem'] + place[1]
        @division_problems_ranking[place[0]]['proportion'] = 100*@division_problems_ranking[place[0]]['problem']/@resources.size
        @division_problems_ranking[place[0]]['index'] = @division_problems_ranking[place[0]]['proportion'] + (@division_problems_ranking[place[0]]['count']*100*place[1]/@resources.size)
      else
        @division_problems_ranking[place[0]] = {'problem' => place[1], 'count' => 1, 'proportion' => 100*place[1]/@resources.size, 'index' => (100/Location.accessible_by(current_ability, :read).query_location_level_name('单位').size) + (100*place[1]/@resources.size)}
      end
    end
    @division_problems_ranking = @division_problems_ranking.group_by().map { |k, v| [k, v] }.sort_by{ |v| - v[1]['index'] }.first(5)

    @category1 = @resources1.query_problem_status_arr('corrected,correcting').group_by { |j| j.problem_category.name rescue '未知问题类型' }.map { |k, v| [k, v.size] }.sort_by { |v| -v[1] }
    @category2 = @resources2.query_problem_status_arr('corrected,correcting').group_by { |j| j.problem_category.name rescue '未知问题类型' }.map { |k, v| [k, v.size] }.sort_by { |v| -v[1] }
    @category3 = @resources3.query_problem_status_arr('corrected,correcting').group_by { |j| j.problem_category.name rescue '未知问题类型' }.map { |k, v| [k, v.size] }.sort_by { |v| -v[1] }
    @category_problems =  @model.accessible_by(current_ability, :read).query_problem_status_arr('corrected,correcting').where.not(problem_category_id: nil).filterable(filter_report_params).query_from_date((DateTime.parse(params[:query_from_date]) - (@days*2).day).to_s).query_to_date(params[:query_to_date])
    @category = @category_problems.group_by { |j| j.problem_category.id rescue 1 }.map { |k, v| [k, v.size] }.sort_by { |v| -v[1] }.first(5)
    @category_ranking = {}
    @category.each do |category_id, count|
      division_category = {}
      Location.accessible_by(current_ability, :read).query_location_level_name('单位').each do |location|
        size = @category_problems.query_problem_category_id(category_id).where(location_id: location.subtree_ids).size
        if size > 0
          division_category[location.id] = size
        end
      end
      division_category = division_category.group_by().map { |k, v| [k, v] }.sort_by{ |v| - v[1] }.first(3)
      @category_ranking[category_id] = {'problem' => count, 'division' => division_category }
    end

    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"态势分析.docx\"" }
    end
  end

  def report_generation_6
    @resources = @model.accessible_by(current_ability, :read).query_problem_category_name_arr(['单人进入枪库','武器库异动','存在单人进入枪库现象','存在武器库异动现象','存在武器库未配备验枪桶现象']).where.not(problem_category_id: nil).filterable(filter_params)
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"公务用枪专题报告.docx\"" }
    end
  end

  def report_generation_7
    @resources = @model.accessible_by(current_ability, :read).query_problem_category_name_arr(['值班岗位脱空岗','发现值班人员脱空岗,确定此种违纪违规行为','发现服务人员脱空岗,确定此种违纪违规行为','长时间玩手机','办案区大门长时间呈开启状态','禁区或涉密区域有人员闯入']).where.not(problem_category_id: nil).filterable(filter_params)
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"值班备勤专题报告.docx\"" }
    end
  end

  def report_generation_8
    @resources = @model.accessible_by(current_ability, :read).query_problem_category_name_arr(['单人讯询问','存在单人讯询问现象','辅警单独进行讯询问、辨认等活动','询讯问/继续盘问超时限问题','被继续盘问等人员无人看管','等候讯询问看护不力','涉案人员单独滞留办案区']).where.not(problem_category_id: nil).filterable(filter_params)
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"执法办案专题报告.docx\"" }
    end
  end

  def report_generation_9
    @resources = @model.accessible_by(current_ability, :read).query_problem_category_name_arr(['警便混穿','着制式服装敞怀、挽袖、卷裤腿','行为举止不佳现象','非因就餐、补餐等吃零食','追逐打闹']).where.not(problem_category_id: nil).filterable(filter_params)
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"警容风纪专题报告.docx\"" }
    end
  end

  def report_generation_10
    @resources = @model.accessible_by(current_ability, :read).query_problem_category_name_arr(['环境卫生差','监控范围内橱顶、桌下等卫生死角问题','物品放置乱','办公、办案等场所放置与工作无关物品','涉案物品随意放置在值班区、办公区内']).where.not(problem_category_id: nil).filterable(filter_params)
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"内务管理专题报告.docx\"" }
    end
  end

  def report_generation_11
    @resources = @model.accessible_by(current_ability, :read).query_problem_category_name_arr(['人员聚集','服务岗位脱空岗','发现服务人员脱空岗,确定此种违纪违规行为','区域内存在人员大量聚集现象','区域内长时间存在夜间异动现象']).where.not(problem_category_id: nil).filterable(filter_params)
    respond_to do |format|
      format.docx { headers["Content-Disposition"] = "attachment; filename=\"窗口服务专题报告.docx\"" }
    end
  end

  def change_evidence_time
    @resource = ProblemEvidence.find(params[:evidence_id])
    @resource.created_at = params[:evidence_time]
    @resource.save
    if @resource.save
      render json: update_json, status: :ok
    else
      render json: { data: @resource.errors.full_messages.first }, status: :unprocessable_entity
    end

  end

  def open_problem_show
    problem_id = Problem.accessible_by(current_ability, :read).last.id rescue 1
    render json: { data: url_for({ action: :show,id: problem_id}) }, status: :ok
  end

  def layout_report
    @startTime = Time.parse(params[:from_date]).strftime('%Y年%m月%d日%H时%M分')
    @endTime = Time.parse(params[:to_date]).strftime('%Y年%m月%d日%H时%M分')
    @resources = Problem.accessible_by(current_ability, :read).query_from_date((params[:from_date]).to_s).query_to_date((params[:to_date]).to_s)
    @all_info = '在' + @startTime.to_s + '到' + @endTime.to_s + '期间，共发现疑似问题' + @resources.size.to_s + '个。已确定真实存在的问题' + (@resources.query_problem_status_arr('corrected,correcting').size rescue 0).to_s + '个，其中已整改' + "\n" +
      (@resources.query_problem_status('corrected').size rescue 0).to_s + '个，未整改' + (@resources.query_problem_status('correcting').size rescue 0).to_s + '个。' +
      '在全部问题中，未核实问题数量为' + (@resources.query_problem_status('waiting').size rescue 0).to_s + '个，待审核问题数量为' + (@resources.query_problem_status('reviewing').size rescue 0).to_s + '个，以下为问题分布详细情况：'
    @location_pro = {}
    current_admin_user.source.location.children.each do |location|
      @location_pro[location.id] = @resources.where(location_id: location.descendant_ids)
    end
    @location_pro_arr = []
    @location_pro.each do |k,v|
      if v.size
      @location_pro_arr.push(Location.find(k).name + '发现疑似问题' + v.size.to_s + '个。已确定' + (v.query_problem_status_arr('corrected,correcting').size rescue 0).to_s + '个，已整改' + "\n" +
                               (v.query_problem_status('corrected').size rescue 0).to_s + '个，未整改' + (v.query_problem_status('correcting').size rescue 0).to_s + '个。' +
                               '在全部问题中，未核实问题数量为' + (v.query_problem_status('waiting').size rescue 0).to_s + '个，待审核问题数量为' + (v.query_problem_status('reviewing').size rescue 0).to_s + '个。')
      end
    end
    render json: { data: @all_info, info: @location_pro_arr }, status: :ok
  end

end

