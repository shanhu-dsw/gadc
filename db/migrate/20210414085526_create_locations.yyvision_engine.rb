# This migration comes from yyvision_engine (originally 20201225070957)
class CreateLocations < ActiveRecord::Migration[6.1]
  def change
    create_table :locations do |t|
      t.boolean :physical, default: false
      t.string :name

      t.integer :engine_id
      t.timestamps

      t.string :ancestry
      t.integer :location_category_id
      t.integer :location_level_id

      t.float :lon
      t.float :lat
    end

    add_index :locations, :engine_id
    add_index :locations, :ancestry
  end
end
