# This migration comes from yyvision_engine (originally 20201224084857)
class CreatePortraits < ActiveRecord::Migration[6.1]
  def change
    create_table :portraits do |t|
      t.references :source, polymorphic: true

      t.integer :target_id
      t.float :target_confidence

      t.text :features

      t.integer :index

      t.string :box
      t.string :confidence

      t.timestamps
    end

    add_index :portraits, [:source_type, :source_id]
  end
end
