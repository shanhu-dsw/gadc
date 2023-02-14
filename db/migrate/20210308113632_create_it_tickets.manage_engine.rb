# This migration comes from manage_engine (originally 20210122034752)
class CreateItTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :it_tickets do |t|
      t.string :name

      t.integer :it_ticket_type
      t.integer :it_ticket_status, default: 0
      t.integer :it_ticket_level, default: 0

      t.integer :user_id

      t.string :note
      t.string :description

      t.timestamps
    end
  end
end
