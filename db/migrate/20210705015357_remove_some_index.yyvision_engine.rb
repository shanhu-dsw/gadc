# This migration comes from yyvision_engine (originally 20210703071613)
class RemoveSomeIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :portrait_searches, column: :portrait_id
    remove_index :portrait_search_results, column: :portrait_search_id
    remove_index :bodies, name: 'index_bodies_on_source'
    remove_index :bodies, name: 'index_bodies_on_source_type_and_source_id'
    remove_index :bodies, name: 'index_portraits_on_source'
    remove_index :portraits, name: 'index_portraits_on_source_type_and_source_id'
  end
end
