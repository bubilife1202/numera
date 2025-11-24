import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { PreloadScene } from '../../game/scenes/PreloadScene';
import { MainScene } from '../../game/scenes/MainScene';

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      parent: 'phaser-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 800 }, // Gravity for side-scrolling platformer
          debug: false,
        },
      },
      scene: [PreloadScene, MainScene],
      backgroundColor: '#87CEEB',
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="phaser-container" className="w-full h-full" />;
}
