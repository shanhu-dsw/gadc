module AdminHelper
  def setup_config
    {
      scope: 'admin',
      title: '智慧督察系统 | 人工智能引擎助力警务督察工作',
      sessions: {
        authentication_key: 'username',
        # title: 'Welcome To UFORSE',
        # description: '让天下学生走上适合自己的人生之路; Tutor Mentor Advisor; 导师, 老师, 规划师',
        # background: '/manage/images/background.jpg'
      }
    }
  end

  def get_setting_event_ids_by_location_category(location_category)
    if location_category.name == '报警服务台'
      Event.where(name: ['值班岗位脱空岗', '肢体冲突']).pluck(:id)
    elsif location_category.name == '值班室'
      Event.where(name: ['值班岗位脱空岗']).pluck(:id)
    elsif location_category.name == '询问室'
      Event.where(name: ['单人讯询问', '人员倒地']).pluck(:id)
    elsif location_category.name == '讯问室'
      Event.where(name: ['单人讯询问', '人员倒地']).pluck(:id)
    elsif location_category.name == '综合服务大厅'
      Event.where(name: ['服务岗位脱空岗', '人员聚集', '肢体冲突', '夜间异动']).pluck(:id)
    elsif location_category.name == '出入境大厅'
      Event.where(name: ['服务岗位脱空岗', '人员聚集', '肢体冲突', '夜间异动']).pluck(:id)
    elsif location_category.name == '车管服务大厅'
      Event.where(name: ['服务岗位脱空岗', '人员聚集', '肢体冲突', '夜间异动']).pluck(:id)
    elsif location_category.name == '信访大厅'
      Event.where(name: ['服务岗位脱空岗', '人员聚集', '肢体冲突', '夜间异动']).pluck(:id)
    elsif location_category.name == '户籍室'
      Event.where(name: ['服务岗位脱空岗', '人员聚集', '肢体冲突', '夜间异动']).pluck(:id)
    elsif location_category.name == '枪支保管库'
      Event.where(name: ['武器库异动', '单人进入枪库']).pluck(:id)
    elsif location_category.name == '武器警械室'
      Event.where(name: ['武器库异动', '单人进入枪库']).pluck(:id)
    end
  end

  def get_progress_class(percentage)
    if percentage > 75
      'bg-info'
    elsif percentage > 50
      'bg-warning'
    else
      'bg-danger'
    end
  end
end
