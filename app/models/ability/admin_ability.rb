class Ability::AdminAbility
  include CanCan::Ability

  def initialize(user)

    if user.source.superadmin?
      can :manage, :all
    elsif user.source.admin?
      can [:index, :system_overview_table], :dashboard

      can [:read], CameraCapture, camera: { location_id: user.source.location.subtree_ids }

      can [:read, :stats_location_events_group_status, :change_active], LocationEvent, location: { id: user.source.location.subtree_ids }

      can [:create, :report, :report_problems, :report_generation_0, :report_generation_1, :report_generation_2, :report_generation_3, :report_generation_4, :report_generation_5, :stats_problem_group_division,
           :stats_problem_map_modal, :stats_problem_group_type], Problem

      can [:read], Problem, location: { id: user.source.location.subtree_ids }
      can :update, Problem, location: { id: user.source.location.subtree_ids }

      can [:read, :get_category_select, :upload_excel], ProblemCategory

      # can :read, Notification
      can :read, Notification, receiver_id: user.source.id
      can [:push, :create_push], Notification
      can :read, Holiday

      can :create, Admin
      can :manage, Admin, location: { id: user.source.location.subtree_ids }
      can [:read, :stats_cameras_group_status], Camera, location: { id: user.source.location.subtree_ids }

      can [:read, :stats_location_group_data, :map, :upload_excel], Location, id: user.source.location.subtree_ids
      can [:read, :tree, :map_json], Location, id: user.source.location.subtree_ids

      can :create, ProblemCorrection
      can :create, ProblemEvidence

      if ENV['NEED_LOCATION_EVENT_VERIFIED'] == '1'
        cannot :read, LocationEvent, verified: false
      end

    elsif user.source.staff?
      can [], CameraCapture, camera: { location_id: user.source.location.subtree_ids }
      can [:report_generation_0, :report_generation_1, :stats_problem_group_division,
           :stats_problem_map_modal, :stats_problem_group_type], Problem
      can [:read], Problem, location: { id: user.source.location.subtree_ids }
      can [:read], LocationEvent, location: { id: user.source.location.subtree_ids }
      can :read, Notification, receiver_id: user.source.id

      if ENV['NEED_LOCATION_EVENT_VERIFIED'] == '1'
        cannot :read, LocationEvent, verified: false
      end
    end

    # cannot [:create, :update], LocationEvent
  end
end
