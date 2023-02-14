# This migration comes from yyvision_engine (originally 20201224084637)
class CreatePeople < ActiveRecord::Migration[6.1]
  def change
    create_table :people do |t|
      t.string :name
      t.integer :master_portrait_id
      t.integer :portraits_count, default: 0

      t.timestamps
    end
  end
end
