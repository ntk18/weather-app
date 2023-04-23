var tomtomURL = "https://api.tomtom.com/search/2/search/";
var tomtomKey = "**************************";

var openWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?";
var openWeatherKey = "**************************";
var iconURL = "http://openweathermap.org/img/wn/";
var iconURLsuffix = ".png";


const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["", "January","February","March","April","May","June","July",
            "August","September","October","November","December"];

$(document).ready(function() {
	$("#searchButton").click(function() {
		getLatLon();
	});
	$("#searchInput").on("keyup", function (e) {
		if (e.key === 'Enter' || e.keyCode === 13) {
			getLatLon();
		}
	});
});

function getLatLon() {
	let query = $("#searchInput").val();
	if (query == "") {
		$("#blankSearchMessage").css("visibility", "visible");
		return;
	}

	$("#searchInput").val("");
	a=$.ajax({
		url: tomtomURL + query + tomtomKey,
		method: "GET"
	}).done(function(data) {
		$("#blankSearchMessage").css("visibility", "hidden");

		var lat = data.results[0].position.lat;
		var lon = data.results[0].position.lon;
		$("#lat").val(lat);
		$("#lon").val(lon);
	
		getWeather();
		if (data.results[0].address.country == "United States") {
			$("#currentLocation").html("");
			$("#currentLocation").append("<h2>" + data.results[0].address.municipality + ", "  + data.results[0].address.countrySubdivision + "</h2>");
		} else {
			$("#currentLocation").html("");
			$("#currentLocation").append("<h2>" + data.results[0].address.municipality + ", "  + data.results[0].address.country + "</h2>");
		}
	}).fail(function(error) {
		console.log("error",error.statusText);
	});
}

function getWeather() {
	var weatherLat = $("#lat").val();
	var weatherLon = $("#lon").val();
	test = openWeatherURL + "lat=" + weatherLat + "&lon=" + weatherLon + openWeatherKey;
	a=$.ajax({
		url: openWeatherURL + "lat=" + weatherLat + "&lon=" + weatherLon + openWeatherKey,
		method: "GET",
		dataType: "json"
	}).done(function(data) {
		const dates = new Set();
		$("#weatherContainer").html("");
		
		var loc =  $("#currentLocation").text();
                var map = new Object();
                map.lat = weatherLat;
                map.lon = weatherLon;
		
		const datesArr = [];
		const days = [];
		const maxTemp = [];
		const minTemp = [];
		const descriptions = [];
		const visibilities = [];
		const humidities = [];
		const icons = [];

		for (i = 0; i < data.list.length; i++) {
			var currentDate = data.list[i].dt_txt.substring(0, 10);
			var dateForm = new Date(currentDate);
			if (dates.size == 5) {
				break;
			}
			if (!dates.has(currentDate)) {
				dates.add(currentDate);
				var day = currentDate.substring(8);
				if (day.substring(0, 1) == "0") {
					day = day.substring(1);
				}
				var currentDateFix = (currentDate.substring(5, 6) == '0') ? currentDate.substring(6,7) : currentDate.substring(5, 7);
				var dateString = months[currentDateFix] + " " + day + ", " + currentDate.substring(0, 4);
				
				datesArr[dates.size - 1] = currentDate;
				days[dates.size - 1] = daysOfWeek[dateForm.getDay()];
				maxTemp[dates.size - 1] = data.list[i].main.temp_max;
				minTemp[dates.size - 1] = data.list[i].main.temp_min;
				descriptions[dates.size - 1] = data.list[i].weather[0].description;
				visibilities[dates.size - 1] = data.list[i].visibility;
				humidities[dates.size - 1] = data.list[i].main.humidity;
				icons[dates.size - 1] =  data.list[i].weather[0].icon;
				
				var displayDate = (dates.size == 1 ? 'Today' : daysOfWeek[dateForm.getDay()]);

				$("#weatherContainer").append(
					'<div class="row" id="weatherBox"> <div class="col-md-3 my-auto text-center"> <h2 class="day">' + displayDate+ '</h2> <p class="date">' + dateString + '</p> </div> <div class="col-md-3 my-auto text-center"> <p> High: ' + data.list[i].main.temp_max + '<span>&#176;</span> </p><p> Low: ' +  data.list[i].main.temp_min + '<span>&#176;</span> </p> </div> <div class="col-md-3 my-auto text-center"> <img class="weatherIcon" src="' +  iconURL + data.list[i].weather[0].icon + iconURLsuffix + '"><p> Forecast: ' + data.list[i].weather[0].description + '</p> </div> <div class="col-md-3 my-auto text-center"> <p> Visibility: ' + data.list[i].visibility + ' meters </p> <p> Humiditity: ' + data.list[i].main.humidity  + '%</p> </div> </div>');

			}
		}
		var weatherData = new Object();
		weatherData.date = datesArr;
		weatherData.day = days;
		weatherData.maxTemp = maxTemp;
		weatherData.minTemp = minTemp;
		weatherData.descriptions = descriptions;
		weatherData.visibilities = visibilities;
		weatherData.humidities = humidities;
		weatherData.icons = icons;

		insertSQL(loc, map, weatherData);
	}).fail(function(error) {
		console.log("error",error.statusText);
	});
}

function insertSQL(loc, mapJson, weatherJson) {
	var mapString = JSON.stringify(mapJson);
	var weatherString = JSON.stringify(weatherJson);
	a=$.ajax({
		url: "final.php?method=setWeather&location=" + loc + "&mapJson=" + mapString  + "&weatherJson=" + weatherString,
		type: "POST",
		success:function(result){
			console.log("Data saved");
		}
	});
}
