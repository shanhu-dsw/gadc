# This migration comes from yyvision_engine (originally 20210321113107)
class CreateLocationCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :location_categories do |t|
      t.string :name
      t.integer :index
      t.string :ancestry
      t.timestamps
    end
    add_index :location_categories, :ancestry
  end
end
