import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const WeatherSummary = () => {
  const [weather, setWeather] = useState(null);
  const [air, setAir] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchWeather = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeather(latitude, longitude);
          getAirPollution(latitude, longitude);
        },
        (error) => {
          setError("위치 정보를 가져올 수 없습니다.");
        }
      );
    };

    fetchWeather(); // 컴포넌트 마운트 시 즉시 실행
    const intervalId = setInterval(() => {
      fetchWeather();
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000); // 1분마다 실행

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 타이머 정리
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

  const getAirPollution = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      // 에어 폴루션 데이터는 따로 state에 저장하거나 필요한 처리를 합니다.
      setAir(response.data.list[0].components);
    } catch (error) {
      setError("공기 오염 정보를 가져올 수 없습니다.");
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!weather || !air) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          현재 날씨 요약
        </Typography>
        <Typography variant="body1">현재시각: {currentTime}</Typography>
        <Typography variant="body1">위치: {weather.name}</Typography>
        <Typography variant="body1">온도: {weather.main.temp}°C</Typography>
        <Typography variant="body1">날씨: {weather.weather[0].description}</Typography>
        <Typography variant="body1">PM 2.5: {air.pm2_5}</Typography>
        <Typography variant="body1">PM 10: {air.pm10}</Typography>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="weather icon"
        />
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;
