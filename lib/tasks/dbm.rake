namespace :dbm do
  task load_holiday: :environment do

    d = Time.zone.now

    while d < Time.zone.now + 1.year
      date = d.to_date
      Holiday.create(off_date: date) if date.wday == 0 || date.wday == 6
      d = d + 1.day
    end

  end
  
  task clean_camera_captures: :environment do
    interval = (ENV['CACHE_INTERVAL'] ? ENV['CACHE_INTERVAL'].to_i : 30).to_i
    num_threads = 5

    threads = num_threads.times.map do |i|
      Thread.new do
        Rails.application.executor.wrap do

          # puts "####################### Thread #{i} Destroying Location Events #######################"
          # LocationEvent.where('created_at <= ? AND id % ? = ?', Time.zone.now - interval.days, num_threads, i).each do |location_event|
          #   if location_event.destroy
          #     puts "SUCCESS #{location_event.id}"
          #   else
          #     puts "FAILED #{location_event.id} #{location_event.errors.full_messages.first}"
          #   end
          # end

          puts "####################### Thread #{i} Destroying Camera Captures #######################"
          CameraCapture.where('created_at <= ? AND id % ? = ?', Time.zone.now - interval.days, num_threads, i).first(100000).each do |camera_capture|

            camera_capture.portraits.each do |portrait|
              portrait.img.purge if portrait.img.attached?
            end

            camera_capture.img.purge if camera_capture.img.attached?
            if camera_capture.destroy
              puts "SUCCESS #{camera_capture.id}"
            else
              puts "FAILED #{camera_capture.id} #{camera_capture.errors.full_messages.first}"
            end
          end

          puts "####################### Thread #{i} Destroying User Views #######################"
          UserView.where('created_at <= ? AND id % ? = ?', Time.zone.now - interval.days, num_threads, i).each do |user_view|
            if user_view.destroy
              puts "SUCCESS #{user_view.id}"
            else
              puts "FAILED #{user_view.id} #{user_view.errors.full_messages.first}"
            end
          end
        end
      end
    end
    threads.each do |t|
      t.join
    end
  end

  task refresh_locations: :environment do
    Location.all.each do |location|
      location.update_column(:physical, location.cameras.size > 0)
    end
  end
end
