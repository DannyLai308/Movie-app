import React, { useEffect, useState } from 'react'
import Search from './components/Search'

const App = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner'/>
          <h1><span className='text-gradient'>Unwind Your Mind - Anytime, Anywhere</span></h1>
        </header>

        <Search searchText={searchText} setSearchText={setSearchText}/>
      </div>
      
    </main>
  )
}

export default App