# This migration comes from manage_engine (originally 20210108024435)
class CreateSettings < ActiveRecord::Migration[6.1]
  def change
    create_table :settings do |t|

      t.string :index
      t.string :name
      t.string :value

      t.timestamps
    end

    add_index :settings, :name, unique: true
    add_index :settings, :value
  end
end
