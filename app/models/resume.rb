class Resume < ApplicationRecord

  mount_uploader :attachment, AttachmentUploader
  validates :attachment, presence: true
  belongs_to :job
  belongs_to :user
end
