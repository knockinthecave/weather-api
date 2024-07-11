import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WeatherSummary = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeather(latitude, longitude);
      },
      (error) => {
        setError("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, []);

  const getWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      setWeather(response.data);
    } catch (error) {
      setError("날씨 정보를 가져올 수 없습니다.");
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!weather) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          현재 날씨 요약
        </Typography>
        <Typography variant="body1">위치: {weather.name}</Typography>
        <Typography variant="body1">온도: {weather.main.temp}°C</Typography>
        <Typography variant="body1">날씨: {weather.weather[0].description}</Typography>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="weather icon"
        />
        <Typography variant="body2" component={Link} to="/weather-details">
          상세 정보 보기
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;