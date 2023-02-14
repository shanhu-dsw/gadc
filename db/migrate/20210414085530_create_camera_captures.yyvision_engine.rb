# This migration comes from yyvision_engine (originally 20201225072423)
class CreateCameraCaptures < ActiveRecord::Migration[6.1]
  def change
    create_table :camera_captures do |t|
      t.integer :camera_id
      t.integer :location_id
      t.integer :engine_id

      t.string :img_url

      t.integer :bodies_count, default: 0
      t.integer :portraits_count, default: 0

      t.timestamps
    end

    add_index :camera_captures, :camera_id
    add_index :camera_captures, :location_id
    add_index :camera_captures, :engine_id
  end
end
