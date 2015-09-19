class VideosController < ApplicationController

	# Endpoint for requests from Java server to indicate new video
	def new_video
		# WebsocketRails.trigger
	end 

	def get_videos
		# Retrieve all video filenames
		file_names = Dir['/recorded-videos/*']

		# Parse timestamps, latitude, and longitude
		file_names.map! {|f_name| f_name.split(',')}

		# Store time, lat, lon into a hash
		data = file_names.collect do |f_name_arr|
			{
				time: f_name_arr[0],
				lat: f_name_arr[1],
				lon: f_name_arr[2]
			}
		end
	end


end
