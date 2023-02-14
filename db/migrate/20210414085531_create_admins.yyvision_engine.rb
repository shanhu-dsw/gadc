# This migration comes from yyvision_engine (originally 20201228042119)
class CreateAdmins < ActiveRecord::Migration[6.1]
  def change
    create_table :admins do |t|
      t.string :full_name
      t.integer :role

      t.integer :location_id
      t.timestamps
    end
  end
end
