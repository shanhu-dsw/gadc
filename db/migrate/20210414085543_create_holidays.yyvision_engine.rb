# This migration comes from yyvision_engine (originally 20210411011933)
class CreateHolidays < ActiveRecord::Migration[6.1]
  def change
    create_table :holidays do |t|
      t.date :off_date
      t.timestamps
    end
  end
end
