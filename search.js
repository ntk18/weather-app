var iconURL = "http://openweathermap.org/img/wn/";
var iconURLsuffix = ".png";

$(document).ready(function() {
	$("#emptyMessage").hide();
	$("#dateSearch").val(getToday());
	$("#tableCol").hide();

	$("#searchButton").click(function() {
		getResults();
	});
});

function getToday() {
	var date = new Date();

	var year = date.toLocaleString("default", { year: "numeric" });
	var month = date.toLocaleString("default", { month: "2-digit" });
	var day = date.toLocaleString("default", { day: "2-digit" });

	var formattedDate = year + "-" + month + "-" + day;

	return formattedDate;
}

function getResults() {
	var date = $("#dateSearch").val();
	$("#emptyMessage").hide();
	$("#tableCol").show();
	a=$.ajax({
		url: "final.php?method=getWeather&date=" + date,
		type: "GET",
		dataType: 'json',
		success:function(data){
			$("#header").html("Results from " + date);
			$("#results").html("");

			if (data.result.length == 0) {
				$("#message").text("No results found!");
				$("#message").show();
				return;	
			}

			var size = $("#numOfResults").val();
			$("#message").text("Click a location to view the full information from that search!");
			$("#message").show();

			for (i = 0; i < size; i++) {
				if (i >= data.result.length) {
					$("#tableCol").append("<h5>All results loaded!</h5>");
					break;
				}
				var currentWeatherData = JSON.parse(data.result[i].WeatherJson);
				var currentMapData = JSON.parse(data.result[i].MapJson);

				$("#results").append("<tr><td>" + data.result[i].Location + "</td><td>" + data.result[i].DateTime + "</td><td>" + currentMapData.lat + "</td><td>" + currentMapData.lon + "</td><td><button class='tableButton' type='button' value=" + i  + ">Click here for full weather</button> "  + "</td></tr>");
			}

			$(".tableButton").click(function() {
				showData(data.result[$(this).attr("value")].Location, data.result[$(this).attr("value")].WeatherJson);
			});
		}
	});
}

function showData(loc, weather) {
	var results = JSON.parse(weather);
	console.log(results);
	$("#weatherContainer").html("");

	$("#currentLocation").html("");
	$("#currentLocation").append("<h2>" + loc + "</h2>");

	for (i = 0; i < 5; i++ ) {
		$("#weatherContainer").append('<div class="row" id="weatherBox"> <div class="col-md-3 my-auto text-center"> <h2 class="day">' + results.day[i] + '</h2> <p class="date">' + results.date[i] + '</p> </div> <div class="col-md-3 my-auto text-center"> <p> High: ' + results.maxTemp[i] + '<span>&#176;</span> </p><p> Low: ' + results.minTemp[i]  + '<span>&#176;</span> </p> </div> <div class="col-md-3 my-auto text-center"> <img class="weatherIcon" src="' +  iconURL + results.icons[i] + iconURLsuffix + '"><p> Forecast: ' + results.descriptions[i] + '</p> </div> <div class="col-md-3 my-auto text-center"> <p> Visibility: ' + results.visibilities[i] + ' meters </p> <p> Humiditity: ' + results.humidities[i]  + '%</p> </div> </div>');
	}

	$('html,body').animate({
		scrollTop: $("#weatherContainer").offset().top},
		'slow');


	//	window.scrollTo(0, document.body.scrollHeight);
}
