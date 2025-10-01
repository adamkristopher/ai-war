import { useState } from 'react';
import { FactionType } from './shared/types/index';
import { HomePage } from './components/HomePage';
import { FactionSelect } from './components/FactionSelect';
import { GameView } from './components/GameView';
import { Rules } from './components/Rules';

type AppView = 'home' | 'faction-select' | 'game' | 'rules';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedFaction, setSelectedFaction] = useState<FactionType | null>(null);

  const handleSelectFaction = (faction: FactionType) => {
    setSelectedFaction(faction);
    setCurrentView('game');
  };

  const handleBackToMenu = () => {
    setSelectedFaction(null);
    setCurrentView('home');
  };

  if (currentView === 'home') {
    return (
      <HomePage
        onPlay={() => setCurrentView('faction-select')}
        onRules={() => setCurrentView('rules')}
      />
    );
  }

  if (currentView === 'rules') {
    return <Rules onClose={() => setCurrentView('home')} />;
  }

  if (currentView === 'faction-select') {
    return <FactionSelect onSelect={handleSelectFaction} />;
  }

  if (currentView === 'game' && selectedFaction) {
    return (
      <GameView
        selectedFaction={selectedFaction}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return null;
}

export default App;
