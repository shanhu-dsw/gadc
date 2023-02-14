# This migration comes from yyvision_engine (originally 20210514064455)
class AddEngineToPortrait < ActiveRecord::Migration[6.1]
  def change
    add_column :portraits, :engine_id, :integer
    add_column :portraits, :img_url, :string
  end
end
