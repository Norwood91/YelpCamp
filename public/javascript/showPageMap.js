

    mapboxgl.accessToken = mapToken;
    
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
		center: campground.geometry.coordinates, // starting position [lng, lat]
		zoom: 9 // starting zoom
	});

    //sets a marker on the coordinates on the map
    new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map)