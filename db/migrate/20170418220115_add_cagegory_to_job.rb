class AddCagegoryToJob < ActiveRecord::Migration[5.0]
  def change
    add_column :jobs, :cagetory, :string
  end
end
