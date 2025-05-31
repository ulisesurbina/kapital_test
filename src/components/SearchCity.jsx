import axios from 'axios';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { CountryData } from '../data/CountryData';
import { AutoComplete } from "primereact/autocomplete";
import starFilled from '@iconify-icons/mdi/star';
import starOutline from '@iconify-icons/mdi/star-outline';
import kapital from '../assets/kapital_logo.png';
import ClimateGraphics from './ClimateGraphics';

function SearchCity({ dateDay, hour }) {  
    const [searchCity, setSearchCity] = useState({});
    const [inputValueCity, setInputValueCity] = useState("");
    const [errorInput, setErrorInput] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [filteredCountries, setFilteredCountries] = useState(null);

     const search = (event) => {
        setTimeout(() => {
            let _filteredCountries;

            if (!event.query.trim().length) {
                _filteredCountries = [...countries];
            }
            else {
                _filteredCountries = countries.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setFilteredCountries(_filteredCountries);
        }, 250);
    }

    useEffect(() => {
        CountryData.getCountries().then((data) => setCountries(data));
    }, []);

    const validCityData = () => {
        return searchCity && searchCity.name && searchCity.main && !errorInput;
    };

    useEffect(() => {
        const KEY = 'da38ec99d438610f058d6f2a8b895e17';
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${inputValueCity}&appid=${KEY}&lang=es&units=metric`;
        if (inputValueCity.trim() === "") {
            setSearchCity({});
            setErrorInput("Escribe una ciudad o país");
            return;
        }
        const fetchData = async () => {
            try {
                const response = await axios.get(URL);
                setSearchCity(response.data);
                setErrorInput("");
            } catch (err) {
                setSearchCity({});
                setErrorInput("No se encontró la ciudad o país, verifica el nombre");
            }
        };
        fetchData();
    }, [inputValueCity]);

    useEffect(() => {
        if (validCityData()) {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setIsFavorite(storedFavorites.some(fav => fav.name === searchCity.name));
        } else {
            setIsFavorite(false);
        }
    }, [searchCity]);

    useEffect(() => {
        const handleFavoritesUpdate = (e) => {
            if (validCityData()) {
                const updatedFavorites = e.detail.favorites;
                setIsFavorite(updatedFavorites.some(fav => fav.name === searchCity.name));
            }
        };
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
        };
    }, [searchCity]);

    const handleAutoCompleteChange = (e) => {
        if (typeof e.value === 'string') {
            // El usuario está escribiendo
            setInputValueCity(e.value);
            setSelectedCountry(e.value);
        } else if (e.value && e.value.name) {
            // El usuario seleccionó un país de la lista
            setInputValueCity(e.value.name);
            setSelectedCountry(e.value);
        }
    };    

    const toggleFavorite = () => {
         if (!validCityData()) {
            return;
        }
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let updatedFavorites;
        if (isFavorite) {
            updatedFavorites = storedFavorites.filter(item => item.name !== searchCity.name);
        } else {
            updatedFavorites = [...storedFavorites, searchCity];
        }
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(!isFavorite);
        window.dispatchEvent(new CustomEvent('favoritesUpdated', {
            detail: { favorites: updatedFavorites }
        }));
    };

    // console.log(searchCity);

    return (
        <div className='w-[80%] h-full flex flex-col justify-center gap-2 m-auto items-center relative'>
            <h2 className='text-[clamp(1.2rem,_1.8rem_+_1vw,_4vw)] mt-5 mb-5 font-bold italic'>Pronosticos del clima por Ciudad / País</h2>
            <section className='flex flex-col justify-between items-center gap-3 w-full'>
                <section className='flex justify-center items-center w-[50%] h-full gap-8'>
                    <section className='flex flex-col gap-1 w-[50%]'>
                        {errorInput && <p className="text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)] text-red-600 mt-2">{errorInput}</p>}
                        <AutoComplete className='text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)]' inputClassName="text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)] px-4 py-2 border border-green-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder='Buscar...' field="name" value={selectedCountry || inputValueCity} suggestions={filteredCountries} completeMethod={search} onChange={handleAutoCompleteChange} />
                    </section>
                    <div className='flex flex-col justify-start items-center w-[50%]'>
                        <h4 className='text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)]'>Marcar como favorito</h4>
                        <button onClick={toggleFavorite} disabled={!validCityData()} className={!validCityData() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
                            <Icon icon={isFavorite ? starFilled : starOutline} width={50} height={50} className={isFavorite ? 'text-yellow-400' : 'text-gray-400'} />
                        </button>
                    </div>
                </section>
                <section className='w-full flex justify-between items-center'>
                    <div className="w-[50%] text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)] flex items-start flex-col gap-2">
                        <h3><strong>Ciudad:</strong> {inputValueCity}</h3>
                        <h3><strong>Latitud:</strong> {searchCity.coord?.lat} <br /> <strong>Longitud:</strong> {searchCity.coord?.lon}</h3>
                        <h3><strong>Temperatura:</strong> {searchCity.main?.temp} °C</h3>
                        <h3><strong>Sensación térmica:</strong> {searchCity.main?.feels_like} °C</h3>
                        <h3><strong>Humedad:</strong> {searchCity.main?.humidity}%</h3>
                        <h3><strong>Velocidad del viento:</strong> {searchCity.wind?.speed} m/s</h3>
                        <h3><strong>Estado del tiempo:</strong> {searchCity.weather?.[0].description}</h3>
                        <h3><strong>Día y hora actual:</strong> {dateDay} {hour}</h3>
                        <figure className='bg-[#32AC90] w-[20%]'>
                            <img className='w-full bg-[#32AC90]' src={searchCity.weather?.[0]?.icon ? `http://openweathermap.org/img/wn/${searchCity.weather[0].icon}@2x.png` : kapital} alt={searchCity.weather?.[0]?.description || "Kapital Logo"} />
                        </figure>
                    </div>
                    <ClimateGraphics keyword={inputValueCity} />
                </section>
            </section>
        </div>
    )
}

export default SearchCity;
