# This migration comes from yyvision_engine (originally 20201224101400)
class CreateEventLocations < ActiveRecord::Migration[6.1]
  def change
    create_table :event_locations do |t|
      t.integer :event_id
      t.integer :location_id

      t.timestamps
    end

    add_index :event_locations, :location_id
    add_index :event_locations, :event_id
  end
end
