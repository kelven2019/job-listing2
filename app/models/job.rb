class Job < ApplicationRecord
  validates :title, presence: true
  validates :wage_upper_bound, presence: true
  validates :wage_lower_bound, presence: true
  validates :wage_lower_bound, numericality: {greater_than: 0}

  belongs_to :user
  has_many :resumes
  has_many :job_relationships
  has_many :appliers, through: :job_relationships, source: :user



  def publish!
    self.is_hidden = false
    self.save
  end

  def hide!
    self.is_hidden = true
    self.save
  end

  scope :publish, -> { where(is_hidden: false) }
  scope :recent, -> { order('created_at DESC') }
end
