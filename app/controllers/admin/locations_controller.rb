class Admin::LocationsController < Admin::ResourcesController
  include AdminLocationsConcern

  def stats_location_group_data
    @division_id_arr = Location.joins(:location_level).where(location_levels: { name: '单位' })
    @result = {}
    @division_id_arr.each_with_index do |status|
      if status.lat != nil || status.lon != nil
        @result[status.name] = [status.lon, status.lat, Problem.accessible_by(current_ability, :read).query_from_date((Time.zone.now.beginning_of_month).to_s).filterable(filter_params).where(location_id: status.id).count]
      end
    end
    render json: { data: @result }
  end

  def stats_big_problem_map_modal
    @location = Location.find_by_name(params[:name])
    if params[:time] == 'day'
      @resources = Problem.where(location_id: Location.find(@location.id).subtree_ids).query_from_date((Time.zone.now.beginning_of_day).to_s)
    elsif params[:time] == 'week'
      @resources = Problem.where(location_id: Location.find(@location.id).subtree_ids).query_from_date((Time.zone.now.beginning_of_week).to_s)
    elsif params[:time] == 'month'
      @resources = Problem.where(location_id: Location.find(@location.id).subtree_ids).query_from_date((Time.zone.now.beginning_of_month).to_s)
    end
    render 'admin/dashboard/map_problem_module', layout: false
  end

  def edit_modal
    @resource = @model.find(params[:id])
    render 'admin/locations/edit_modal', layout: false
  end

  def tree
    @resource = @model.find(params[:id])
    @resources = @resource.children
    render 'admin/locations/tree', layout: false
  end

  def map_json
    render json: @model.where(name: params[:name]).first.as_json(only: [:id, :name], methods: :map_data), status: :ok
  end

  def location_children
    render json: @model.find(params[:id]).children, status: :ok
  end

  private

  # def update
  #   if @resource.update(resource_params)
  #     flash[:success] = "#{t 'manage.resources.update_success'} #{@model.model_name.human}"
  #     render json: update_json, status: :ok
  #   else
  #     render json: { data: @resource.errors.full_messages.first }, status: :unprocessable_entity
  #   end
  # end

  def create_success_path
    url_for({ action: :index })
  end

  def update_success_path
    Location.find(params[:id]).children.each do |location|
      location.location_type = params[:location_type]
    end

    url_for({ action: :index })
  end

end

