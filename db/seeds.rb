# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

ActiveRecord::Base.transaction do

  ['省', '地级市', '区县', '单位', '房间'].each_with_index do |name, index|
    LocationLevel.create!(name: name, index: index)
  end

  Engine.create!(full_name: '解码引擎', device: -1, workers: 4, engine_type: :capture, internal_address: '0.0.0.0:8998', external_address: '0.0.0.0:8998', cached: true, params: '2')
  Engine.create!(full_name: '智能引擎', device: 0, workers: 2, engine_type: :vision, internal_address: '0.0.0.0:7998', external_address: '0.0.0.0:7998')

  location = Location.create!(name: '默认地区', location_level: LocationLevel.find_by_name('省'))

  Admin.create!(full_name: "超级管理员", role: :superadmin, location: location, user_attributes: { username: "superadmin", password: 'aaduchaaa!' })
  Admin.create!(full_name: "管理员", role: :admin, location: location, user_attributes: { username: "admin", password: '123456' })

  Event.create!(name: '夜间异动', nickname: 'unusual_movement', tolerance: 0, problem_tolerance: 5, interval: 30, confidence: 0.8,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '06:00:00' }, { start_time: '22:00:00', end_time: '23:59:59' }])

  Event.create!(name: '服务岗位脱空岗', nickname: 'disappear', tolerance: 10, problem_tolerance: 30, interval: 180, confidence: 0.65, if_holiday: true,
                event_time_ranges_attributes: [{ start_time: '08:30:00', end_time: '11:30:00' }, { start_time: '14:00:00', end_time: '17:00:00' }])

  Event.create!(name: '值班岗位脱空岗', nickname: 'disappear', tolerance: 10, problem_tolerance: 30, interval: 180, confidence: 0.65,
                event_time_ranges_attributes: [{ start_time: '08:00:00', end_time: '22:00:00' }])

  Event.create!(name: '禁区闯入', nickname: 'forbidden_zone', tolerance: 0, problem_tolerance: 10, interval: 30, confidence: 0.8,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '人员倒地', nickname: 'people_falling', tolerance: 0, problem_tolerance: 10, interval: 10, confidence: 0.8,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '人员聚集', nickname: 'people_crowded', tolerance: 1, problem_tolerance: 5, interval: 30, confidence: 0.7,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '人员攀高', nickname: 'people_climbing', tolerance: 0, problem_tolerance: 10, interval: 10, confidence: 0.75,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '肢体冲突', nickname: 'people_fighting', tolerance: 0, problem_tolerance: 5, interval: 10, confidence: 0.75,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '单人讯询问', nickname: 'single_asking', tolerance: 10, problem_tolerance: 20, interval: 120, confidence: 0.65,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '武器库异动', nickname: 'unusual_movement', tolerance: 0, problem_tolerance: 10, interval: 60, confidence: 0.8,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '单人进入枪库', nickname: 'single_weapon', tolerance: 0, problem_tolerance: 10, interval: 60, confidence: 0.8,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '监所大门异动', nickname: 'unusual_movement', tolerance: 0, problem_tolerance: 10, interval: 10, confidence: 0.8,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '未戴口罩', nickname: 'no_mask', tolerance: 5, problem_tolerance: 30, interval: 60, confidence: 0.1,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '未穿戴反光背心', nickname: 'no_reflective_vest', tolerance: 5, problem_tolerance: 30, interval: 60, confidence: 0.6,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '车辆拥堵', nickname: 'car_crowded', tolerance: 5, problem_tolerance: 30, interval: 60, confidence: 0.1,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '单人拦检', nickname: 'single_checkpoint', tolerance: 5, problem_tolerance: 30, interval: 60, confidence: 0.7,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '无人拦检', nickname: 'no_checkpoint', tolerance: 5, problem_tolerance: 30, interval: 60, confidence: 0.7,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '引导分流民警不在岗', nickname: 'disappear', tolerance: 5, problem_tolerance: 30, interval: 60, confidence: 0.6,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  Event.create!(name: '执勤区民警不在岗', nickname: 'disappear', tolerance: 5, problem_tolerance: 30, interval: 60, confidence: 0.6,
                event_time_ranges_attributes: [{ start_time: '00:00:00', end_time: '23:59:59' }])

  EventLocation.create!(location: location, event_id: 1)
  EventLocation.create!(location: location, event_id: 2)
  EventLocation.create!(location: location, event_id: 3)
  EventLocation.create!(location: location, event_id: 4)
  EventLocation.create!(location: location, event_id: 8)

  Camera.create!(name: '测试1',
                 location: location,
                 rtsp: '
                 



')

  ProblemCategory.create(name: '默认问题分类')
end


