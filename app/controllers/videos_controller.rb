class VideosController < ApplicationController

	# Endpoint for requests from Java server to indicate new video
	def new_video
		file_name = params[:filename]

		file_name_arr = file_name.split(',')

		data = file_metadata(file_name_arr)

		WebsocketRails.trigger 'new_video_received', data

		render :json => data
	end 

	def get_videos
		# Retrieve all video filenames
		file_names = Dir[Rails.root+'/recorded-videos/*']

		# file_names = [
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4"
		# ]

		# Parse timestamps, latitude, and longitude
		file_names.map! {|file_name| file_name.split(',')}

		# Store time, lat, lon into a hash
		data = file_names.collect do |file_name_arr|
			file_metadata(file_name_arr)
		end

		render :json => data
	end

	private
	def file_metadata(file_name_arr)
		data = {
			filename: file_name_arr.join(','),
			time: file_name_arr[0],
			lat: file_name_arr[1],
			# Removes the extension
			lon: file_name_arr[2].split('.')[0]
		}

		return data
	end


end
