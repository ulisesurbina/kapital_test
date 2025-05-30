import axios from 'axios';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { CountryData } from '../utils/CountryData';
import { AutoComplete } from "primereact/autocomplete";
import starFilled from '@iconify-icons/mdi/star';
import starOutline from '@iconify-icons/mdi/star-outline';
import kapital from '../assets/kapital_logo.png'

function SearchCity({}) {  
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
        const KEY = 'da38ec99d438610f058d6f2a8b895e17'
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
    };

    // console.log(searchCity);

    return (
        <div className='w-[60%] h-full flex flex-col justify-center gap-2 m-auto items-center relative'>
                <h2>Buscar Ciudad o País</h2>
            <section className='flex justify-between items-center gap-3 w-full'>
                <section className='flex flex-col w-[50%] h-full'>
                    <div className='flex justify-start items-center gap-2'>
                        <h2>Marcar como favorito</h2>
                        <button onClick={toggleFavorite} disabled={!validCityData()} className={!validCityData() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
                            <Icon icon={isFavorite ? starFilled : starOutline} width={50} height={50} className={isFavorite ? 'text-yellow-400' : 'text-gray-400'} />
                        </button>
                    </div>
                    <section>
                        {errorInput && <p className="text-red-600 mt-2">{errorInput}</p>}
                        <AutoComplete type="text" placeholder='Buscar...' field="name" value={selectedCountry || inputValueCity} suggestions={filteredCountries} completeMethod={search} onChange={handleAutoCompleteChange} />
                    </section>
                </section>
                <div className="w-[50%] flex justify-center items-center flex-col gap-2">
                    <h3><strong>Ciudad:</strong> {inputValueCity}</h3>
                    <h3><strong>Temperatura:</strong> {searchCity.main?.temp} °C</h3>
                    <h3><strong>Sensación térmica:</strong> {searchCity.main?.feels_like} °C</h3>
                    <h3><strong>Humedad:</strong> {searchCity.main?.humidity}%</h3>
                    <h3><strong>Velocidad del viento:</strong> {searchCity.wind?.speed} m/s</h3>
                    <h3><strong>Estado del tiempo:</strong> {searchCity.weather?.[0].description}</h3>
                    <figure className='bg-[#32AC90] w-[40%]'>
                        <img className='w-full bg-[#32AC90]' src={searchCity.weather?.[0]?.icon ? `http://openweathermap.org/img/wn/${searchCity.weather[0].icon}@2x.png` : kapital} alt={searchCity.weather?.[0]?.description || "Kapital Logo"} />
                    </figure>
                </div>
            </section>
        </div>
    )
}

export default SearchCity
