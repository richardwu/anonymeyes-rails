class VideosController < ApplicationController


	# Request indicating a recording has been started 
	# Render location (but not video)
	def new_recording
		firebase_uri = 'https://blazing-torch-7129.firebaseio.com/'
		firebase = Firebase::Client.new(firebase_uri)

		file_name = params[:filename]
		file_name_arr = file_name.split(',')


		video_log = VideoLog.create(filename: file_name, timestamp: file_name_arr[0], latitude: file_name_arr[1], longitude: file_name_arr[2].split('.mp4')[0])

		if video_log.save
			data = file_metadata(video_log)
			# WebsocketRails.trigger 'new_recording_started', data
			response = firebase.push('new_recording_started', data)
			render :json => data
		end
	end

	# Request indicating the recording has finished
	def new_video
		firebase_uri = 'https://blazing-torch-7129.firebaseio.com/'
		firebase = Firebase::Client.new(firebase_uri)

		file_name = params[:filename]

		file_name_arr = file_name.split(',')


		video_log = VideoLog.find_by(filename: file_name)

		if video_log.nil?
			render :json => {message: 'Error loading video from file.'}
		else
			data = file_metadata(video_log)

			# WebsocketRails.trigger 'new_video_uploaded', data
			response = firebase.push('new_video_uploaded', data)

			render :json => data
		end
	end 

	def get_videos
		# Retrieve all video filenames
		# file_names = Dir[Rails.root+'public/recorded-videos/*'].map! {|path| File.basename path}

		file_names = VideoLog.all.collect(&:filename)


		data = []

		file_names.each do |file_name|
			video_log = VideoLog.find_by filename: file_name

			data.push file_metadata(video_log)
		end 
	end

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
