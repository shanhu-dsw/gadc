# This migration comes from yyvision_engine (originally 20210118014038)
class CreateUploads < ActiveRecord::Migration[6.1]
  def change
    create_table :uploads do |t|
      t.integer :admin_id
      t.integer :upload_type, default: 0
      t.integer :portraits_count, default: 0
      t.timestamps
    end
  end
end
