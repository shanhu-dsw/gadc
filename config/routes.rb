Rails.application.routes.draw do

  namespace :admin do
    devise_for :users

    get 'problems/report'
    get 'problems/report_problems'
    get 'problems/report_generation_0'
    get 'problems/report_generation_1'
    get 'problems/report_generation_2'
    get 'problems/report_generation_3'
    get 'problems/report_generation_4'
    get 'problems/report_generation_5'
    get 'problems/report_generation_6'
    get 'problems/report_generation_7'
    get 'problems/report_generation_8'
    get 'problems/report_generation_9'
    get 'problems/report_generation_10'
    get 'problems/report_generation_11'
    get 'problems/report_generation_12'
    get 'problems/report_generation_13'
    get 'problems/report_generation_14'
    get 'problems/report_generation_15'

    get 'problems/problem_download_excel'

    get 'cameras/camera_download_excel'

    get 'dashboard/simulate_data'

    get 'locations/map'
    get 'locations/tree/:id', to: 'locations#tree'
    get 'locations/map_json', to: 'locations#map_json'
    get 'locations/location_children/:id', to: 'locations#location_children'
    get 'locations/edit_modal/:id', to: 'locations#edit_modal'

    get 'location_categories/tree', to: 'location_categories#tree'
    get 'location_categories/edit_modal/:id', to: 'location_categories#edit_modal'

    get 'dashboard/index', to: 'dashboard#index'
    get 'dashboard/system_overview_table', to: 'dashboard#system_overview_table'
    get 'camera_captures/show', to: 'camera_captures#show'
    get 'camera_captures/history', to: 'camera_captures#history'
    get 'camera_captures/remote_show/:id', to: 'camera_captures#remote_show'

    root 'dashboard#index'
    post 'cameras/upload_excel'
    post 'problem_categories/upload_excel'
    get 'problem_categories/tree', to: 'problem_categories#tree'
    get 'problem_categories/edit_modal/:id', to: 'problem_categories#edit_modal'

    #AJAX
    get 'cameras/stats_cameras_group_status'
    get 'cameras/location_camera', to: 'cameras#location_camera'
    get 'location_events/stats_location_events_group_status'
    patch 'location_events/change_active'
    patch 'location_events/change_verified'
    patch 'location_events/change_event'
    get 'location_events/create_event_capture'

    get 'problems/stats_problem_group_type'
    get 'problems/stats_problem_group_division'
    get 'problems/stats_problem_map_modal'
    get 'problems/change_evidence_time'
    get 'problems/open_problem_show'
    get 'problems/layout_report'
    get 'locations/stats_location_group_data'
    get 'locations/stats_big_problem_map_modal'
    get 'notifications/push', to: 'notifications#push'
    post 'notifications/create_push', to: 'notifications#create_push'

    resources :admins
    resources :engines
    resources :location_events
    resources :problems
    resources :problem_evidences
    resources :problem_corrections
    resources :cameras
    resources :events
    resources :event_cameras
    resources :problem_categories
    resources :locations
    resources :camera_captures
    resources :location_levels
    resources :location_categories
    resources :holidays
    resources :notifications
    resources :notification_attachments
  end

  namespace :api do

    get 'auth/current'
    post 'auth/logout'
    post 'auth/validate_username_password'
    post 'auth/validate_email_password'
    get 'camera_captures/base64', to: 'camera_captures#base64'

    resources :events, only: [:index]
    resources :admins, only: [:show]
    resources :cameras, only: [:index, :show, :update]
    resources :camera_captures, only: [:read, :create]
    resources :location_events, only: [:index, :show, :create, :update]
    resources :problems, only: [:index, :show, :create, :update, :destroy]
    resources :problem_evidences, only: [:create]
    resources :problem_categories, only: [:index]
    resources :locations, only: [:index]
    resources :engines, only: [:index]
    resources :portraits, only: [:index]
    resources :holidays, only: [:index]
  end

  namespace :exhibition do
    devise_for :users
    get 'dashboard/index', to: 'dashboard#index'
    get 'dashboard/places', to: 'dashboard#places'
    get 'dashboard/get_radar_chart', to: 'dashboard#get_radar_chart'
    get 'dashboard/get_scatter_chart', to: 'dashboard#get_scatter_chart'

    get 'problems/stats_problem_group_type'
    get 'camera_captures/show', to: 'camera_captures#show'
    get 'camera_captures/history', to: 'camera_captures#history'
    get 'camera_captures/remote_show/:id', to: 'camera_captures#remote_show'
    get 'cameras/camera_download_excel'
    post 'cameras/upload_excel'

    get 'problems/open_problem_show'
    get 'problems/report'

    resources :camera_captures
    resources :problems
    resources :problem_evidences
    resources :problem_corrections
    resources :location_events
    resources :events
    resources :cameras
    resources :locations
    resources :event_cameras
    resources :admins

    root 'dashboard#index'
  end

  namespace :checkpoint do
    devise_for :users
    get 'dashboard/index', to: 'dashboard#index'
    get 'dashboard/places', to: 'dashboard#places'
    get 'dashboard/problems_group_by_status'
    get 'dashboard/location_events_group_by_event'

    resources :location_events, only: [:index, :show]
    root 'dashboard#index'
  end

  namespace :devtest do
    get 'home/index', to: 'home#index'
    get 'home/show', to: 'home#show'
  end

  root 'admin/dashboard#index'
end
