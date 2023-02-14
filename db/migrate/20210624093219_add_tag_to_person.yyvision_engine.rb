# This migration comes from yyvision_engine (originally 20210624090201)
class AddTagToPerson < ActiveRecord::Migration[6.1]
  def change
    add_column :people, :if_black, :boolean, default: false
    add_column :people, :if_red, :boolean, default: false
  end
end
