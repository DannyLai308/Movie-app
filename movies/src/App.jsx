import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3'; //tmdb

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
  const [searchTerm, setSearchTerm] = useState('');

  // Error message for failure fetching movies
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch list of movies and its loading state
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce search term to delay API request ( wait for 500ms)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])


  // Fetch movies from TMDB API
  const fetchMovies = async( query ='')=>{
    setIsLoading(true);
    setErrorMsg('');

    try{
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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

      // If a movie exists, update search count to the Appwrite database
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch(error){
      console.error(`ERROR fetching movies: ${error}`);
      setErrorMsg('Error showing movies, please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(()=>{
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies();

  },[]);

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner'/>
          <h1><span className='text-gradient'>Unwind Your Mind - Anytime, Anywhere</span></h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>Our Movies</h2>

          {isLoading ?(
            <Spinner/>
          ) : errorMsg ? (
            <p className='text-red-500'> {errorMsg}</p>
          ) : (
            <ul>
              {movies.map((movie)=>(
                <MovieCard key={movie.id} movie={movie}/>             
              ))}
            </ul>
          )}
        </section>

      </div>
      
    </main>
  )
}

export default App