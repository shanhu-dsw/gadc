class Ability::ApiAbility
  include CanCan::Ability

  def initialize(user)

    if user
      if user.source.class.name == 'Admin'
        can [:read], Admin, id: user.source_id
        can [:read], Camera
        can [:read], LocationEvent, location: { id: user.source.location.subtree_ids }
        can [:read, :create], Problem, location: { id: user.source.location.subtree_ids }
        can :create, ProblemEvidence
        can :update, Problem, location: { id: user.source.location.subtree_ids }
        can :read, ProblemCategory
        can :read, Location
        can :read, :base64, CameraCapture
      end

      if user.source.class.name == 'Engine'
        can :read, Engine
        can :read, Location
        can :read, Event
        can :read, Holiday

        can :update, Camera
        can :create, CameraCapture
        can [:create, :update], LocationEvent
      end
    end
  end
end