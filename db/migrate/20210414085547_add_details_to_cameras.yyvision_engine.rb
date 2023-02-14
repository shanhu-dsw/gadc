# This migration comes from yyvision_engine (originally 20210413063618)
class AddDetailsToCameras < ActiveRecord::Migration[6.1]
  def change
    add_column :cameras, :marked, :boolean, default: false
  end
end
