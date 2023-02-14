# This migration comes from yyvision_engine (originally 20210619123819)
class AddActiveAtToProblem < ActiveRecord::Migration[6.1]
  def change
    add_column :problems, :active_at, :datetime
  end
end
