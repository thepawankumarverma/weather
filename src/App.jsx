import React, { useState } from 'react'
import Header from './Components/Header'
import CurrentWeather from './Components/CurrentWeather'

const App = () => {
  const [location,setLocation]=useState("Loading...");
  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 w-full h-full">
      <Header setLocation={setLocation} location={location}></Header>
      <CurrentWeather location={location}></CurrentWeather>
    </div>
  )
}
export default App
