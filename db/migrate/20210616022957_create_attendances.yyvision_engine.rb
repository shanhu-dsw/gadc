# This migration comes from yyvision_engine (originally 20210601040600)
class CreateAttendances < ActiveRecord::Migration[6.1]
  def change
    create_table :attendances do |t|
      t.integer :person_id
      t.integer :portrait_id
      t.float :confidence

      t.timestamps
    end
  end
end
