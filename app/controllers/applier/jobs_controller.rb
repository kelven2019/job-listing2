class Applier::JobsController < ApplicationController
  def index
    @jobs = current_user.applied_jobs.order("created_at DESC").paginate(:page => params[:page], :per_page => 10)
  end
end
