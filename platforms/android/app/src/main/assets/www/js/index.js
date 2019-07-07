
let config = {
  type: Phaser.CANVAS,
  width: 540,
  height: 960,
  scene: {
    preload: preload,
    create: create
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false
};

function preload(){
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
    
    this.load.image('dagger', 'img/items/W_Dagger001.png');
    this.load.image('swordIcon1', 'img/items/S_Sword15.png');
    // coin
    this.load.image('golden_coin', 'img/items/I_GoldCoin.png')
}

function create() {
  this.player = {
    clickDmg: 1,
    clickDmgBonus: 0,
    gold: 0,
    dps: 1,
  };

  this.world = {
    level: 0,
    killed: 0,
    toKill: 10
  }

  

  var state = this;
  

  this.background = this.add.group();
  ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
  .forEach(function(image) {
      var bg = state.add.tileSprite(0, 0, state.sys.game.config.width,
        state.sys.game.config.height, image, '', state.background);
      bg.setTileScale(4,6)
      bg.setOrigin(0,0)
  });
		
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

  var upgradeButtonsData = [
    {icon: 'dagger', name: 'Attack', level: 1, cost: 5, purchaseHandler: function(button, player) {
      state.player.clickDmg += 1;
    }},
    {icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 25, purchaseHandler: function(button, player) {
      state.player.dps += 5;
    }}
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
      }
      monster.revive = function(){
        this.emit('revived')
      }
      //enable input so we can click it!
      monster.inputEnabled = true;
      monster.on('pointerdown', function() {
        onClickMonster();
      })

      // use the built in health component
      monster.health = monster.maxHealth = data.maxHealth;
      
      // hook into health and lifecycle events
      monster.on('killed', function() {
        onKilledMonster(state.currentMonster);
      })
      monster.on('revived', function() {
        onRevivedMonster(state.currentMonster);
      })
  });

  var rand = Phaser.Math.RND.between(0, this.monsters.getChildren().length -1);
  this.currentMonster = this.monsters.getChildren()[rand];
  //this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
  this.currentMonster.setPosition(this.currentMonster.defaultPos.x, this.currentMonster.defaultPos.y)
  
  // this.monsterDisplayName = this.add.text(this.sys.game.config.width / 2,
  // 	this.sys.game.config.height / 2 + 100,
  // 	`${this.currentMonster.details.name} - ${this.currentMonster.health}/${this.currentMonster.maxHealth}`, { fill: '#0f0'})
  
  var onPlayerDps = function() {
    if (state.player.dps > 0) {
      if (state.currentMonster && state.currentMonster.alive) {
          var dmg = state.player.dps / 10;
          state.currentMonster.damage(dmg);
          // update the health text
          state.monsterHPText.text = state.currentMonster.alive ? Math.round(state.currentMonster.health) + ' HP' : 'DEAD';
      }
    }
  }
  var x = this.time.addEvent({delay: 100, callback: onPlayerDps, callbackScope: this, loop: true})
  console.log(x);
  
  
  this.coins = this.add.group();
  var onClickCoin = function(c) {
    if(!c.active) return;
    state.player.gold += c.goldValue;
    state.playerGold.text = `Gold: ${state.player.gold}`
    
    c.destroy();
  }
  var createCoin = function(amt){
    
    console.log('coin')
    for(i=0; i < amt; i++){
      var tempCoin;
      console.log('coin'+amt)
      tempCoin = state.coins.create(Phaser.Math.RND.between(state.currentMonster.x-50, state.currentMonster.x+70), state.sys.game.config.height / 2 + 100, 'golden_coin' )
      tempCoin.goldValue = Math.round(this.level * 1.33);;
      tempCoin.setInteractive();
      // state.time.addEvent(Phaser.Timer.SECOND * 3, onClickCoin, this, tempCoin);
      state.time.addEvent({delay: 3000, callback: onClickCoin, args: [tempCoin], callbackScope: this})
      tempCoin.on('pointerdown', function() { onClickCoin(this); console.log(this) })
    }
  }
  


  var onClickMonster = function() {
    // reset the currentMonster before we move him
    console.log('click')
    
    
    //state.monsterDisplayName.text = `${state.currentMonster.details.name} - ${state.currentMonster.health}/${state.currentMonster.maxHealth}`
  
    state.currentMonster.damage(state.player.clickDmg);
    state.monsterHPText.text = state.currentMonster.alive ? state.currentMonster.health + ' HP' : 'DEAD';
  }
  var onKilledMonster = function(monster) {
    // move the monster off screen again
    monster.setPosition(1000, state.sys.game.config.height / 2);
    console.log('zabity')
    
    // pick a new monster
    var rand = Phaser.Math.RND.between(0, state.monsters.getChildren().length -1);
    state.currentMonster = state.monsters.getChildren()[rand];
    // make sure they are fully healed
    state.currentMonster.revive(state.currentMonster.maxHealth);

    state.world.killed ++;
    if (state.world.killed >= state.world.toKill) {
      state.world.level++;
      state.world.killed = 0;
    }

    createCoin(Phaser.Math.RND.between(2,4));
  }
  var onRevivedMonster = function(monster){
    console.log('ozywiony')
    state.currentMonster.setPosition(state.currentMonster.defaultPos.x, state.currentMonster.defaultPos.y)
    // update the text display
    state.currentMonster.health = state.currentMonster.maxHealth;
    state.monsterNameTxt.text = monster.details.name;
    state.monsterHealthText.text = monster.health + 'HP';
  }

  var createRectangle = function(x,y,w,h,color, alpha = 1,cb = null){
    var rect = new Phaser.Geom.Rectangle(x, y, w, h);
    var graphics = state.add.graphics({ fillStyle: { color: color, alpha: alpha } });
    graphics.fillRectShape(rect);
    graphics.setInteractive(rect, Phaser.Geom.Rectangle.Contains)
    return graphics;
  }

  onUpgradeButtonClick = function (button) {
    if (state.player.gold - button.details.cost >= 0) {
      state.player.gold -= button.details.cost;
      state.playerGold.text = 'Gold: ' + state.player.gold;
      button.details.level++;
      button.text.text = button.details.name + ': ' + button.details.level;
      button.details.purchaseHandler.call(state, button, state.player);
    }
  }

  var createUpgrades = function() {
    // state.upgrade1 = createRectangle(15,90, 140, 50, 0xf54296, 0.5)
    // state.upgrade1.on('pointerdown', function() {console.log('upgrade1')})

    var button;
    upgradeButtonsData.forEach(function(buttonData, index) {
        // button = state.add.button(0, (50 * index), state.cache.getBitmapData('button'));
        var baseY = 90;
        if(index == 0 )
          baseY = 90;
        else 
          baseY = 90 + (80 * index);
        button = createRectangle(15, baseY, 180, 60, 0xf54296, 1);
        button.icon = state.add.image(21, baseY + 6, buttonData.icon).setOrigin(0,0);
        button.text = state.add.text(57, baseY + 6, buttonData.name + ': ' + buttonData.level, {font: '16px Arial Black'}).setOrigin(0,0);
        button.details = buttonData;
        button.costText = state.add.text(57, baseY + 24, 'Cost: ' + buttonData.cost, {font: '16px Arial Black'});
        // button.events.onInputDown.add(onUpgradeButtonClick, state);
        button.on('pointerdown', function() { onUpgradeButtonClick(this) })
    });
  }

  var createUi = function(){
    this.menuUIO = createRectangle(3, 68, 204, 704, 0x0, 1)
    this.menuUi = createRectangle(5, 70, 200, 700, 0x9a783d, 1)
    
    createUpgrades();
  
    // playerInfo background
    state.playerInfoBG = createRectangle(0,0,state.sys.game.config.width, 30, 0x42f58a, 0.8)
      // player info
    state.playerInfoUI = state.add.group();
    state.playerGold = state.add.text(0, 3, `Gold: ${state.player.gold}`, {
      font: '20px Arial Black',
      fill: '#fff',
    } )
  
    // end of player info
  
    // monster
    state.monsterInfoUI = state.add.group();
    state.monsterNameTxt = state.add.text(state.currentMonster.x - 32, state.currentMonster.y + 320, state.currentMonster.details.name, {
      font: '40px Arial Black',
      fill: '#fff',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5)
    state.monsterNameText = state.monsterInfoUI.add(state.monsterNameTxt);
    
    state.monsterHPText = state.add.text(state.currentMonster.x - 32, state.currentMonster.y + 380, state.currentMonster.health + ' HP', {
      font: '32px Arial Black',
      fill: '#ff0000',
      strokeThickness: 4
    }).setOrigin(0.5,0.5);
    state.monsterHealthText = state.monsterInfoUI.add(state.monsterHPText);
    // end of monster
  
  }
  createUi();
  

  // coins

  

  
  

}





var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      let game = new Phaser.Game(config);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();