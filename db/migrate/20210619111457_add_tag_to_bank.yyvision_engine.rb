# This migration comes from yyvision_engine (originally 20210618045133)
class AddTagToBank < ActiveRecord::Migration[6.1]
  def change
    add_column :banks, :if_black, :boolean, default: false
    add_column :banks, :if_red, :boolean, default: false
  end
end
