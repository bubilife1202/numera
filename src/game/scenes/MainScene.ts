import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private monsters!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('MainScene');
  }

  create() {
    // 1. Map / Environment (MapleStory Style: Side-scrolling platforms)
    this.createEnvironment();

    // 2. Player
    this.createPlayer();

    // 3. Monsters
    this.createMonsters();

    // 4. Input
    if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // 5. Colliders
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.monsters, this.platforms);

    // Combat interaction
    this.physics.add.overlap(this.player, this.monsters, this.handleMonsterCollision, undefined, this);

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, 1600, 600);
    this.physics.world.setBounds(0, 0, 1600, 600);

    // Instructions
    this.add.text(16, 16, 'Arrow Keys: Move/Jump | Space: Attack (Math)', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setScrollFactor(0);
  }

  update() {
    if (!this.cursors) return;

    // Player Movement (MapleStory feel: simple acceleration)
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.setFlipX(false); // Facing left (if sprite is drawn facing left) or true depending on asset
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.setFlipX(true);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }

    // Space to Attack
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
        this.attackNearestMonster();
    }
  }

  private createEnvironment() {
    this.add.rectangle(0, 0, 1600, 600, 0x87CEEB).setOrigin(0, 0); // Sky background

    this.platforms = this.physics.add.staticGroup();

    // Ground floor
    for (let x = 0; x < 1600; x += 32) {
        this.platforms.create(x, 584, 'ground').setOrigin(0, 0).refreshBody();
    }

    // Some floating platforms
    this.platforms.create(400, 400, 'ground').setScale(5, 1).refreshBody();
    this.platforms.create(800, 300, 'ground').setScale(5, 1).refreshBody();
    this.platforms.create(150, 250, 'ground').setScale(3, 1).refreshBody();
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
  }

  private createMonsters() {
    this.monsters = this.physics.add.group({
        key: 'monster',
        repeat: 5,
        setXY: { x: 300, y: 0, stepX: 200 }
    });

    this.monsters.children.iterate((child) => {
        const monster = child as Phaser.Physics.Arcade.Sprite;
        monster.setBounceY(0.2);
        monster.setCollideWorldBounds(true);
        // Simple AI: Move back and forth
        this.tweens.add({
            targets: monster,
            x: monster.x + 100,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
        return true;
    });
  }

  private handleMonsterCollision(player: any, monster: any) {
    // In a real RPG, touching a monster hurts the player.
    // For now, just a little knockback
    if (player.x < monster.x) {
        player.setVelocityX(-200);
    } else {
        player.setVelocityX(200);
    }
    player.setVelocityY(-100);
    player.setTint(0xff0000);
    this.time.delayedCall(200, () => player.clearTint());
  }

  private attackNearestMonster() {
    // Find nearest monster
    let nearestMonster: Phaser.Physics.Arcade.Sprite | null = null;
    let minDistance = 150; // Attack range

    this.monsters.children.iterate((child) => {
        const monster = child as Phaser.Physics.Arcade.Sprite;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, monster.x, monster.y);
        if (dist < minDistance) {
            nearestMonster = monster;
            minDistance = dist;
        }
        return true;
    });

    if (nearestMonster) {
        // Trigger Math Problem Event (Communicating with React)
        // For prototype, we simulate a "Quick Math" hit
        this.showDamage(nearestMonster as Phaser.Physics.Arcade.Sprite);
    }
  }

  private showDamage(monster: Phaser.Physics.Arcade.Sprite) {
    // Visual: MapleStory style damage numbers
    const damage = Math.floor(Math.random() * 900) + 100; // 100~999

    const damageText = this.add.text(monster.x, monster.y - 20, damage.toString(), {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffaa00',
        stroke: '#ffffff',
        strokeThickness: 2
    }).setOrigin(0.5, 0.5);

    // Animation: Pop up and fade
    this.tweens.add({
        targets: damageText,
        y: damageText.y - 50,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
            damageText.destroy();
        }
    });

    // Knockback monster
    monster.setVelocityY(-150);
  }
}
