class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :jobs
  has_many :resumes
  has_many :job_relationships
  has_many :applied_jobs, :through => :job_relationships, :source => :job

  def is_applier_of?(job)
    applied_jobs.include?(job)
  end

  def apply!(job)
    applied_jobs << job
  end

  def admin?
    is_admin
  end
end
