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
    
    // Disparar el evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { favorites: updatedFavorites }
    }));
  };

  const clearAllFavorites = () => {
    localStorage.removeItem('favorites');
    setFavorites([]);
    setExpandedItems(new Set()); // Limpiar items expandidos
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
    <div className='w-full flex flex-col p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Favoritos</h2>
        {favorites.length > 0 && (
          <button 
            onClick={clearAllFavorites}
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
          >
            Limpiar todos
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500 text-lg'>No tienes ciudades favoritas aún</p>
          <p className='text-gray-400'>Busca una ciudad y márcala como favorita</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {favorites.map((city, index) => {
            const cityId = city.id || index;
            const isExpanded = expandedItems.has(cityId);
            
            return (
              <div key={cityId} className='border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden'>
                {/* Header siempre visible */}
                <div 
                  className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors'
                  onClick={() => toggleExpanded(cityId)}
                >
                  <div className='flex items-center gap-3'>
                    <Icon icon={starFilled} width={20} height={20} className='text-yellow-400' />
                    <div>
                      <h3 className='text-lg font-semibold text-blue-600'>{city.name}</h3>
                      <p className='text-sm text-gray-500'>
                        {city.sys?.country} • {Math.round(city.main?.temp || 0)}°C
                      </p>
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

                {/* Información detallada - solo visible cuando está expandido */}
                {isExpanded && (
                  <div className='border-t border-gray-200 p-4 bg-gray-50'>
                    <div className='flex justify-between items-start gap-4'>
                      <div className='space-y-2 text-sm flex-1'>
                        <div className='grid grid-cols-2 gap-x-4 gap-y-1'>
                          <p><strong>Temperatura:</strong> {Math.round(city.main?.temp || 0)}°C</p>
                          <p><strong>Sensación:</strong> {Math.round(city.main?.feels_like || 0)}°C</p>
                          <p><strong>Min/Max:</strong> {Math.round(city.main?.temp_min || 0)}°C / {Math.round(city.main?.temp_max || 0)}°C</p>
                          <p><strong>Humedad:</strong> {city.main?.humidity || 0}%</p>
                          <p><strong>Presión:</strong> {city.main?.pressure || 0} hPa</p>
                          <p><strong>Viento:</strong> {city.wind?.speed || 0} m/s</p>
                          <p><strong>Visibilidad:</strong> {(city.visibility || 0) / 1000} km</p>
                          <p><strong>Estado:</strong> {city.weather?.[0]?.description || 'N/A'}</p>
                        </div>
                        <p className='text-xs text-gray-500 mt-3'>
                          <strong>Coordenadas:</strong> Lat: {city.coord?.lat?.toFixed(2)}, Lon: {city.coord?.lon?.toFixed(2)}
                        </p>
                        <p className='text-xs text-gray-400'>
                          ID: {city.id} • Zona horaria: UTC{city.timezone ? (city.timezone/3600 > 0 ? '+' : '') + (city.timezone/3600) : '0'}
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
                        <p className='text-xs text-gray-500 text-center font-medium'>
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