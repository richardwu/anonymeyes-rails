class VideoLog < ActiveRecord::Base

	after_validation :reverse_geocode
	
	reverse_geocoded_by :latitude, :longitude, :address => :address 
end
