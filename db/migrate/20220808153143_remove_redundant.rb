class RemoveRedundant < ActiveRecord::Migration[6.1]
  def change
    drop_table :banks
    drop_table :bank_people
    drop_table :attendances
    drop_table :people
    drop_table :portraits
    drop_table :portrait_searches
    drop_table :portrait_search_results
    drop_table :uploads
  end
end
