class JobsController < ApplicationController
  before_action :authenticate_user! , only: [:new, :create, :show]
  def index
    @jobs = Job.where(:is_hidden => false).order("created_at DESC")
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
