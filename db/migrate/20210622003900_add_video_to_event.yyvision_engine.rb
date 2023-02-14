# This migration comes from yyvision_engine (originally 20210622003537)
class AddVideoToEvent < ActiveRecord::Migration[6.1]
  def change
    add_column :events, :if_video, :boolean, default: false
  end
end
