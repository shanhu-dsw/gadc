# This migration comes from yyvision_engine (originally 20210601032519)
class AddThresholdToEvent < ActiveRecord::Migration[6.1]
  def change
    add_column :events, :threshold, :float, default: 10
    add_column :event_cameras, :threshold, :float, default: 10
  end
end
