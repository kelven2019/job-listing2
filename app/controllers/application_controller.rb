class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def require_is_admin
    if !current_user.admin?
      redirect_to jobs_path, alert: "你不是公司HR，没有权限进行相关操作"
    end
  end


end
def search
  if @query_string.present?
    search_result = Job.publish.ransack(@search_criteria).result(:distinct => true)
    @jobs = search_result.paginate(:page => params[:page], :per_page => 5 )
    @suggests = Job.publish.random5
  elsif @query_string.blank?
    flash[:alert] = "搜索关键词不能为空"
    @jobs = Job.publish.recent.paginate(:page => params[:page], :per_page => 5)
    @suggests = Job.publish.random5
  else
    flash[:alert] = "没有搜索到相关职位"
    @jobs = Job.publish.recent.paginate(:page => params[:page], :per_page => 5)
    @suggests = Job.publish.random5
  end
end
