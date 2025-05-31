import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import starFilled from '@iconify-icons/mdi/star';
import chevronDown from '@iconify-icons/mdi/chevron-down';
import chevronUp from '@iconify-icons/mdi/chevron-up';
import kapital from '../assets/kapital_logo.png';

function FavoritesLocation() {
  const [favorites, setFavorites] = useState([]);
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(storedFavorites);
    };
    loadFavorites();
    const handleFavoritesUpdate = (e) => {
      setFavorites(e.detail.favorites);
    };
    const handleStorageChange = (e) => {
      if (e.key === 'favorites') {
        loadFavorites();
      }
    };
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const removeFavorite = (cityName) => {
    const updatedFavorites = favorites.filter(fav => fav.name !== cityName);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { favorites: updatedFavorites }
    }));
  };

  const clearAllFavorites = () => {
    localStorage.removeItem('favorites');
    setFavorites([]);
    setExpandedItems(new Set());
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { favorites: [] }
    }));
  };

  const toggleExpanded = (cityId) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(cityId)) {
      newExpandedItems.delete(cityId);
    } else {
      newExpandedItems.add(cityId);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <div className='w-[80%] text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)] flex flex-col m-auto mb-15'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-[clamp(1.2rem,_1.8rem_+_1vw,_4vw)] italic font-bold'> Lugares favoritos</h2>
        {favorites.length > 0 && (
          <button onClick={clearAllFavorites} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'>
            Borrar todos
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className='text-center py-8 text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)]'>
          <p>No tienes ciudades favoritas aún</p>
          <p>Busca una ciudad y márcala como favorita</p>
        </div>
      ) : (
        <div className='grid w-full gap-5 grid-cols-1 gap-5 w-full'>
          {favorites.map((city, index) => {
            const cityId = city.id || index;
            const isExpanded = expandedItems.has(cityId);            
            
            return (
              <div key={cityId} className='w-full border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden'>
                <div 
                  className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors'
                  onClick={() => toggleExpanded(cityId)}
                >
                  <div className='flex items-center gap-3'>
                    <Icon icon={starFilled} className='text-yellow-400' />
                    <div>
                      <h3>{city.name}</h3>
                    </div>
                  </div>
                  
                  <div className='flex items-center gap-2'>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(city.name);
                      }}
                      className='text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors'
                      title="Eliminar favorito"
                    >
                      ✕
                    </button>
                    <Icon 
                      icon={isExpanded ? chevronUp : chevronDown} 
                      width={24} 
                      height={24} 
                      className='text-gray-400'
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className='border-t border-gray-200 p-4 bg-gray-50'>
                    <div className='flex justify-between items-center gap-4'>
                      <div className='space-y-2 flex-1'>
                        <div className='grid grid-cols-2 gap-x-4 gap-y-1 flex items-center'>
                          <p><strong>Temperatura:</strong> {city.main?.temp}°C</p>
                          <p><strong>Sensación:</strong> {city.main?.feels_like}°C</p>
                          <p><strong>Temperatura Mínima</strong> {city.main?.temp_min}°C <br />
                          <strong>Temperatura Máxima:</strong> {city.main?.temp_max}°C</p>
                          <p><strong>Humedad:</strong> {city.main?.humidity}%</p>
                          <p><strong>Presión:</strong> {city.main?.pressure} mmHg</p>
                          <p><strong>Velocidad del viento:</strong> {city.wind?.speed} m/s</p>
                          <p><strong>Dirección del viento:</strong> {city.wind.deg}°</p>
                          <p><strong>Estado del tiempo:</strong> {city.weather?.[0]?.description || 'N/A'}</p>
                        </div>
                        <p>
                          <strong>Latitud:</strong>  {city.coord.lat}, <strong>Longitud:</strong> {city.coord.lon}
                        </p>
                      </div>
                      
                      <div className='flex flex-col items-center gap-2'>
                        <figure className='bg-[#32AC90] w-20 h-20 rounded-lg flex items-center justify-center'>
                          <img 
                            className='w-full h-full object-cover rounded-lg' 
                            src={city.weather?.[0]?.icon ? `http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png` : kapital}
                            alt={city.weather?.[0]?.description || "Weather icon"} 
                          />
                        </figure>
                        <p className='text-center font-medium'>
                          {city.weather?.[0]?.main || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesLocation