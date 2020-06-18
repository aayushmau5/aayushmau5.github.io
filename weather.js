var weather_info_delhi = document.getElementById('weather_info');
document.getElementById('btn').addEventListener('click',Weather);
function Weather(){
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET','https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=1107429ef67f4ff90050a129c01b5219');
    ourRequest.onload = function(){
     var ourData = JSON.parse(ourRequest.responseText);
     renderHTML(ourData);
    };
    ourRequest.send();
    btn.classList.add("hide-me");
}

function renderHTML(data){
   var temp = data.main.temp;
   temp = temp - 273;
   temp = Math.ceil(temp);
   var feels = data.weather[0].main;
   var visibility = data.visibility;
   var wind_speed = data.wind.speed;
   var pressure = data.main.pressure;
   var humidity = data.main.humidity;
   var string = 'The temperature is '+temp+'°C and feels like '+feels+'<br> Visibility '+visibility+'<br> Wind speed: '+wind_speed+ '<br> Pressure:'+pressure+'<br> Humidity:'+humidity;
    weather_info_delhi.insertAdjacentHTML('beforeend',string);
}