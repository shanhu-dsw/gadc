# This migration comes from yyvision_engine (originally 20201224102424)
class CreateEventCameras < ActiveRecord::Migration[6.1]
  def change
    create_table :event_cameras do |t|
      t.integer :event_id
      t.integer :camera_id

      t.string :box_a, default: '0.0,0.0,1.0,1.0'
      t.string :box_b
      t.string :box_c
      t.string :box_d

      t.string :line_a
      t.string :line_b

      t.boolean :enabled
      t.float :confidence

      t.timestamps
    end

    add_index :event_cameras, :event_id
    add_index :event_cameras, :camera_id
  end
end
