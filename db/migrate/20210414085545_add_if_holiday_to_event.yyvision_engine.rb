# This migration comes from yyvision_engine (originally 20210411093555)
class AddIfHolidayToEvent < ActiveRecord::Migration[6.1]
  def change
    add_column :events, :if_holiday, :boolean, default: false
  end
end
