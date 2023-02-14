# This migration comes from yyvision_engine (originally 20210118031650)
class CreatePortraitSearches < ActiveRecord::Migration[6.1]
  def change
    create_table :portrait_searches do |t|
      t.integer :portrait_id
      t.integer :admin_id
      t.integer :size, default: 10
      t.float :confidence, default: 0.75
      t.string :source_type

      t.timestamps
    end

    add_index :portrait_searches, :portrait_id
  end
end
