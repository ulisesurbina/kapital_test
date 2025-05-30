import CurrentLocation from './components/CurrentLocation.jsx'
import FavoritesLocation from './components/FavoritesLocation.jsx';
import SearchCity from './components/SearchCity.jsx'

function App() {
  let date = new Date();
  let dateDay = String(date.getDate()).padStart(2, "0") + "/" + String(date.getMonth() + 1).padStart(2, "0") + "/" + date.getFullYear();
  let hour = String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");

  return (
    <div className='w-full flex flex-col bg-[#E6F5F2]'>
      <SearchCity dateDay={dateDay} hour={hour} />
      <CurrentLocation dateDay={dateDay} hour={hour} />
      <FavoritesLocation />
    </div>
  )
}

export default App
