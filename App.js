let m1=document.getElementById("m1");
let m2=document.getElementById("m2");
let m3=document.getElementById("m3");
let letsGo=document.querySelector(".go");
let back=document.querySelector(".goHome");
let srch=document.querySelector(".search");
let input= document.querySelector(".input");
let wimg= document.querySelector("#clear");
let desc= document.querySelector("#desc");
let temp= document.querySelector("#temp");
let cityName=document.querySelector("#cityName");
let windSpeed=document.querySelector("#windSpeed");
let humidPer=document.querySelector("#humidPer");
let msg=document.querySelector("#msg");
let slider=document.querySelector(".slider");


function getWicon(img){
    let image= 
                {   Haze: "images/haze.png",
                    Clear: "images/clear.png",
                    Clouds: "images/clouds.png",
                    drizzle: "images/drizzle.png",
                    Mist: "images/mist.png",
                    Fog: "images/mist.png",
                    Rain: "images/rain.png",
                    Snow: "images/snow.png",
                    Thunderstorm: "images/thunderstorm.png",
                    Tornado: "images/thunderstorm.png",
                    Smoke: "images/haze.png",
                    Dust: "images/haze.png",
                    Ash: "images/haze.png",
                    Sand: "images/haze.png"
                }
    wimg.src= image[img] || "images/clear.png";
}
// slider.onclick= function changeUnit(){
    
// }
function getLatlon(){
    navigator.geolocation.getCurrentPosition(sucess,error);
    
    function sucess(loc)
    {
        console.log(loc);
        let lat=loc.coords.latitude;
        let lon=loc.coords.longitude;
        console.log(lat,lon);

        async function getData(lat,lon)
        {
            let locUrl= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=63121c299d683d0602b629b9344076e2`;
            let data= await fetch(locUrl).then(res=>res.json());
            console.log(data);
            console.log(lat);
            temp.innerHTML=Math.round(data.main.temp-273.15)+"°C";
            cityName.innerHTML=`${data.name}, ${data.sys.country}`;
            windSpeed.innerHTML=`${data.wind.speed} km/hr`;
            humidPer.innerHTML=`${data.main.humidity} %`;
            desc.innerHTML=`${data.weather[0].main}`; 
            getWicon(desc.innerHTML);
            slider.onclick= function changeUnit(){
                switch(temp.innerHTML.includes("")){
                    case temp.innerHTML.includes("C"):
                        temp.innerHTML=Math.round((data.main.temp-273.15)*1.8 +32)+"°F";
                        break;
                    case temp.innerHTML.includes("F"):
                        temp.innerHTML=Math.round(data.main.temp-273.15)+"°C";
                        break;
                        
                }
                
            }
        }
        getData(lat,lon);
    }
    function error(er){
        m2.classList.add("inactive");
        m3.classList.remove("inactive");
         switch (er.code) {
                case er.PERMISSION_DENIED:
                      msg.innerHTML =`User denied the request for Geolocation.`;
                            break;
                case er.POSITION_UNAVAILABLE:
                      msg.innerHTML = `Location information is unavailable.`;
                            break;
                case er.TIMEOUT:
                     msg.innerHTML =`The request to get user location timed out.`;
                            break;
                default:
                      msg.innerHTML = `An unknown error occurred.`;
                            break;
                        }
                }
}

async function getWeatherData(city) 
{
    let finalUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=63121c299d683d0602b629b9344076e2`;
    let weatherData= await fetch(finalUrl).then(res=>res.json());
    console.log(weatherData);
    let code= weatherData.cod;
    if (code==404)
        {
            m2.classList.add("inactive");
            m3.classList.remove("inactive");
        }
        temp.innerHTML=Math.round(weatherData.main.temp-273.15)+"°C";
        cityName.innerHTML=`${weatherData.name}, ${weatherData.sys.country}`;
        windSpeed.innerHTML=`${weatherData.wind.speed} km/hr`;
        humidPer.innerHTML=`${weatherData.main.humidity} %`;
        desc.innerHTML=`${weatherData.weather[0].main}`;
        getWicon(desc.innerHTML);
        slider.onclick= function changeUnit(){
            switch(temp.innerHTML.includes("")){
                case temp.innerHTML.includes("C"):
                    temp.innerHTML=Math.round((weatherData.main.temp-273.15)*1.8 +32)+"°F";
                    break;
                    case temp.innerHTML.includes("F"):
                        temp.innerHTML=Math.round(weatherData.main.temp-273.15)+"°C";
                        break;
                        
                    }
                    
                }
}
letsGo.onclick= function changePage()
{
    m1.classList.add("inactive");
    m2.classList.remove("inactive");
    getLatlon();
}

srch.onclick= function getWeather()
{
    let city= `${input.value}`;
    
    getWeatherData(city);
}
input.addEventListener("keypress",(e)=>{
    
        if(e.key=="Enter"){
            getWeatherData(input.value);
        }
    }
)
back.onclick= function homePage()
{
    m3.classList.add("inactive");
    m1.classList.remove("inactive");
    input.value="";
}
