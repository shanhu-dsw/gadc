# This migration comes from yyvision_engine (originally 20201225071000)
class CreateLocationEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :location_events do |t|
      t.integer :location_id
      t.integer :event_id

      t.datetime :active_at
      t.float :length
      t.integer :problem_id

      t.boolean :active, default: true

      t.string :video_url
      t.timestamps
    end

    add_index :location_events, :location_id
    add_index :location_events, :event_id
  end
end
