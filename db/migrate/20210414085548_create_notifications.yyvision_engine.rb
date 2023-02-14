# This migration comes from yyvision_engine (originally 20210413081417)
class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications do |t|

      t.string  :name
      t.string  :description
      t.integer :admin_id

      t.timestamps
    end
  end
end
