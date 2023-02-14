# This migration comes from yyvision_engine (originally 20210329100356)
class CreateProblemCorrections < ActiveRecord::Migration[6.1]
  def change
    create_table :problem_corrections do |t|
      t.integer :problem_id
      t.integer :index

      t.timestamps
    end
  end
end
