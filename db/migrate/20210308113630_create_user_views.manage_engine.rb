# This migration comes from manage_engine (originally 20201228095731)
class CreateUserViews < ActiveRecord::Migration[6.1]
  def change
    create_table :user_views do |t|
      t.integer :user_id

      t.string :view_controller
      t.string :view_action
      t.string :view_params

      t.string :ip_address

      t.timestamps
    end
  end
end
