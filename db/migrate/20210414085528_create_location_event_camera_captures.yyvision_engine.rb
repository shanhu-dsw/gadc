# This migration comes from yyvision_engine (originally 20201225071001)
class CreateLocationEventCameraCaptures < ActiveRecord::Migration[6.1]
  def change
    create_table :location_event_camera_captures do |t|
      t.integer :location_event_id
      t.integer :camera_capture_id

      t.timestamps
    end
  end
end
