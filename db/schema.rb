# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_08_08_153143) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admins", force: :cascade do |t|
    t.string "full_name"
    t.integer "role"
    t.integer "location_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "bodies", force: :cascade do |t|
    t.string "source_type"
    t.bigint "source_id"
    t.integer "index"
    t.string "box"
    t.string "confidence"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "camera_captures", force: :cascade do |t|
    t.integer "camera_id"
    t.integer "location_id"
    t.integer "engine_id"
    t.string "img_url"
    t.integer "bodies_count", default: 0
    t.integer "portraits_count", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "cameras", force: :cascade do |t|
    t.string "name"
    t.string "rtsp"
    t.integer "status", default: 0
    t.integer "master_camera_capture_id"
    t.integer "location_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "marked", default: false
    t.index ["location_id"], name: "index_cameras_on_location_id"
  end

  create_table "engines", force: :cascade do |t|
    t.string "full_name"
    t.string "secret"
    t.string "internal_address", default: "127.0.0.1:7998"
    t.string "external_address", default: "127.0.0.1:7998"
    t.string "workers", default: "1"
    t.integer "engine_type", default: 0
    t.integer "device"
    t.string "params", default: ""
    t.boolean "cached", default: false
    t.datetime "expired_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "event_cameras", force: :cascade do |t|
    t.integer "event_id"
    t.integer "camera_id"
    t.string "box_a", default: "0.0,0.0,1.0,1.0"
    t.string "box_b"
    t.string "box_c"
    t.string "box_d"
    t.string "line_a"
    t.string "line_b"
    t.boolean "enabled"
    t.float "confidence"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "threshold", default: 10.0
    t.index ["camera_id"], name: "index_event_cameras_on_camera_id"
    t.index ["event_id"], name: "index_event_cameras_on_event_id"
  end

  create_table "event_locations", force: :cascade do |t|
    t.integer "event_id"
    t.integer "location_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["event_id"], name: "index_event_locations_on_event_id"
    t.index ["location_id"], name: "index_event_locations_on_location_id"
  end

  create_table "event_time_ranges", force: :cascade do |t|
    t.time "start_time"
    t.time "end_time"
    t.integer "index"
    t.integer "event_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["event_id"], name: "index_event_time_ranges_on_event_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "name"
    t.string "nickname"
    t.boolean "enabled", default: true
    t.boolean "notify", default: true
    t.float "confidence", default: 0.75
    t.float "tolerance", default: 5.0
    t.float "interval", default: 10.0
    t.float "problem_tolerance", default: 15.0
    t.integer "problem_category_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "observation", default: 1
    t.boolean "if_holiday", default: false
    t.float "threshold", default: 10.0
    t.boolean "if_video", default: false
  end

  create_table "holidays", force: :cascade do |t|
    t.date "off_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "it_ticket_documents", force: :cascade do |t|
    t.integer "it_ticket_id"
    t.integer "index"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "it_tickets", force: :cascade do |t|
    t.string "name"
    t.integer "it_ticket_type"
    t.integer "it_ticket_status", default: 0
    t.integer "it_ticket_level", default: 0
    t.integer "user_id"
    t.string "note"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "location_categories", force: :cascade do |t|
    t.string "name"
    t.integer "index"
    t.string "ancestry"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ancestry"], name: "index_location_categories_on_ancestry"
  end

  create_table "location_event_camera_captures", force: :cascade do |t|
    t.integer "location_event_id"
    t.integer "camera_capture_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "location_events", force: :cascade do |t|
    t.integer "location_id"
    t.integer "event_id"
    t.datetime "active_at"
    t.float "length"
    t.integer "problem_id"
    t.boolean "active", default: true
    t.string "video_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "master_camera_capture_id"
    t.boolean "verified", default: false
    t.index ["event_id"], name: "index_location_events_on_event_id"
    t.index ["location_id"], name: "index_location_events_on_location_id"
  end

  create_table "location_levels", force: :cascade do |t|
    t.string "name"
    t.integer "index", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "locations", force: :cascade do |t|
    t.boolean "physical", default: false
    t.string "name"
    t.integer "engine_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "ancestry"
    t.integer "location_category_id"
    t.integer "location_level_id"
    t.float "lon"
    t.float "lat"
    t.integer "location_type"
    t.index ["ancestry"], name: "index_locations_on_ancestry"
    t.index ["engine_id"], name: "index_locations_on_engine_id"
  end

  create_table "notification_attachments", force: :cascade do |t|
    t.integer "notification_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "notification_views", force: :cascade do |t|
    t.boolean "viewed", default: false
    t.integer "admin_id"
    t.integer "notification_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.integer "admin_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "receiver_id"
    t.string "url"
  end

  create_table "problem_categories", force: :cascade do |t|
    t.integer "level", default: 0
    t.string "ancestry"
    t.string "name"
    t.integer "index"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ancestry"], name: "index_problem_categories_on_ancestry"
  end

  create_table "problem_corrections", force: :cascade do |t|
    t.integer "problem_id"
    t.integer "index"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "problem_evidences", force: :cascade do |t|
    t.integer "problem_id"
    t.integer "index"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "problems", force: :cascade do |t|
    t.integer "problem_category_id"
    t.integer "admin_id"
    t.integer "location_id"
    t.integer "discover_type", default: 0
    t.integer "problem_status", default: 0
    t.string "note"
    t.datetime "issued_at"
    t.string "corrected_admin"
    t.datetime "corrected_at"
    t.string "corrected_note"
    t.string "negated_admin"
    t.datetime "negated_at"
    t.string "negated_note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "reviewing_admin"
    t.datetime "reviewing_at"
    t.string "reviewing_note"
    t.integer "master_camera_capture_id"
    t.datetime "active_at"
  end

  create_table "settings", force: :cascade do |t|
    t.string "index"
    t.string "name"
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_settings_on_name", unique: true
    t.index ["value"], name: "index_settings_on_value"
  end

  create_table "user_views", force: :cascade do |t|
    t.integer "user_id"
    t.string "view_controller"
    t.string "view_action"
    t.string "view_params"
    t.string "ip_address"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "username"
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "full_name", default: ""
    t.string "source_type"
    t.bigint "source_id"
    t.string "token"
    t.datetime "token_created_at"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "provider"
    t.string "uid"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true, where: "(email IS NOT NULL)"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["source_type", "source_id"], name: "index_users_on_source"
    t.index ["source_type", "source_id"], name: "index_users_on_source_type_and_source_id"
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true, where: "(username IS NOT NULL)"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
end
