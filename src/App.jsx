import { useState } from 'react';
import CurrentLocation from './components/CurrentLocation.jsx'
import FavoritesLocation from './components/FavoritesLocation.jsx';
import SearchCity from './components/SearchCity.jsx'

function App() {
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  let date = new Date();
  let dateDay = String(date.getDate()).padStart(2, "0") + "/" + String(date.getMonth() + 1).padStart(2, "0") + "/" + date.getFullYear();
  let hour = String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");

  return (
    <div className='w-full h-full flex flex-col bg-[#E6F5F2] text-[clamp(0.8rem,_1.2rem_+_0.8vw,_1.2vw)]'>
      <SearchCity dateDay={dateDay} hour={hour} />
      <CurrentLocation dateDay={dateDay} hour={hour} />
       <button onClick={() => setIsFavoritesOpen(true)} className='fixed right-4 top-15 bg-[#FCD700] px-4 py-2 rounded shadow hover:bg-[#155DCF] hover:text-white transition-all z-20'>
        Ver favoritos
      </button>
      {isFavoritesOpen && (
        <div className='fixed top-0 right-0 h-full w-full sm:w-1/2 md:w-[33%] bg-[#E6F5F2] shadow-lg z-30 transition-transform transform translate-x-0 overflow-y-auto'>
          <div className='flex justify-end p-4'>
            <button onClick={() => setIsFavoritesOpen(false)} className='text-red-500 font-bold' title='Cerrar'>
              ✕
            </button>
          </div>
          <FavoritesLocation />
        </div>
      )}
      {isFavoritesOpen && (
        <div className='fixed inset-0 bg-black opacity-40 z-10' onClick={() => setIsFavoritesOpen(false)} />
      )}
    </div>
  )
}

export default App
