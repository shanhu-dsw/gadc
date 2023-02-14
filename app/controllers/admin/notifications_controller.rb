class Admin::NotificationsController < Admin::ResourcesController
  include AdminNotificationsConcern

  def push

    problem = Problem.find(params[:problem_id])
    current_admin_user.source.location.name + current_admin_user.source.full_name
    @notification_name = current_admin_user.source.location.name + current_admin_user.source.full_name + '推送的 "' + problem.problem_category.name + '" 问题，请及时整改。'
    @url = url_for(controller: :problems, action: :show, id: params[:problem_id])

    render 'admin/notifications/push', layout: false
  end

  def create_push
    @resource = @model.new(
      name: params[:name],
      admin_id: params[:admin_id],
      receiver_id: params[:receiver_id],
      description: params[:description],
      url: params[:url]
    )
    if @resource.save
      flash[:success] = "#{t 'manage.resources.create_success'} #{@model.model_name.human}"
      render json: create_json, status: :ok
    else
      render json: { data: @resource.errors.full_messages.first }, status: :unprocessable_entity
    end
  end

end