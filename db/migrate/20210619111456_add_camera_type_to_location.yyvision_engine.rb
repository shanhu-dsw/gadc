# This migration comes from yyvision_engine (originally 20210617094908)
class AddCameraTypeToLocation < ActiveRecord::Migration[6.1]
  def change
    add_column :locations, :location_type, :integer
  end
end
