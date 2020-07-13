////////////////////////////////
//For side navigation bar//////
//////////////////////////////
let butn = document.querySelector('button');
let nav = document.querySelector('.sidenav');
let close = document.querySelector('.close');

butn.addEventListener('click', () => {
    nav.style.width = '250px';
    butn.style.color = 'white';
});

close.addEventListener('click', () => {
    nav.style.width = '0px';
    butn.style.color = 'black';
});

///////////////////////
//For weather info////
/////////////////////
let weather_info_delhi = document.getElementById('weather_info');
let btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    btn.style.display = 'none';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=1107429ef67f4ff90050a129c01b5219').then((response) => response.json()).then((data) => renderHTML(data));
});

function renderHTML(data) {
    let temp = data.main.temp;
    temp = temp - 273;
    temp = Math.ceil(temp);
    let feels = data.weather[0].main;
    let visibility = data.visibility;
    let wind_speed = data.wind.speed;
    let pressure = data.main.pressure;
    let humidity = data.main.humidity;
    let string = `<p style="font-family:Amaranth;">The temperature is ${temp}°C and feels like ${feels} <br> Visibility ${visibility}<br> Wind speed: ${wind_speed}<br> Pressure: ${pressure}<br> Humidity: ${humidity} </p>`;
    weather_info_delhi.insertAdjacentHTML('beforeend', string);
}