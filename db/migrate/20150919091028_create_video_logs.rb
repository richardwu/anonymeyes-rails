class CreateVideoLogs < ActiveRecord::Migration
  def change
    create_table :video_logs do |t|
    	t.string :filename
    	t.string :address
    	t.string :timestamp
    	t.float :latitude
    	t.float :longitude
    	t.timestamps null: false
    end
  end
end
