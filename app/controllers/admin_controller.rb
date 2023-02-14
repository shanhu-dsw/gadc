class AdminController < ApplicationController
  before_action :check_license
  include AdminControllerConcern

  def check_license
    # x = RGLoader::get_const('x')
    # puts '@@@@@@@@@@@@@@@@@@@@'
    # puts x
  end

  def setup_routes
    @routes = [
      {
        name: "信息总览",
        url: url_for({ controller: :dashboard, action: :index }),
        icon: "tim-icons icon-chart-pie-36",
        can: (can? :index, :dashboard)
      },
      {
        name: "极速巡查",
        url: url_for({ controller: :camera_captures, action: :index }),
        icon: "tim-icons icon-atom",
        can: (can? :read, CameraCapture)
      },
      {
        name: "智能预警",
        url: url_for({ controller: :location_events, action: :index }),
        icon: "tim-icons icon-bell-55",
        can: (can? :read, LocationEvent)
      },
      {
        name: "问题管理",
        url: url_for({ controller: :problems, action: :index }),
        icon: "tim-icons icon-app",
        can: (can? :read, Problem)
      },
      {
        name: "督察地图",
        url: url_for({ controller: :locations, action: :map }),
        icon: "tim-icons icon-square-pin",
        can: (can? :map, Location)
      },
      {
        name: "智能报告",
        url: url_for({ controller: :problems, action: :report }),
        icon: "tim-icons icon-notes",
        can: (can? :report, Problem)
      },
      {
        name: "通知管理",
        url: url_for({ controller: :notifications, action: :index }),
        icon: "tim-icons icon-volume-98",
        can: (can? :read, Notification)
      },
      {
        name: "监控管理",
        url: 'sidebar-cameras',
        icon: "tim-icons icon-video-66",
        can: (can? :read, Camera),
        children: [
          {
            short_name: '地点',
            name: "地点管理",
            url: url_for({ controller: :locations, action: :index }),
            can: (can? :read, Location)
          },
          {
            short_name: '监控',
            name: "摄像头管理",
            url: url_for({ controller: :cameras, action: :index }),
            can: (can? :read, Camera)
          }
        ]
      },
      {
        name: "综合管理",
        icon: "tim-icons icon-molecule-40",
        url: 'sidebar-settings',
        can: (can? :manage, Admin) || (can? :read, Event) || (can? :read, Holiday),
        children: [
          {
            short_name: '人员',
            name: "人员管理",
            url: url_for({ controller: :admins, action: :index }),
            can: (can? :manage, Admin)
          },
          {
            short_name: '预警',
            name: "预警设置",
            url: url_for({ controller: :events, action: :index }),
            can: (can? :read, Event)
          },
          {
            short_name: '假期',
            name: "假期管理",
            url: url_for({ controller: :holidays, action: :index }),
            can: (can? :read, Holiday)
          },
        ]
      },
      {
        name: "系统设置",
        icon: "tim-icons icon-settings-gear-63",
        url: 'sidebar-system',
        can: (can? :manage, ProblemCategory) || (can? :manage, LocationCategory) || (can? :manage, LocationLevel) || (can? :manage, Engine),
        children: [
          {
            short_name: '问题',
            name: "问题类型",
            url: url_for({ controller: :problem_categories, action: :index }),
            can: (can? :manage, ProblemCategory)
          },
          {
            short_name: '地点',
            name: "地点类型",
            url: url_for({ controller: :location_categories, action: :index }),
            can: (can? :manage, LocationCategory)
          },
          {
            short_name: '等级',
            name: "地点等级",
            url: url_for({ controller: :location_levels, action: :index }),
            can: (can? :manage, LocationLevel)
          },
          {
            short_name: '引擎',
            name: "引擎管理",
            url: url_for({ controller: :engines, action: :index }),
            can: (can? :manage, Engine)
          },
        ]
      }
    ]
  end
end