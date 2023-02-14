# This migration comes from yyvision_engine (originally 20210119091557)
class CreateProblemCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :problem_categories do |t|
      t.integer :level, default: 0
      t.string :ancestry
      t.string :name
      t.integer :index
      t.timestamps
    end

    add_index :problem_categories, :ancestry
  end
end
