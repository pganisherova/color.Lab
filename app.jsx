import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentPalette, setCurrentPalette] = useState([]);
  const [lockedColors, setLockedColors] = useState([false, false, false, false, false]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    generatePalette();
    loadSavedPalettes();
  }, []);

  const loadSavedPalettes = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('palettes') || '[]');
      setSavedPalettes(saved);
    } catch (error) {
      setSavedPalettes([]);
    }
  };

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return `#${randomColor}`.toUpperCase();
  };

  const generatePalette = () => {
    const newPalette = currentPalette.length > 0 ? [...currentPalette] : [];
    
    for (let i = 0; i < 5; i++) {
      if (!lockedColors[i] || newPalette.length === 0) {
        newPalette[i] = getRandomColor();
      }
    }
    
    setCurrentPalette(newPalette);
  };

  const toggleLock = (index) => {
    const newLockedColors = [...lockedColors];
    newLockedColors[index] = !newLockedColors[index];
    setLockedColors(newLockedColors);
  };

  const savePalette = () => {
    const newSavedPalettes = [...savedPalettes, currentPalette];
    setSavedPalettes(newSavedPalettes);
    localStorage.setItem('palettes', JSON.stringify(newSavedPalettes));
  };

  const deletePalette = (index) => {
    const newSavedPalettes = savedPalettes.filter((_, i) => i !== index);
    setSavedPalettes(newSavedPalettes);
    localStorage.setItem('palettes', JSON.stringify(newSavedPalettes));
  };

  const copyColor = (color, index) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>
          <span style={{fontSize: '2.5rem'}}>🎨</span>
          <span>Ranglar Palitrasi Generatori</span>
        </h1>
      </div>

      <div className="container">
        <button className="generate-btn" onClick={generatePalette}>
          🔄 Generate Palette
        </button>

        <div className="palette-box">
          <div className="colors-grid">
            {currentPalette.map((color, index) => (
              <div key={index} className="color-item">
                <div className="color-box-wrapper" data-color-index={index}>
                  <div 
                    className="color-box" 
                    style={{backgroundColor: color}}
                    onClick={() => copyColor(color, index)}
                  >
                    <div className="color-overlay">
                      <svg className="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <button 
                      className="lock-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(index);
                      }}
                    >
                      {lockedColors[index] ? (
                        <svg className="lock-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="lock-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {copiedIndex === index && (
                    <div className="copied-message">
                      Nusxalandi! ✓
                    </div>
                  )}
                </div>

                <div className="color-code">{color}</div>
              </div>
            ))}
          </div>

          <button className="save-btn" onClick={savePalette}>
            ⭐ Save Palette
          </button>
        </div>

        {savedPalettes.length > 0 && (
          <div className="saved-section">
            <h2 className="saved-title">
              <span>📦</span>
              <span>Saved Palettes</span>
            </h2>

            <div>
              {savedPalettes.map((palette, paletteIndex) => (
                <div key={paletteIndex} className="saved-palette">
                  <div className="saved-colors-grid">
                    {palette.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="saved-color-box"
                        style={{backgroundColor: color}}
                        title={color}
                        onClick={() => navigator.clipboard.writeText(color)}
                      />
                    ))}
                  </div>

                  <button 
                    className="delete-btn"
                    onClick={() => deletePalette(paletteIndex)}
                  >
                    <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;