class Admin::LocationEventsController < Admin::ResourcesController
  include AdminLocationEventsConcern

  def stats_location_events_group_status
    render json: { correct: LocationEvent.accessible_by(current_ability, :read).filterable(filter_params).where(active: true).size, error: LocationEvent.accessible_by(current_ability, :read).filterable(filter_params).where(active: false).size }.as_json, status: :ok
  end

  def change_active
    @resource = LocationEvent.find(params[:id])
    @resource.active = params[:active]
    if @resource.save
      flash[:success] = "#{t 'manage.resources.update_success'} #{@model.model_name.human}"
      render json: update_json, status: :ok
    else
      render json: { data: @resource.errors.full_messages.first }, status: :unprocessable_entity
    end
  end

  def change_verified
    @resource = LocationEvent.find(params[:id])
    @resource.verified = params[:verified]
    if @resource.save
      flash[:success] = "#{t 'manage.resources.update_success'} #{@model.model_name.human}"
      render json: update_json, status: :ok
    else
      render json: { data: @resource.errors.full_messages.first }, status: :unprocessable_entity
    end
  end


  def change_event
    @resource = LocationEvent.find(params[:id])
    location = Location.find(params[:location_id])
    location.setting_event_ids = params[:setting_event_ids]
    location.save
    if @resource.save
      flash[:success] = "#{t 'manage.resources.update_success'} #{@model.model_name.human}"
      render json: update_json, status: :ok
    else
      render json: { data: @resource.errors.full_messages.first }, status: :unprocessable_entity
    end
  end



  def create_event_capture
    LocationEventCameraCapture.where(location_event_id: params[:location_event_id]).each do |capture|
      capture.destroy
    end

    params[:camera_capture_id].split(",").each do |capture|
      LocationEventCameraCapture.create(location_event_id: params[:location_event_id], camera_capture_id: capture)
    end
    render json: { url: url_for(action: :show, id: params[:location_event_id]) }, status: :ok
  end


end

