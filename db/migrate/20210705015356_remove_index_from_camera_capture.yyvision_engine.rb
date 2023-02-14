# This migration comes from yyvision_engine (originally 20210703030102)
class RemoveIndexFromCameraCapture < ActiveRecord::Migration[6.1]
  def change
    remove_index :camera_captures, :camera_id
    remove_index :camera_captures, :location_id
    remove_index :camera_captures, :engine_id
  end
end
