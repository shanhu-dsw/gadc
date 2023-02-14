class Admin::CamerasController < Admin::ResourcesController
  include AdminCamerasConcern


  def location_camera
    render json: Camera.query_location_id(params[:location_id]), status: :ok
  end

  def stats_cameras_group_status
    render json: { online: Camera.accessible_by(current_ability, :read).filterable(filter_params).where(status: 'normal').size,
                   offline: Camera.accessible_by(current_ability, :read).filterable(filter_params).where(status: 'offline').size,
                   corrupted: Camera.accessible_by(current_ability, :read).filterable(filter_params).where(status: 'corrupted').size
    }.as_json, status: :ok
  end

  def upload_excel
    require 'roo'
    xlsx = Roo::Spreadsheet.open(params[:file])
    sheet = xlsx.sheet(0)
    current_row = 1

    begin
      ActiveRecord::Base.transaction do
        sheet.each_row_streaming(offset: 1) do |row|
          current_row = current_row + 1
          location = nil
          location_category = nil

          (0...5).each do |i|
            ancestry = (location ? "#{location.ancestry ? location.ancestry + '/' : ''}#{location.id}" : nil)
            location = Location.find_or_create_by!(name: row[i].to_s, location_level_id: i + 1, ancestry: ancestry)
          end

          (7...9).each do |i|
            ancestry = (location_category ? "#{location_category.ancestry ? location_category.ancestry + '/' : ''}#{location_category.id}" : nil)
            location_category = LocationCategory.find_or_create_by!(name: row[i].to_s, ancestry: ancestry)
          end

          if location
            location.location_category = location_category
            location.setting_event_ids = get_setting_event_ids_by_location_category(location_category)
            location.save!
          end

          Camera.find_or_create_by!(name: row[5].to_s, rtsp: row[6].to_s, location: location)
        end
      end

      render json: { data: url_for({ action: :index }) }, status: :ok
    rescue => e
      puts e
      render json: { data: "At Row #{current_row.to_s}. #{e}" }, status: :unprocessable_entity
    end

  end

  def camera_download_excel
    @resources = @model.accessible_by(current_ability, :read).filterable(filter_params)
    respond_to do |format|
      format.xlsx { headers["Content-Disposition"] = "attachment; filename=\"设备信息.xlsx\"" }
    end
  end

end
