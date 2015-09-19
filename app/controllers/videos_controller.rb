class VideosController < ApplicationController

	# Endpoint for requests from Java server to indicate new video
	def new_video
		file_name = params[:filename]

		file_name_arr = file_name.split(',')



		video_log = VideoLog.create(filename: file_name, timestamp: file_name_arr[0], latitude: file_name_arr[1], longitude: file_name_arr[2].split('.mp4')[0])

		if video_log.save
			data = file_metadata(video_log)
		end





		WebsocketRails.trigger 'new_video_received', data

		render :json => data
	end 

	def get_videos
		# Retrieve all video filenames
		file_names = Dir[Rails.root+'public/recorded-videos/*'].map! {|path| File.basename path}

		# file_names = [
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4",
		# 	"1442651884,43.4722854,-80.5448576.mp4"
		# ]

		data = []

		file_names.each do |file_name|
			video_log = VideoLog.find_by filename: file_name

			if video_log.nil?
				file_name_arr = file_name.split(',')
				video_log = VideoLog.create(filename: file_name, timestamp: file_name_arr[0], latitude: file_name_arr[1], longitude: file_name_arr[2].split('.mp4')[0])

				if video_log.save
					data.push file_metadata(video_log)
				else
					render :json => {message: 'Failed to save video log after get_videos'}
				end
			else
				data.push file_metadata(video_log)
			end 
		end

		# # Parse timestamps, latitude, and longitude
		# file_names.map! {|file_name| file_name.split(',')}

		# # Store time, lat, lon into a hash
		# data = file_names.collect do |file_name_arr|
		# 	file_metadata(file_name_arr)
		# end

		render :json => data
	end

	private
	def file_metadata(video_log)
		data = {
			filename: video_log.filename,
			time: video_log.timestamp,
			lat: video_log.latitude,
			lon: video_log.longitude,
			address: video_log.address
		}

		return data
	end

	def video_log_params
		params.permit(:filename, :address, :timestamp, :latitude, :longitude)
	end


end
