# This migration comes from yyvision_engine (originally 20210628020830)
class AddTimeToSearches < ActiveRecord::Migration[6.1]
  def change
    add_column :portrait_searches, :search_from, :date
    add_column :portrait_searches, :search_to, :date
  end
end
