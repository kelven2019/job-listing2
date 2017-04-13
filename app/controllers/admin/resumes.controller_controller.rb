class Admin::Resumes.controllerController < ApplicationController
  def index
    @job = Job.find(params[:job_id])
    @resumes = @job.resumes
  end
end
