import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Login from './components/Login'
import CharacterSelection from './components/CharacterSelection'
import DailyRecommendations from './components/DailyRecommendations'
import ExperienceDetail from './components/ExperienceDetail'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [character, setCharacter] = useState(null)
  const [currentExperience, setCurrentExperience] = useState('jugar') // jugar, ver, escuchar

  return (
    <Router>
      <div className="app">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                !user ? (
                  <Login onLogin={setUser} />
                ) : !character ? (
                  <CharacterSelection onCharacterSelect={setCharacter} />
                ) : (
                  <DailyRecommendations 
                    user={user}
                    character={character}
                    currentExperience={currentExperience}
                    onExperienceChange={setCurrentExperience}
                  />
                )
              } 
            />
            <Route 
              path="/detail/:type/:id" 
              element={
                <ExperienceDetail 
                  currentExperience={currentExperience}
                  character={character}
                />
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
