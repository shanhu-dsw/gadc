class Checkpoint::DashboardController < CheckpointController

  def index
    @online_cameras = Camera.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read).query_status('normal')
    @all_cameras = Camera.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read)
    @all_locations = Location.where(location_type: 'checkpoint' ).accessible_by(current_ability, :read)
    @all_problems = Problem.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read)

    @all_location_events = LocationEvent.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read).where(active: true)
    @top_location_events = LocationEvent.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read).where(active: true).order(created_at: :desc).first(10)
  end

  def places
    @resources = Location.where(location_type: 'checkpoint').accessible_by(current_ability, :read).query_location_level_name('单位')

    places = []

    @resources.each do |resource|
      places.append({
                      name: resource.name,
                      lat: resource.lat,
                      lon: resource.lon,
                      location_event_count: resource.all_descendant_location_events.accessible_by(current_ability, :read).size
                    })
    end

    render json: { data: places.as_json }
  end

  def problems_group_by_status
    @data = Problem.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read).group(:problem_status).count
    @result = {}
    Problem.joins(:location).where(locations: { location_type: 'checkpoint' }).problem_statuses.keys.each_with_index do |status|
      @result[(t "activerecord.attributes.problem.problem_status.#{status}")] = @data[status] ? @data[status] : 0
    end
    render json: { data: @result }
  end

  def location_events_group_by_event
    @result = {}
    Event.accessible_by(current_ability, :read).where(name: ['未戴口罩', '未穿戴反光背心', '车辆拥堵', '单人拦检', '无人拦检', '引导分流民警不在岗', '执勤区民警不在岗']).each_with_index do |event|
      @result[event.name] = LocationEvent.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read).query_event_id(event.id).size
    end
    render json: { data: @result }
  end

end
