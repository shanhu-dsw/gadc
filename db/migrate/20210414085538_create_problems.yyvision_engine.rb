# This migration comes from yyvision_engine (originally 20210119091955)
class CreateProblems < ActiveRecord::Migration[6.1]
  def change
    create_table :problems do |t|
      t.integer :problem_category_id
      t.integer :admin_id
      t.integer :location_id
      t.integer :discover_type, default: 0

      t.integer :problem_status, default: 0
      t.string :note
      t.datetime :issued_at

      t.string :corrected_admin
      t.datetime :corrected_at
      t.string :corrected_note

      t.string :negated_admin
      t.datetime :negated_at
      t.string :negated_note

      t.timestamps
    end
  end
end
