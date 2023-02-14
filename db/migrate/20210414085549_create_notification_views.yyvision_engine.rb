# This migration comes from yyvision_engine (originally 20210413081426)
class CreateNotificationViews < ActiveRecord::Migration[6.1]
  def change
    create_table :notification_views do |t|

      t.boolean :viewed, default: false
      t.integer :admin_id
      t.integer :notification_id

      t.timestamps
    end
  end
end
