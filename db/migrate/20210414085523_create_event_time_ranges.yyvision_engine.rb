# This migration comes from yyvision_engine (originally 20201224101337)
class CreateEventTimeRanges < ActiveRecord::Migration[6.1]
  def change
    create_table :event_time_ranges do |t|
      t.time :start_time
      t.time :end_time
      t.integer :index

      t.integer :event_id

      t.timestamps
    end

    add_index :event_time_ranges, :event_id
  end
end
