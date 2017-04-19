class ResumesController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create]

  def new
    @job = Job.find(params[:job_id])
    @resume = Resume.new
  end

  def create
    @job = Job.find(params[:job_id])
    @resume = Resume.new(resume_params)
    @resume.user = current_user
    @resume.job = @job
    if !current_user.is_applier_of?(@job)
      current_user.apply!(@job)
    else
      flash[:warning] = "你已经申请过该职位"
    end
    if @resume.save
      redirect_to job_path(@job), notice: "你已成功投递简历"
    else
      render :new
    end
  end

  private

  def resume_params
    params.require(:resume).permit(:content, :attachment)
  end
end
