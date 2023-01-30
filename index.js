const firstRow = ["http://openweathermap.org/img/wn/01d@2x.png", "https://openweathermap.org/img/wn/01n@2x.png", "https://openweathermap.org/img/wn/02d@2x.png", "https://openweathermap.org/img/wn/02n@2x.png"];
const secondRow = ["https://openweathermap.org/img/wn/04d@2x.png", "https://openweathermap.org/img/wn/09d@2x.png", "https://openweathermap.org/img/wn/11d@2x.png", "https://openweathermap.org/img/wn/13d@2x.png"];

$(document).ready(function() {	
	for (i = 0; i < firstRow.length; i++) {
		$("#firstImg").append("<div class='col-md-3'> <img src='" + firstRow[i] + "'></div>");
	}
	for (i = 0; i < secondRow.length; i++) {
                $("#secondImg").append("<div class='col-md-3'> <img src='" + secondRow[i] + "'></div>");
        }

});
