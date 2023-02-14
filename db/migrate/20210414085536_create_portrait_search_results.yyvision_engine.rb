# This migration comes from yyvision_engine (originally 20210118031717)
class CreatePortraitSearchResults < ActiveRecord::Migration[6.1]
  def change
    create_table :portrait_search_results do |t|
      t.integer :portrait_search_id
      t.integer :target_id
      t.float :target_confidence

      t.timestamps
    end

    add_index :portrait_search_results, :portrait_search_id
  end
end
