class Checkpoint::LocationEventsController < CheckpointController
  load_and_authorize_resource
  check_authorization

  def index
    @resources = LocationEvent.joins(:location).where(locations: { location_type: 'checkpoint' }).accessible_by(current_ability, :read).filterable(params.slice(
      :query_created_at_from, :query_created_at_to, :query_location_id_1, :query_location_id_2, :query_location_id_3, :query_event_id))
                              .order(created_at: :desc).page(params[:page]).per(12)
  end

  def show
    @resource = LocationEvent.find(params[:id])
  end
end

