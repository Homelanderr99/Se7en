import { motion } from 'framer-motion'
import { useState } from 'react'
import { Shuffle, Palette, Check, ArrowLeft } from 'lucide-react'

const CharacterSelection = ({ onCharacterSelect }) => {
  const [selectionMode, setSelectionMode] = useState('quick') // 'quick' o 'custom'
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [customCharacter, setCustomCharacter] = useState({
    skinColor: '#fdbcb4',
    hairColor: '#8b4513',
    hairStyle: 'short',
    outfit: 'casual',
    accessory: 'none'
  })

  const quickCharacters = [
    {
      id: 1,
      name: '2B',
      source: 'NieR: Automata',
      avatar: '🤖',
      colors: ['#ffffff', '#000000'],
      personality: 'Misteriosa y elegante'
    },
    {
      id: 2,
      name: 'Chihiro',
      source: 'El Viaje de Chihiro',
      avatar: '👧',
      colors: ['#ff9999', '#654321'],
      personality: 'Curiosa y valiente'
    },
    {
      id: 3,
      name: 'Link',
      source: 'The Legend of Zelda',
      avatar: '🧝‍♂️',
      colors: ['#228b22', '#ffd700'],
      personality: 'Aventurero y noble'
    },
    {
      id: 4,
      name: 'Gris',
      source: 'GRIS',
      avatar: '👤',
      colors: ['#708090', '#ff6b6b'],
      personality: 'Melancólica y artística'
    },
    {
      id: 5,
      name: 'Eleven',
      source: 'Stranger Things',
      avatar: '👧',
      colors: ['#ff1493', '#000080'],
      personality: 'Poderosa y leal'
    },
    {
      id: 6,
      name: 'Joker',
      source: 'Persona 5',
      avatar: '🎭',
      colors: ['#000000', '#ff0000'],
      personality: 'Rebelde y carismático'
    }
  ]

  const skinColors = ['#fdbcb4', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#975a37']
  const hairColors = ['#000000', '#8b4513', '#daa520', '#ff4500', '#9932cc', '#ff1493']
  const hairStyles = ['short', 'long', 'curly', 'straight', 'punk']
  const outfits = ['casual', 'formal', 'punk', 'vintage', 'futuristic']
  const accessories = ['none', 'glasses', 'hat', 'earrings', 'necklace']

  const handleQuickSelect = (character) => {
    setSelectedCharacter(character)
  }

  const handleConfirm = () => {
    if (selectionMode === 'quick' && selectedCharacter) {
      onCharacterSelect({
        ...selectedCharacter,
        type: 'quick'
      })
    } else if (selectionMode === 'custom') {
      onCharacterSelect({
        ...customCharacter,
        name: 'Mi Personaje',
        type: 'custom'
      })
    }
  }

  const randomizeCustom = () => {
    setCustomCharacter({
      skinColor: skinColors[Math.floor(Math.random() * skinColors.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      outfit: outfits[Math.floor(Math.random() * outfits.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)]
    })
  }

  return (
    <motion.div 
      className="character-selection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div 
          className="selection-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1>Elige tu personaje</h1>
          <p>Selecciona un personaje rápido o crea el tuyo propio</p>
        </motion.div>

        <motion.div 
          className="mode-selector"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <button 
            className={`mode-btn ${selectionMode === 'quick' ? 'active' : ''}`}
            onClick={() => setSelectionMode('quick')}
          >
            <Shuffle size={20} />
            Selección Rápida
          </button>
          <button 
            className={`mode-btn ${selectionMode === 'custom' ? 'active' : ''}`}
            onClick={() => setSelectionMode('custom')}
          >
            <Palette size={20} />
            Creación Manual
          </button>
        </motion.div>

        {selectionMode === 'quick' ? (
          <motion.div 
            className="quick-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="characters-grid">
              {quickCharacters.map((character, index) => (
                <motion.div
                  key={character.id}
                  className={`character-card ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  onClick={() => handleQuickSelect(character)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="character-avatar">
                    <span className="avatar-emoji">{character.avatar}</span>
                    {selectedCharacter?.id === character.id && (
                      <motion.div 
                        className="selected-indicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </div>
                  <h3>{character.name}</h3>
                  <p className="character-source">{character.source}</p>
                  <p className="character-personality">{character.personality}</p>
                  <div className="character-colors">
                    {character.colors.map((color, i) => (
                      <div 
                        key={i}
                        className="color-dot"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="custom-creation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="custom-preview">
              <div className="avatar-preview">
                <div 
                  className="preview-face"
                  style={{ backgroundColor: customCharacter.skinColor }}
                >
                  <div 
                    className="preview-hair"
                    style={{ 
                      backgroundColor: customCharacter.hairColor,
                      borderRadius: customCharacter.hairStyle === 'curly' ? '50%' : '10px'
                    }}
                  />
                  <div className="preview-eyes">👀</div>
                </div>
              </div>
              <button className="randomize-btn" onClick={randomizeCustom}>
                <Shuffle size={16} />
                Aleatorio
              </button>
            </div>

            <div className="customization-options">
              <div className="option-group">
                <label>Color de piel</label>
                <div className="color-options">
                  {skinColors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${customCharacter.skinColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCustomCharacter({...customCharacter, skinColor: color})}
                    />
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Color de cabello</label>
                <div className="color-options">
                  {hairColors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${customCharacter.hairColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCustomCharacter({...customCharacter, hairColor: color})}
                    />
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Estilo de cabello</label>
                <div className="style-options">
                  {hairStyles.map((style) => (
                    <button
                      key={style}
                      className={`style-option ${customCharacter.hairStyle === style ? 'selected' : ''}`}
                      onClick={() => setCustomCharacter({...customCharacter, hairStyle: style})}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Outfit</label>
                <div className="style-options">
                  {outfits.map((outfit) => (
                    <button
                      key={outfit}
                      className={`style-option ${customCharacter.outfit === outfit ? 'selected' : ''}`}
                      onClick={() => setCustomCharacter({...customCharacter, outfit: outfit})}
                    >
                      {outfit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="action-buttons"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <button 
            className="btn"
            onClick={handleConfirm}
            disabled={selectionMode === 'quick' && !selectedCharacter}
          >
            <Check size={20} />
            Confirmar
          </button>
        </motion.div>
      </div>

      <style>{`
        .character-selection {
          min-height: 100vh;
          padding: 2rem 0;
        }

        .selection-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .selection-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .mode-selector {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mode-btn.active {
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          border-color: #8b5cf6;
        }

        .mode-btn:hover {
          transform: translateY(-2px);
        }

        .characters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .character-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .character-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
        }

        .character-card.selected {
          border-color: #8b5cf6;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
        }

        .character-avatar {
          position: relative;
          margin-bottom: 1rem;
        }

        .avatar-emoji {
          font-size: 3rem;
          display: block;
        }

        .selected-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .character-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .character-source {
          font-size: 0.9rem;
          opacity: 0.7;
          margin-bottom: 0.5rem;
        }

        .character-personality {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-bottom: 1rem;
        }

        .character-colors {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .custom-creation {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .custom-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .avatar-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .preview-face {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-hair {
          position: absolute;
          top: -10px;
          left: 10px;
          right: 10px;
          height: 30px;
        }

        .preview-eyes {
          font-size: 1.5rem;
        }

        .randomize-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .randomize-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .customization-options {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .option-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .option-group label {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .color-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-option {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .color-option.selected {
          border-color: white;
          box-shadow: 0 0 0 2px #8b5cf6;
        }

        .style-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .style-option {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
        }

        .style-option.selected {
          background: #8b5cf6;
          border-color: #8b5cf6;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .characters-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .custom-creation {
            grid-template-columns: 1fr;
          }
          
          .mode-selector {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default CharacterSelection