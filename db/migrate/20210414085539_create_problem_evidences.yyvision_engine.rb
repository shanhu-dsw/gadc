# This migration comes from yyvision_engine (originally 20210316122839)
class CreateProblemEvidences < ActiveRecord::Migration[6.1]
  def change
    create_table :problem_evidences do |t|
      t.integer :problem_id
      t.integer :index

      t.timestamps
    end
  end
end
