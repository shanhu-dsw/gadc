class Admin::DashboardController < AdminController

  def index
  end

  def simulate_data
    @simulate_data_arr = [2401325, 2398170, 2439811, 2413189, 2399537, 2429183]
    @today_data = (100569*Time.now.strftime('%H').to_i) + (66 * Time.now.strftime('%S').to_i)
    @simulate_data_arr.push(@today_data)

    @result = {}
    @data = Problem.group_by_day(:created_at, last: 7).count
    @index = 0
    @data.each do |k,v|
      puts v
      @result[k] = @simulate_data_arr[@index]
      @index = @index + 1
    end
    render json: {data: @result}.as_json, status: :ok
  end

  def system_overview_table
    render 'admin/dashboard/system_overview_table', layout: false
  end

  private

end
