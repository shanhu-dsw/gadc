# This migration comes from yyvision_engine (originally 20210411023820)
class AddObservationToEvent < ActiveRecord::Migration[6.1]
  def change
    add_column :events, :observation, :integer, default: 1
  end
end
