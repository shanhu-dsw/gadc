# This migration comes from yyvision_engine (originally 20210107052741)
class CreateEngines < ActiveRecord::Migration[6.1]
  def change
    create_table :engines do |t|
      t.string :full_name
      t.string :secret

      t.string :internal_address, default: '127.0.0.1:7998'
      t.string :external_address, default: '127.0.0.1:7998'

      t.string :workers, default: 1
      t.integer :engine_type, default: 0
      t.integer :device

      t.string :params, default: ''

      t.boolean :cached, default: false

      t.datetime :expired_at
      t.timestamps
    end
  end
end
