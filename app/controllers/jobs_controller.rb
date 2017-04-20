class JobsController < ApplicationController
  before_action :authenticate_user! , only: [:new, :create]
  before_action :validate_search_key, only: [:search]
  def index
    @jobs = case params[:order]
      when 'by_upper_bound'
        Job.publish.order('wage_upper_bound DESC').paginate(:page => params[:page], :per_page => 10)
      when 'by_lower_bound'
        Job.publish.order('wage_lower_bound DESC').paginate(:page => params[:page], :per_page => 10)
      else
        Job.publish.recent.paginate(:page => params[:page], :per_page => 10)
      end
  end

  def show
    @job = Job.find(params[:id])
    if @job.is_hidden
        redirect_to root_path, alert: "你没有查看该职位的权限"
    end
  end

  def search
    if @query_string.present?
      search_result = Job.publish.ransack(@search_criteria).result(:distinct => true)
      @jobs = search_result.paginate(:page => params[:page], :per_page => 5 )
    else
      flash[:alert] = "没有搜索到相关职位"
      @jobs = Job.publish.recent.paginate(:page => params[:page], :per_page => 5)
    end
  end


  private

  def job_params
    params.require(:job).permit(:title, :description, :wage_upper_bound, :wage_lower_bound, :contact_email, :is_hidden, :category_name, :location, :company_name, :company_url)
  end

  def validate_search_key
    @query_string = params[:q].gsub(/\\|\'|\/|\?/, "") if params[:q].present?
    @search_criteria = search_criteria(@query_string)
  end

  def search_criteria(query_string)
    { :title_or_description_or_category_name_or_company_name_or_location_cont => query_string }
  end
end
