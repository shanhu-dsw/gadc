# This migration comes from yyvision_engine (originally 20220709160940)
class AddColumnToNotifications < ActiveRecord::Migration[6.1]
  def change
    add_column :notifications , :receiver_id, :integer
    add_column :notifications , :url, :string
  end
end