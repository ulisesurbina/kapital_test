import axios from 'axios';
import { useState, useEffect } from 'react';

function CurrentLocation({ dateDay, hour }) {
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);

   const handleError = (err) => {
    if (err.code) {
      switch (err.code) {
        case 1:
          setError('Acceso a ubicación denegada. Permite el acceso a tu ubicación.');
          break;
        case 2:
          setError('No se determinó tu ubicación. Verifica tu conexión GPS.');
          break;
        case 3:
          setError('Tiempo de espera agotado al determinar tu ubicación.');
          break;
        default:
          setError('Error desconocido al obtener tu ubicación.');
      }
    } else if (err.response) {
      const status = err.response.status;
      switch (status) {
        case 401:
          setError('API key inválida, verificar permisos y suscripcionesen OpenWeatherMap.');
          break;
        case 404:
          setError('Ubicación no encontrada.');
          break;
        case 429:
          setError('Límite de peticiones excedido. Intenta más tarde.');
          break;
        case 500:
          setError('Error en el servicio. Intenta de nuevo más tarde.');
          break;
        default:
          setError(`Error en el servicio: ${status}. ${err.response.data?.message || 'Intenta de nuevo más tarde.'}`);
      }
    } else if (err.request) {
      setError('Verifica tu conexión a internet.');
    } else {
      setError(err.message || 'Error inesperado al obtener los datos.');
    }
  };

    useEffect(() => {
        const success = pos => {
            const KEY = 'da38ec99d438610f058d6f2a8b895e17'
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const units = 'metric';
            const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=${units}&lang=es`;
            axios.get(URL)
            .then(response => {
                setWeatherData(response.data);
                setError(null);
            })
            .catch(error => {
                console.error('Error al acceder a los datos:', error);
                handleError(error);
            });
        };
        const errorCallback = (error) => {
            handleError(error);
        };
        navigator.geolocation.getCurrentPosition(success, errorCallback);
    }, []);
  
  // console.log(weatherData);

    return (
        <div className='w-[80%] h-full flex flex-col justify-center gap-2 m-auto my-15 text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)]'>
          {error && (
            <div className='fixed inset-0 bg-green bg-opacity-20 flex items-center justify-center z-50'>
              <div className='bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg max-w-md mx-4'>
                <strong className='font-bold block mb-2'>Error: </strong>
                <span className='block'>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className='mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
          <h2 className='text-[clamp(1.2rem,_1.8rem_+_1vw,_4vw)] italic'><strong>Datos del clima en tu ubicación:</strong></h2>
          <section className='w-full flex items-center justify-around'>
            <div>
              <h3><strong>Temperatura:</strong> {weatherData.main?.temp} °C</h3>
              <h3><strong>Sensación térmica:</strong> {weatherData.main?.feels_like} °C</h3>
              <h3><strong>Humedad:</strong> {weatherData.main?.humidity}%</h3>
              <h3><strong>Velocidad del viento:</strong> {weatherData.wind?.speed} m/s</h3>
              <h3><strong>Estado del tiempo:</strong> {weatherData.weather?.[0].description}</h3>
            </div>
            <figure className='bg-[#32AC90] w-[12%] h-[12%] flex items-center'>
                <img className='w-full bg-[#32AC90]' src={`http://openweathermap.org/img/wn/${weatherData.weather?.[0].icon}@2x.png`} alt={weatherData.weather?.[0].description} />
            </figure>
            <div>
              <h3><strong>Día y hora actual:</strong> {dateDay} {hour}</h3>
              <h3><strong>Latitud:</strong> {weatherData.coord?.lat}</h3>
              <h3><strong>Longitud:</strong> {weatherData.coord?.lon}</h3>
              <h3><strong>Presión:</strong> {weatherData.main?.pressure} mmHg</h3>
              <h3><strong>Temperatura máxima:</strong> {weatherData.main?.temp_max} °C</h3>
              <h3><strong>Temperatura mínima:</strong> {weatherData.main?.temp_min} °C</h3>
              <h3><strong>Dirección del viento:</strong> {weatherData.wind?.deg}°</h3>
            </div>
          </section>        
        </div>
    )
}
export default CurrentLocation;
