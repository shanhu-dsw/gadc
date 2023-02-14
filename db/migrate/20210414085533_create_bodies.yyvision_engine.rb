# This migration comes from yyvision_engine (originally 20210109054316)
class CreateBodies < ActiveRecord::Migration[6.1]
  def change
    create_table :bodies do |t|
      t.references :source, polymorphic: true

      t.integer :index

      t.string :box
      t.string :confidence

      t.timestamps
    end

    add_index :bodies, [:source_type, :source_id]
  end
end
