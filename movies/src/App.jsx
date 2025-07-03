import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS={
  method:'GET',
  headers:{
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {

  // Keep track of movies search term via search bar
  const [searchText, setSearchText] = useState('');

  // Error message for failure fetching movies
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch list of movies and its loading state
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  // Fetch movies from TMDB API
  const fetchMovies = async()=>{
    setIsLoading(true);
    setErrorMsg('');


    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failure showing movies');
      }

      const data = await response.json(); // Parse movies fetched
      if(data.Response == 'False'){
        setErrorMsg(data.Error || 'Failure showing movies');
        setMovies([]);
        return;
      }

      setMovies(data.results || []); // Populate movies list

    } catch(error){
      console.error(`ERROR fetching movies: ${error}`);
      setErrorMsg('Error showing movies, please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    fetchMovies();
  }, []);

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner'/>
          <h1><span className='text-gradient'>Unwind Your Mind - Anytime, Anywhere</span></h1>
          <Search searchText={searchText} setSearchText={setSearchText}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>Our Movies</h2>

          {isLoading ?(
            <Spinner/>
          ) : errorMsg ? (
            <p className='text-red-500'> {errorMsg}</p>
          ) : (
            <ul>
              {movies.map((movie)=>(
                <p key={movie.id} className='text-white'>{movie.title}</p>
              ))}
            </ul>
          )}
        </section>

      </div>
      
    </main>
  )
}

export default App