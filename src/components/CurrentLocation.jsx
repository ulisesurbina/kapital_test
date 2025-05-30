import axios from 'axios';
import { useState, useEffect } from 'react';

function CurrentLocation() {
  const [weatherData, setWeatherData] = useState({});

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
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
        }
        navigator.geolocation.getCurrentPosition(success);
    }, []);

    let date = new Date();
    let dateDay = String(date.getDate()).padStart(2, "0") + "/" + String(date.getMonth() + 1).padStart(2, "0") + "/" + date.getFullYear();
    let hour = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  
  // console.log(weatherData);

    return (
        <div className='w-[30%] h-full bg-[#E6F5F2] flex flex-col justify-center gap-2 m-auto items-baseline'>
            <section>
                <h1 className='text-3xl'><strong>Datos del clima en tu ubicación:</strong></h1>
                <h3><strong>Temperatura:</strong> {weatherData.main?.temp} °C</h3>
                <h3><strong>Sensación térmica:</strong> {weatherData.main?.feels_like} °C</h3>
                <h3><strong>Humedad:</strong> {weatherData.main?.humidity}%</h3>
                <h3><strong>Velocidad del viento:</strong> {weatherData.wind?.speed} m/s</h3>
                <h3><strong>Estado del tiempo:</strong> {weatherData.weather?.[0].description}</h3>
                <figure className='bg-[#32AC90] w-[50%]'>
                    <img className='w-full bg-[#32AC90]' src={`http://openweathermap.org/img/wn/${weatherData.weather?.[0].icon}@2x.png`} alt={weatherData.weather?.[0].description} />
                </figure>
                <h3><strong>Día y hora actual:</strong> {dateDay} {hour}</h3>
                <h3><strong>Latitud:</strong> {weatherData.coord?.lat}</h3>
                <h3><strong>Longitud:</strong> {weatherData.coord?.lon}</h3>
                <h3><strong>Presión:</strong> {weatherData.main?.pressure} mmHg</h3>
                <h3><strong>Temperatura máxima:</strong> {weatherData.main?.temp_max} °C</h3>
                <h3><strong>Temperatura mínima:</strong> {weatherData.main?.temp_min} °C</h3>
                <h3><strong>Dirección del viento:</strong> {weatherData.wind?.deg}°</h3>
            </section>        
        </div>
    )
}
export default CurrentLocation


// import axios from 'axios';
// import { useState, useEffect } from 'react';

// function CurrentLocation() {
//   const [weatherData, setWeatherData] = useState(null);
//   const [error, setError] = useState('');
//   const [dateInfo, setDateInfo] = useState({ date: '', time: '' });

//   useEffect(() => {
//     const fetchWeather = async (lat, lon) => {
//       try {
//         const KEY = 'da38ec99d438610f058d6f2a8b895e17';
//         const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=es`;
//         const { data } = await axios.get(URL);
//         setWeatherData(data);
//       } catch (err) {
//         setError('No se pudieron obtener los datos del clima.');
//         console.error(err);
//       }
//     };

//     const getLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
//           () => setError('No se pudo acceder a tu ubicación.')
//         );
//       } else {
//         setError('La geolocalización no es compatible con tu navegador.');
//       }
//     };

//     const updateDateInfo = () => {
//       const now = new Date();
//       const date = now.toLocaleDateString('es-ES');
//       const time = now.toLocaleTimeString('es-ES');
//       setDateInfo({ date, time });
//     };

//     getLocation();
//     updateDateInfo();
//   }, []);

//   if (error) {
//     return <div className='text-red-500 text-center mt-10'>{error}</div>;
//   }

//   if (!weatherData) {
//     return <div className='text-center mt-10'>Cargando datos del clima...</div>;
//   }

//   const { main, wind, weather, coord } = weatherData;
//   const weatherIcon = weather?.[0]?.icon;
//   const description = weather?.[0]?.description;

//   return (
//     <div className='w-[30%] h-full flex flex-col justify-center gap-2 m-auto items-baseline'>
//       <section>
//         <h1 className='text-3xl font-bold mb-4'>Datos del clima en tu ubicación:</h1>
//         <h3><strong>Temperatura:</strong> {main.temp} °C</h3>
//         <h3><strong>Sensación térmica:</strong> {main.feels_like} °C</h3>
//         <h3><strong>Humedad:</strong> {main.humidity}%</h3>
//         <h3><strong>Velocidad del viento:</strong> {wind.speed} m/s</h3>
//         <h3><strong>Estado del tiempo:</strong> {description}</h3>
//         {weatherIcon && (
//           <figure className='bg-[#32AC90] w-[50%]'>
//             <img
//               className='w-full'
//               src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
//               alt={description}
//             />
//           </figure>
//         )}
//         <h3><strong>Día y hora actual:</strong> {dateInfo.date} {dateInfo.time}</h3>
//         <h3><strong>Latitud:</strong> {coord.lat}</h3>
//         <h3><strong>Longitud:</strong> {coord.lon}</h3>
//         <h3><strong>Presión:</strong> {main.pressure} mmHg</h3>
//         <h3><strong>Temperatura máxima:</strong> {main.temp_max} °C</h3>
//         <h3><strong>Temperatura mínima:</strong> {main.temp_min} °C</h3>
//         <h3><strong>Dirección del viento:</strong> {wind.deg}°</h3>
//       </section>
//     </div>
//   );
// }

// export default CurrentLocation;
