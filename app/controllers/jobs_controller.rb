class JobsController < ApplicationController
  before_action :authenticate_user! , only: [:new, :create, :show]
  def index
    @jobs = case params[:order]
      when 'by_upper_bound'
        Job.where(is_hidden: false).order('wage_upper_bound DESC')
      when 'by_lower_bound'
        Job.where(is_hidden: false).order('wage_lower_bound DESC')
      else
        Job.where(is_hidden: false).order('created_at DESC')
      end
  end

  def show
    @job = Job.find(params[:id])
    if @job.is_hidden
      if !current_user.admin?
        redirect_to root_path, alert: "你没有查看该职位的权限"
      end
    end
  end


  private

  def job_params
    params.require(:job).permit(:title, :description, :wage_upper_bound, :wage_lower_bound, :contact_email, :is_hidden)
  end
end
