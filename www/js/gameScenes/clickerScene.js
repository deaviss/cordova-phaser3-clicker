export class clickerScene extends Phaser.Scene {

  constructor () {
		super({ key: 'clickerScene' })
	}


	preload() {
		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, 270, 320, 50);
		
		var width = this.cameras.main.width;
		var height = this.cameras.main.height;
		var loadingText = this.make.text({
				x: width / 2,
				y: height / 2 - 50,
				text: 'Loading...',
				style: {
						font: '20px monospace',
						fill: '#ffffff'
				}
		});
		loadingText.setOrigin(0.5, 0.5);
		
		var percentText = this.make.text({
				x: width / 2,
				y: height / 2 - 5,
				text: '0%',
				style: {
						font: '18px monospace',
						fill: '#ffffff'
				}
		});
		percentText.setOrigin(0.5, 0.5);
		
		var assetText = this.make.text({
				x: width / 2,
				y: height / 2 + 50,
				text: '',
				style: {
						font: '18px monospace',
						fill: '#ffffff'
				}
		});

		assetText.setOrigin(0.5, 0.5);
		
		this.load.on('progress', function (value) {
				percentText.setText(parseInt(value * 100) + '%');
				progressBar.clear();
				progressBar.fillStyle(0xffffff, 1);
				progressBar.fillRect(250, 280, 300 * value, 30);
		});
		
		this.load.on('fileprogress', function (file) {
				assetText.setText('Loading asset: ' + file.key);
		});

		this.load.on('complete', function () {
				progressBar.destroy();
				progressBox.destroy();
				loadingText.destroy();
				percentText.destroy();
				assetText.destroy();
		});
		this.load.image('forest-back', 'img/parallax-forest-back-trees.png');
		this.load.image('forest-lights', 'img/parallax-forest-lights.png');
		this.load.image('forest-middle', 'img/parallax-forest-middle-trees.png');
		this.load.image('forest-front', 'img/parallax-forest-front-trees.png');
		// monsters
		this.load.spritesheet('skl1', 'img/enemies/skeleton.png', { frameWidth: 64, frameHeight: 128 })

		this.load.spritesheet('aerocephal', 'img/enemies/aerocephal.png', { frameWidth: 192, frameHeight: 192 })
    this.load.spritesheet('arcana_drake', 'img/enemies/arcana_drake.png', { frameWidth: 192, frameHeight: 256 })
    this.load.spritesheet('aurum-drakueli', 'img/enemies/aurum-drakueli.png', { frameWidth: 320, frameHeight: 256 })
    this.load.spritesheet('bat', 'img/enemies/bat.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('daemarbora', 'img/enemies/daemarbora.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('deceleon', 'img/enemies/deceleon.png', { frameWidth: 256, frameHeight: 256 })
    this.load.spritesheet('demonic_essence', 'img/enemies/demonic_essence.png', { frameWidth: 128, frameHeight: 192 })
    this.load.spritesheet('dune_crawler', 'img/enemies/dune_crawler.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('green_slime', 'img/enemies/green_slime.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('nagaruda', 'img/enemies/nagaruda.png', { frameWidth: 192, frameHeight: 256 })
    this.load.spritesheet('rat', 'img/enemies/rat.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('scorpion', 'img/enemies/scorpion.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('skeleton', 'img/enemies/skeleton.png', { frameWidth: 64, frameHeight: 128 })
    this.load.spritesheet('snake', 'img/enemies/snake.png', { frameWidth: 128, frameHeight: 64 })
    this.load.spritesheet('spider', 'img/enemies/spider.png', { frameWidth: 64, frameHeight: 64 })
		this.load.spritesheet('stygian_lizard', 'img/enemies/stygian_lizard.png', { frameWidth: 192, frameHeight: 192 })
		
		//this.load.image('gold_coin', 'img/items/I_GoldCoin.png');
	}

	create() {

		this.playerLogic();

		var state = this;
		this.background = this.add.group();
		['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
		.forEach(function(image) {
				var bg = state.add.tileSprite(0, 0, state.sys.game.config.width,
					state.sys.game.config.height, image, '', state.background);
				bg.setTileScale(4,6)
				bg.setOrigin(0,0)
		});
		
		this.monsterLogic();

		this.createMenuBar();

		this.drawText();

		// create a pool of gold coins
		// this.coins = this.add.group();
		// this.coins.createMultiple(50, 'gold_coin', '', false);
		// this.coins.setAll('inputEnabled', true);
		// this.coins.setAll('goldValue', 1);
		// this.coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);
	}

	drawText() {

		// player info
		this.playerInfoUI = this.add.group();
		this.playerGold = this.add.text(0, 3, `Gold: ${this.player.gold}`, {
			font: '20px Arial Black',
			fill: '#fff',
		} )

		// end of player info

		// monster
		this.monsterInfoUI = this.add.group();
		this.monsterNameTxt = this.add.text(this.currentMonster.x - 32, this.currentMonster.y + 320, this.currentMonster.details.name, {
			font: '40px Arial Black',
			fill: '#fff',
			strokeThickness: 3
		}).setOrigin(0.5, 0.5)
		this.monsterNameText = this.monsterInfoUI.add(this.monsterNameTxt);
		
		this.monsterHPText = this.add.text(this.currentMonster.x - 32, this.currentMonster.y + 380, this.currentMonster.health + ' HP', {
			font: '32px Arial Black',
			fill: '#ff0000',
			strokeThickness: 4
		}).setOrigin(0.5,0.5);
		this.monsterHealthText = this.monsterInfoUI.add(this.monsterHPText);
		// end of monster


	}

	playerLogic(){
		this.player = {
			clickDmg: 1,
			clickDmgBonus: 0,
			gold: 0,
			dps: 0,
		};

		this.world = {
			level: 0,
			killed: 0,
			toKill: 10
		}
	}

	monsterLogic(){
		var state = this;
		var monsterData = [
			{name: 'Aerocephal',        image: 'aerocephal',        maxHealth: 10},
			{name: 'Arcana Drake',      image: 'arcana_drake',      maxHealth: 20},
			{name: 'Aurum Drakueli',    image: 'aurum-drakueli',    maxHealth: 30},
			{name: 'Bat',               image: 'bat',               maxHealth: 5},
			{name: 'Daemarbora',        image: 'daemarbora',        maxHealth: 10},
			{name: 'Deceleon',          image: 'deceleon',          maxHealth: 10},
			{name: 'Demonic Essence',   image: 'demonic_essence',   maxHealth: 15},
			{name: 'Dune Crawler',      image: 'dune_crawler',      maxHealth: 8},
			{name: 'Green Slime',       image: 'green_slime',       maxHealth: 3},
			{name: 'Nagaruda',          image: 'nagaruda',          maxHealth: 13},
			{name: 'Rat',               image: 'rat',               maxHealth: 2},
			{name: 'Scorpion',          image: 'scorpion',          maxHealth: 2},
			{name: 'Skeleton',          image: 'skeleton',          maxHealth: 6},
			{name: 'Snake',             image: 'snake',             maxHealth: 4},
			{name: 'Spider',            image: 'spider',            maxHealth: 4},
			{name: 'Stygian Lizard',    image: 'stygian_lizard',    maxHealth: 20}
		];


		this.monsters = this.add.group();

 
		var monster;
		monsterData.forEach(function(data) {
				// create a sprite for them off screen
				monster = state.monsters.create(1000, state.sys.game.config.height / 2, data.image);
				// reference to the database
				monster.details = data;
				monster.displayWidth = 128;
				monster.displayHeight = 128;
				monster.alive = true;
				monster.defaultPos = {
					x: state.sys.game.config.width / 2 + 50,
					y: state.sys.game.config.height / 2
				}
				monster.setOrigin(0.5,0.5);
				monster.setInteractive();
				monster.damage = function(amount){
					if(this.health <= amount){
						this.health = 0;
						this.emit('killed')
						
					}else
						this.health -= amount;
					console.log(this.health)
				}
				monster.revive = function(){
					this.emit('revived')
				}
				//enable input so we can click it!
				monster.inputEnabled = true;
				monster.on('pointerdown', function() {
					state.onClickMonster();
				})

				// use the built in health component
				monster.health = monster.maxHealth = data.maxHealth;
				
				// hook into health and lifecycle events
				monster.on('killed', function() {
					state.onKilledMonster(state.currentMonster);
				})
				monster.on('revived', function() {
					state.onRevivedMonster(state.currentMonster);
				})
		});

		var rand = Phaser.Math.RND.between(0, this.monsters.getChildren().length -1);
		this.currentMonster = this.monsters.getChildren()[rand];
		//this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
		this.currentMonster.setPosition(this.currentMonster.defaultPos.x, this.currentMonster.defaultPos.y)
		
		// this.monsterDisplayName = this.add.text(this.sys.game.config.width / 2,
		// 	this.sys.game.config.height / 2 + 100,
		// 	`${this.currentMonster.details.name} - ${this.currentMonster.health}/${this.currentMonster.maxHealth}`, { fill: '#0f0'})
		



		
	}

	onClickMonster() {
		// reset the currentMonster before we move him
		console.log('click')
		
		
		//this.monsterDisplayName.text = `${this.currentMonster.details.name} - ${this.currentMonster.health}/${this.currentMonster.maxHealth}`

		this.currentMonster.damage(this.player.clickDmg);
		this.monsterHPText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';
	}

	onKilledMonster(monster) {
		// move the monster off screen again
		monster.setPosition(1000, this.sys.game.config.height / 2);
		console.log('zabity')
 
    // pick a new monster
    var rand = Phaser.Math.RND.between(0, this.monsters.getChildren().length -1);
		this.currentMonster = this.monsters.getChildren()[rand];
    // make sure they are fully healed
    this.currentMonster.revive(this.currentMonster.maxHealth);
	}

	onRevivedMonster(monster){
		console.log('ozywiony')
		this.currentMonster.setPosition(this.currentMonster.defaultPos.x, this.currentMonster.defaultPos.y)
		// update the text display
		this.currentMonster.health = this.currentMonster.maxHealth;
    this.monsterNameTxt.text = monster.details.name;
    this.monsterHealthText.text = monster.health + 'HP';
	}

	

	createMenuBar(){
		// menu background
		this.menuUi = this.createRectangle(0, 70, 160, 700, 0x4287f5, 0.3)
		this.upgrade1 = this.createRectangle(10,90, 140, 50, 0xf54296, 0.5)
		this.upgrade1.on('pointerdown', function() {console.log('upgrade1')})

		// playerInfo background
		this.playerInfoBG = this.createRectangle(0,0,this.sys.game.config.width, 30, 0x42f58a, 0.8)
	}


	createRectangle(x,y,w,h,color, alpha = 1,cb = null){
		var rect = new Phaser.Geom.Rectangle(x, y, w, h);
    var graphics = this.add.graphics({ fillStyle: { color: color, alpha: alpha } });
    graphics.fillRectShape(rect);
		graphics.setInteractive(rect, Phaser.Geom.Rectangle.Contains)
		return graphics;
	}
}


