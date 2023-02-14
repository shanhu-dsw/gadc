# This migration comes from yyvision_engine (originally 20201224084941)
class CreateBanks < ActiveRecord::Migration[6.1]
  def change
    create_table :banks do |t|
      t.string :name
      t.integer :index

      t.string :ancestry
      t.timestamps
    end

    add_index :banks, :ancestry
  end
end
