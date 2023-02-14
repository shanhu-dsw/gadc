class CheckpointController < ApplicationController
  layout 'checkpoint/application'
  before_action :authenticate_admin_user!

  def current_ability
    @current_ability ||= Ability::AdminAbility.new(current_admin_user)
  end
end
