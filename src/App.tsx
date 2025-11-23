/**
 * 누메라 메인 애플리케이션
 */

import GameCanvas from './components/game/GameCanvas';
import HUD from './components/ui/HUD';
import './App.css';

function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {/* 3D 게임 캔버스 */}
      <GameCanvas />

      {/* 게임 HUD (체력, XP, 화폐 등) */}
      <HUD />
    </div>
  );
}

export default App;
