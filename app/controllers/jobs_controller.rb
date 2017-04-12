class JobsController < ApplicationController
  before_action :authenticate_user! , only: [:new, :create, :show]
  def index
    @jobs = Job.all
  end

  def show
    @job = Job.find(params[:id])
  end


  private

  def job_params
    params.require(:job).permit(:title, :description, :wage_upper_bound, :wage_lower_bound, :contact_email, :is_hidden)
  end
end
