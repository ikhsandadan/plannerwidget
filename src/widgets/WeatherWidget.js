import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {
  faCloud,
  faBolt,
  faCloudRain,
  faCloudShowersHeavy,
  faSnowflake,
  faSun,
  faSmog,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function WeatherWidget() {
    const [lat, setLat] = useState([]);
    const [long, setLong] = useState([]);
    const [city, setCity] = useState([]);
    const [weather, setWeather] = useState([]);
    const [description, setDescription] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [humidity, setHumidity] = useState([]);
    const [wind, setWind] = useState([]);
    const [sunrise, setSunrise] = useState([]);
    const [sunset, setSunset] = useState([]);
    const [checkLoc, setCheckLoc] = useState([]);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
          },
          function(error) {
            if (error.code === error.PERMISSION_DENIED)
              setCheckLoc('Please Enable Your Location');
          });

          axios.get(`${process.env.REACT_APP_API_URL}/weather?lat=${lat}&lon=${long}&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
          .then((weatherData) => {
            console.log(weatherData.data);
            setCity(weatherData.data.name)
            setWeather(weatherData.data.weather[0].main)
            setTemperature(weatherData.data.main.temp)
            setDescription(weatherData.data.weather[0].description)
            setHumidity(weatherData.data.main.humidity)
            setWind(weatherData.data.wind.speed)
            setSunrise(weatherData.data.sys.sunrise)
            setSunset(weatherData.data.sys.sunset)
          })
          .catch(function (error) {
            console.log(error);
          });
    }, [lat, long])

    let weatherIcon = null;

    if (weather === 'Thunderstorm') {
      weatherIcon = <FontAwesomeIcon icon={faBolt} />;
    } else if (weather === 'Drizzle') {
      weatherIcon = <FontAwesomeIcon icon={faCloudRain} />;
    } else if (weather === 'Rain') {
      weatherIcon = <FontAwesomeIcon icon={faCloudShowersHeavy} />;
    } else if (weather === 'Snow') {
      weatherIcon = <FontAwesomeIcon icon={faSnowflake} />;
    } else if (weather === 'Clear') {
      weatherIcon = <FontAwesomeIcon icon={faSun} />;
    } else if (weather === 'Clouds') {
      weatherIcon = <FontAwesomeIcon icon={faCloud} />;
    } else {
      weatherIcon = <FontAwesomeIcon icon={faSmog} />;
    }

    const weatherStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "30px",
    }

    const dataStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "18px",
    }

      return (
        <div style={{ minWidth: 300 }}>
          <div className='weather'>
            <p style={weatherStyle}>{city}{weatherIcon}</p>
          </div>
          <div className='temperature' style={dataStyle}>
            <p style={{ fontWeight: "bold" }}>{Math.round(temperature)} &deg;C</p>
            <p style={{ fontWeight: "bold" }}>{description}</p>
          </div>
          <div className='humidity' style={dataStyle}>
            <p style={{ fontWeight: "bold" }}>Humidity</p>
            <p>{humidity}%</p>
          </div>
          <div className='wind' style={dataStyle}>
            <p style={{ fontWeight: "bold" }}>Wind Speed</p>
            <p>{wind} m/s</p>
          </div>
          <div className='sunrise' style={dataStyle}>
            <p style={{ fontWeight: "bold" }}>Sunrise</p>
            <p>{new Date(sunrise * 1000).toLocaleTimeString()}</p>
          </div>
          <div className='sunset' style={dataStyle}>
            <p style={{ fontWeight: "bold" }}>Sunset</p>
            <p>{new Date(sunset * 1000).toLocaleTimeString()}</p>
          </div>
          <p style={{ display: "flex", justifyContent: "center", fontWeight: "bold" }}>{checkLoc}</p>
          <div className='refresh' style={{ display: "flex", justifyContent: "center" }}>
            <button 
              style={{
                textAlign: "center",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => {
                window.location.reload()
                }
              }
            ><FontAwesomeIcon icon={faRotate} /></button>
          </div>
        </div>
      )
}