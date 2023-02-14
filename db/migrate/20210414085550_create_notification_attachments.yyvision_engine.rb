# This migration comes from yyvision_engine (originally 20210413081457)
class CreateNotificationAttachments < ActiveRecord::Migration[6.1]
  def change
    create_table :notification_attachments do |t|

      t.integer :notification_id

      t.timestamps
    end
  end
end
