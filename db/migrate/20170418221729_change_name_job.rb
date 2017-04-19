class ChangeNameJob < ActiveRecord::Migration[5.0]
  def change
    rename_column :jobs, :cagetory, :category_name
  end
end
