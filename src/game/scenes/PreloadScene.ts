import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Load assets here
    // For prototype, we'll generate simple textures programmatically
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // Player texture
    graphics.fillStyle(0x3498db); // Blue
    graphics.fillRect(0, 0, 32, 48);
    graphics.generateTexture('player', 32, 48);
    graphics.clear();

    // Ground texture
    graphics.fillStyle(0x2ecc71); // Green
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('ground', 32, 32);
    graphics.clear();

    // Monster texture
    graphics.fillStyle(0xe74c3c); // Red
    graphics.fillRect(0, 0, 40, 40);
    graphics.generateTexture('monster', 40, 40);
    graphics.clear();

    // Damage Skin Font (simulated)
    // In a real app, you would load a bitmap font or sprite sheet
  }

  create() {
    this.scene.start('MainScene');
  }
}
