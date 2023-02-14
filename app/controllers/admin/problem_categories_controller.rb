class Admin::ProblemCategoriesController < Admin::ResourcesController
  include AdminProblemCategoriesConcern

  def tree
    @resources = @model.where(ancestry: nil)
    if params[:category_id] == '0'
      @resources = @model.where(ancestry: nil)
    else
      @resources = @model.find(params[:category_id]).children
    end
    render 'admin/problem_categories/tree', layout: false
  end

  def edit_modal
    @resource = @model.find(params[:id])
    render 'admin/problem_categories/edit_modal', layout: false
  end

  def upload_excel
    require 'csv'
    table = CSV.parse(File.read(params[:file]), headers: true)
    current_row = 1

    begin
      ActiveRecord::Base.transaction do
        table.each do |row|
          current_row = current_row + 1
          parent = row[1] ? ProblemCategory.where(name: row[1]).first : nil

          if row[2].to_s == '原则性问题'
            level = 'serious'
          elsif row[2].to_s == '一般性问题'
            level = 'general'
          elsif row[2].to_s == '普遍性问题'
            level = 'common'
          end

          ProblemCategory.create(name: row[0].to_s, parent: parent, level: level)
        end
      end

      render json: { data: url_for({ action: :index }) }, status: :ok
    rescue => e
      puts e
      render json: { data: "At Row #{current_row.to_s}. #{e}" }, status: :unprocessable_entity
    end

  end

end
