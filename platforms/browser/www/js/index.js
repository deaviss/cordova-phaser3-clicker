const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const Random = Phaser.Math.Between;
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
  
  this.load.scenePlugin({
		key: 'rexuiplugin',
		url: 'plugins/rexuiplugin.min.js',
		sceneKey: 'rexUI'
	});  
  // bg
  this.load.image('forest-back', 'img/parallax-forest-back-trees.png');
  this.load.image('forest-lights', 'img/parallax-forest-lights.png');
  this.load.image('forest-middle', 'img/parallax-forest-middle-trees.png');
  this.load.image('forest-front', 'img/parallax-forest-front-trees.png');
  
  this.load.image('mountain-bg', 'img/parallax-mountain-bg.png');
  this.load.image('mountain-front', 'img/parallax-mountain-foreground-trees.png');
  this.load.image('mountain-mountain1', 'img/parallax-mountain-montain-far.png');
  this.load.image('mountain-mountain2', 'img/parallax-mountain-mountains.png');
  this.load.image('mountain-trees', 'img/parallax-mountain-trees.png');
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
  this.load.image('swordIcon2', 'img/items/S_Sword16.png');
  this.load.image('swordIcon3', 'img/items/S_Sword17.png');
  this.load.image('swordIcon4', 'img/items/S_Sword18.png');
  this.load.image('swordIcon5', 'img/items/S_Sword19.png');
  this.load.image('swordIcon6', 'img/items/S_Sword20.png');
  this.load.image('swordIcon7', 'img/items/S_Sword21.png');
  // coin
  this.load.image('golden_coin', 'img/items/I_GoldCoin.png')
}

function create() {

  this.gameConfig = {
    displayHitText: true,
    debug: true
  }

  

  this.player = {
    clickDmg: 1,
    clickDmgBonus: 0,
    gold: 0,
    dps: 1,
    dpsSources: [],
    bossKilled: 0
  };

  this.world = {
    level: 1,
    killed: 0,
    toKill: 10
  }

  

  var state = this;
  function log(txt) {
    if(state.gameConfig.debug)
      console.log(txt)
  }
  var bgMove = function(bg, index){
    index += 0.1;
    bg.tilePositionX += 0.5 * (index * 0.7);
  }

  function createBackground(){
    state.background = state.add.group();
    // ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
    ['mountain-bg', 'mountain-mountain1', 'mountain-mountain2', 'mountain-trees', 'mountain-front']
    .forEach(function(image, index) {
        var bg = state.add.tileSprite(0, 0, state.sys.game.config.width,
          state.sys.game.config.height - 315, image, '', state.background);
        bg.setTileScale(2.5,4)
        bg.setOrigin(0,0)
        var x = state.time.addEvent({delay: 50, callback: bgMove, args: [bg, index], callbackScope: this, loop: true})
    });
  }
  createBackground();
  

  

  
		
  var monsterData = [
    {name: 'Rat',               image: 'rat',               maxHealth: 10,  boss: false, minLvl: 0,  maxLvl: 10},
    {name: 'Scorpion',          image: 'scorpion',          maxHealth: 10,  boss: false, minLvl: 0,  maxLvl: 10},
    {name: 'Green Slime',       image: 'green_slime',       maxHealth: 14,  boss: false, minLvl: 0,  maxLvl: 10},
    {name: 'Snake',             image: 'snake',             maxHealth: 14,  boss: false, minLvl: 4,  maxLvl: 10},
    {name: 'Spider',            image: 'spider',            maxHealth: 19,  boss: false, minLvl: 4,  maxLvl: 14},
    {name: 'Bat',               image: 'bat',               maxHealth: 19,  boss: false, minLvl: 4,  maxLvl: 14},
    {name: 'Skeleton',          image: 'skeleton',          maxHealth: 28,  boss: false, minLvl: 8,  maxLvl: 18},
    {name: 'Dune Crawler',      image: 'dune_crawler',      maxHealth: 28,  boss: false, minLvl: 8,  maxLvl: 18},
    {name: 'Daemarbora',        image: 'daemarbora',        maxHealth: 28, boss: false, minLvl: 8,  maxLvl: 18},
    {name: 'Deceleon',          image: 'deceleon',          maxHealth: 36, boss: false, minLvl: 11, maxLvl: 21},
    {name: 'Aerocephal',        image: 'aerocephal',        maxHealth: 36, boss: false, minLvl: 11, maxLvl: 21},
    {name: 'Nagaruda',          image: 'nagaruda',          maxHealth: 36, boss: false, minLvl: 11, maxLvl: 21},
    {name: 'Demonic Essence',   image: 'demonic_essence',   maxHealth: 40, boss: false, minLvl: 16, maxLvl: 100},
    {name: 'Arcana Drake',      image: 'arcana_drake',      maxHealth: 30, boss: true,  minLvl: 5,  maxLvl: 10},
    {name: 'Stygian Lizard',    image: 'stygian_lizard',    maxHealth: 50, boss: true,  minLvl: 15, maxLvl: 16},
    {name: 'Aurum Drakueli',    image: 'aurum-drakueli',    maxHealth: 70, boss: true,  minLvl: 20, maxLvl: 100}
  ];

  var upgradeButtonsData = [
    {icon: 'dagger', name: 'Attack', level: 1, cost: 10, value: 1, boost: 1, 
    stats:[
      {
        level: 25,
        boost: 1.25
      },
      {
        level: 50,
        boost: 1.5
      }
    ], purchaseHandler: function() {
      this.stats.forEach(e => {
        if(this.level == e.level){
          this.boost = e.boost;
        }
      });
      state.player.clickDmg = this.level * this.boost
    }},
    {icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 25, value: 2, boost: 1,
    stats:[
      {
        level: 25,
        boost: 1.25
      },
      {
        level: 50,
        boost: 1.5
      }
    ], purchaseHandler: function() {
      this.stats.forEach(e => {
        if(this.level == e.level){
          this.boost = e.boost;
        }
      });
      var _this = this;
      var dps = state.player.dpsSources.filter(function(el) { return el.name==_this.name})
      dps[0].dmg = this.value * this.level * this.boost
    }},
    {icon: 'swordIcon2', name: 'Auto-Attack 2', level: 0, cost: 400, value: 8, boost: 1,
    stats:[
      {
        level: 25,
        boost: 1.25
      },
      {
        level: 50,
        boost: 1.5
      }
    ], purchaseHandler: function() {
      this.stats.forEach(e => {
        if(this.level == e.level){
          this.boost = e.boost;
        }
      });
      var _this = this;
      var dps = state.player.dpsSources.filter(function(el) { return el.name==_this.name})
      dps[0].dmg = this.value * this.level * this.boost
    }},
    {icon: 'swordIcon3', name: 'Auto-Attack 3', level: 0, cost: 1500, value: 18, boost: 1, 
    stats:[
      {
        level: 25,
        boost: 1.25
      },
      {
        level: 50,
        boost: 1.5
      }
    ], purchaseHandler: function() {
      this.stats.forEach(e => {
        if(this.level == e.level){
          this.boost = e.boost;
        }
      });
      var _this = this;
      var dps = state.player.dpsSources.filter(function(el) { return el.name==_this.name})
      dps[0].dmg = this.value * this.level * this.boost
    }}
  ];

  // preload
  upgradeButtonsData.forEach(function(item){
    var getAdjustedCost = function () {
      if(item.level == 0 || (item.name == 'Attack' && item.level == 1))
        return item.cost;
      return Math.ceil(item.cost * Math.pow(1.11, item.level))
    }
    state.player.dpsSources.push({
      name: item.name,
      dmg: 0
    });
    item.costText = `Cost: ${numFormat(getAdjustedCost())}`
  })
  


  function createMonster(){
    state.monsters = state.add.group();
    var monster;
    monsterData.forEach(function(data) {
        // create a sprite for them off screen
        monster = state.monsters.create(1000, state.sys.game.config.height / 2, data.image);
        // reference to the database
        monster.details = data;
        monster.displayWidth = 254;
        monster.displayHeight = 254;
        monster.alive = true;
        monster.defaultPos = {
          x: state.sys.game.config.width / 2 ,
          y: state.sys.game.config.height / 3 + 25
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
    var rand = Random(0, state.monsters.getChildren().length -1);
    state.currentMonster = state.monsters.getChildren()[0];
    //this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
    state.currentMonster.setPosition(state.currentMonster.defaultPos.x, state.currentMonster.defaultPos.y)
  }
  createMonster();
  
  
  // this.monsterDisplayName = this.add.text(this.sys.game.config.width / 2,
  // 	this.sys.game.config.height / 2 + 100,
  // 	`${this.currentMonster.details.name} - ${this.currentMonster.health}/${this.currentMonster.maxHealth}`, { fill: '#0f0'})
  
  var onPlayerDps = function() {
    var dps = 0;
    state.player.dpsSources.forEach(item => {
      dps += item.dmg;
    });
    if (dps > 0) {
      if (state.currentMonster && state.currentMonster.alive) {
        var dmg = dps / 10;
        state.currentMonster.damage(dmg);
        // update the health text
        state.monsterHPText.text = state.currentMonster.alive ? numFormat(Math.round(state.currentMonster.health)) + ' HP' : 'DEAD';
      }
    }
  }
  var x = this.time.addEvent({delay: 100, callback: onPlayerDps, callbackScope: this, loop: true})
  
  
  this.coins = this.add.group();
  var onClickCoin = function(c) {
    if(!c.active) return;
    state.player.gold += c.goldValue;
    state.playerGold.text = `Gold: ${numFormat(state.player.gold)}`
    c.destroy();
  }
  var createCoin = function(amt){
    for(i=0; i < amt; i++){
      var tempCoin;
      
      var rndX = Random(state.currentMonster.x - 100,state.currentMonster.x + 100);
      var rndY = Random(state.currentMonster.y, state.currentMonster.y - 100)
      var moveLeft = rndX >= state.currentMonster.x ? true : false
      tempCoin = state.coins.create(Random(state.currentMonster.x - 60, state.currentMonster.x + 60), state.currentMonster.y + 30, 'golden_coin' )
      
      // tempCoin.goldValue = Math.round(state.world.level * 1.43 * Random(1,1.4));
      tempCoin.goldValue = (state.world.level % 5 == 0) ? 
        Math.round(Math.pow(state.world.level, 1.14) * state.player.bossKilled + 1 * Random(1.3,1.5)) :
       Math.round(Math.pow(state.world.level, 1.14) * state.player.bossKilled + 1 * Random(1,1.2));
      
      tempCoin.setInteractive();
      // state.time.addEvent(Phaser.Timer.SECOND * 3, onClickCoin, this, tempCoin);
      state.time.addEvent({delay: 3000, callback: onClickCoin, args: [tempCoin], callbackScope: this})
      tempCoin.on('pointerdown', function() { onClickCoin(this); })
      
      state.coinPool = state.add.group();
      var coinData = {
        targets: tempCoin,
        props: {
          x: { value: moveLeft == true ? Random(state.currentMonster.x - 180, state.currentMonster.x) : Random(state.currentMonster.x, state.currentMonster.x + 180), 
            duration: 3500, 
            ease: 'Power3' },
          y: { value: state.currentMonster.y + 160, 
            duration: 1300, 
            ease: 'Bounce.easeOut' }
        },
        duration: 200,
        ease: 'Bounce',
      }
      tempCoin.tween = state.tweens.add(coinData)
    }
  }
  


  var onClickMonster = function() {
    if(state.gameConfig.displayHitText)
      createDmgText();
    state.currentMonster.damage(state.player.clickDmg);
    state.monsterHPText.text = state.currentMonster.alive ? numFormat(Math.round(state.currentMonster.health)) + ' HP' : 'DEAD';
  }
  var onKilledMonster = function(monster) {
    // move the monster off screen again
    monster.setPosition(2000, state.sys.game.config.height / 2);
    var noIdea = state.world.level.toString()
    noIdea = noIdea[noIdea.length-1]
    var isBoss = (noIdea == '4' || noIdea == '9') && state.world.killed == 9 ? true : false;
    // pick a new monster
    var monsterPool = state.monsters.getChildren().filter(function(m) { 
      if(m.details.minLvl -1 <= state.world.level && state.world.level <= m.details.maxLvl)
        return isBoss ? m.details.boss == true : m.details.boss == false;
    })
    
    // var rand = Random(0, state.monsters.getChildren().length -1);
    var rand = Random(0, monsterPool.length - 1);
    state.currentMonster = monsterPool[rand];
    var maxHp = isBoss ? 
     Math.ceil(state.currentMonster.details.maxHealth + (Random( (Math.pow(state.world.level, 1.45)),(Math.pow(state.world.level, 1.55)) ) * Math.pow(state.player.bossKilled + 1, 1.33) * Random(6,7))) :
     Math.ceil(state.currentMonster.details.maxHealth + (Random( (Math.pow(state.world.level, 1.45)),(Math.pow(state.world.level, 1.55)) ) * Math.pow(state.player.bossKilled, 1.33) * Random(3,4)));

    state.currentMonster.maxHealth = maxHp;
    // make sure they are fully healed
    state.currentMonster.revive(state.currentMonster.maxHealth);
    
    state.world.killed ++;
    if (state.world.killed >= state.world.toKill) {
      state.world.level++;
      state.world.killed = 0;
    }
    if(isBoss){
      state.world.toKill = 1;
      state.player.bossKilled += 1;
    }else 
      state.world.toKill = 10;
    state.worldLevelUI.text = `Level: ${state.world.level}`;
    state.worldProgressUI.text = `Killed: ${state.world.killed}/${state.world.toKill}`

    if(isBoss)
      createCoin(Random(6,9))
    else
      createCoin(Random(1,6));
  }
  var createDmgText = function() {
    state.dmgTextPool = state.add.group();
    var dmgText;
    dmgText = state.add.text(state.input.x, state.input.y, numFormat(state.player.clickDmg), {
      font: '48px Arial Black',
      fill: '#ffad6e',
      strokeThickness: 4
    }).setOrigin(0.5,0.5);
    var dmgData = {
      targets: dmgText,
      x: Math.ceil(Random(state.currentMonster.x - 100,state.currentMonster.x + 100)),
      y: Random(state.input.y - 50, state.input.y - 100),
      duration: 700,
      ease: 'Cubic.easeOut',
      alpha: 0.02,
      onComplete: function(){
        // ee[0].visible = false
        // state.dmgTextPool.kill();
        dmgText.destroy();
      },
      onStart: function(e,ee){
        // dmgText.visible = true;
        ee[0].visible = true
      }
    }
    // dmgText.visible = false;
    // start out not existing, so we don't draw it yet
    dmgText.tween = state.tweens.add(dmgData)
    // dmgText.tween.stop();
    state.dmgTextPool.add(dmgText);
  
  }

  

  var onRevivedMonster = function(monster){
    state.currentMonster.setPosition(state.currentMonster.defaultPos.x, state.currentMonster.defaultPos.y)
    // update the text display
    state.currentMonster.health = state.currentMonster.maxHealth;
    state.monsterNameTxt.text = monster.details.name;
    state.monsterHealthText.text = numFormat(state.currentMonster.health) + 'HP';
  }

  var createRectangle = function(x,y,w,h,color, alpha = 1,cb = null){
    var rect = new Phaser.Geom.Rectangle(x, y, w, h);
    var graphics = state.add.graphics({ fillStyle: { color: color, alpha: alpha } });
    graphics.fillRectShape(rect);
    graphics.setInteractive(rect, Phaser.Geom.Rectangle.Contains)
    return graphics;
  }

  

  var onUpgradeClick = function(index){
    var item = upgradeButtonsData[index];
    var getAdjustedCost = function () {
      if(item.level == 0 || (item.name == 'Attack' && item.level == 1))
        return item.cost;
      return Math.ceil(item.cost * Math.pow(1.11, item.level))
    }
    if (state.player.gold >= getAdjustedCost()) {
      state.player.gold -= getAdjustedCost();
      state.playerGold.text = 'Gold: ' + numFormat(state.player.gold);
      item.level++;
      item.purchaseHandler();
    }
    item.costText = `Cost: ${numFormat(getAdjustedCost())}`
    upgradeButtonsData[index] = item;
  }


  var createMenu = function() {
		var scrollMode = 0; // 0:vertical, 1:horizontal
		var gridTable = state.rexUI.add.gridTable({
			x: 0,
			y: 640,
			width: 540,
			height: 960/3,

			scrollMode: scrollMode,

			background: state.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

			table: {
				cellWidth: (scrollMode === 0) ? undefined : 60,
				cellHeight: (scrollMode === 0) ? 60 : undefined,

				columns: 1,

				mask: {
					padding: 2,
				},

				reuseCellContainer: true,
			},

			// slider: {
			// 	track: state.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
			// 	thumb: state.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
			// },
			slider: false,

			header: state.rexUI.add.label({
				width: undefined,
				height: 30,

				orientation: scrollMode,
				background: state.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_DARK),
				text: state.add.text(0, 0, 'Upgrades'),
			}),

			space: {
				left: 20,
				right: 20,
				top: 20,
				bottom: 20,

				header: 10,

				table: 10,
			},

			createCellContainerCallback: function (cell, cellContainer) {
        
				var scene = cell.scene,
					width = cell.width,
					height = cell.height,
					item = cell.item,
					index = cell.index;
				if (cellContainer === null) {
					cellContainer = scene.rexUI.add.label({
						width: width,
						height: height,

						orientation: scrollMode,
						background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
            // icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
            icon: scene.add.image(0,0, item.icon),
						text: scene.add.text(0, 0, ''),

						// inside-cell spacing
						space: {
							icon: 10,
							left: 15,
							top: 0,
						}
					});
				} 

        // Set properties from item value
        // console.log(cellContainer)
				cellContainer.setMinSize(width, height); // Size might changed in state demo
				cellContainer.getElement('text').setText(`${item.name}: ${item.level}\n${item.costText}`); // Set text of text object
        // cellContainer.getElement('icon').setFillStyle(0x0); // Set fill color of round rectangle object
        return cellContainer;
			},
			items: upgradeButtonsData
		}).setOrigin(0,0)
			.layout()
				//.drawBounds(state.add.graphics(), 0xff0000);

		gridTable
		.on('cell.click', function (cellContainer, cellIndex) {
      onUpgradeClick(cellIndex)
      gridTable.refresh();
		}, state)
	}
	createMenu();

  var createUi = function(){
    
  
    // playerInfo background
    state.playerInfoBG = createRectangle(0,0,state.sys.game.config.width, 50, 0x42f58a, 0.8)
      // player info
    state.playerGold = state.add.text(0, 8, `Gold: ${state.player.gold}`, {
      font: '32px Arial Black',
      fill: '#fff',
    } )
    
    state.worldLevelUI = state.add.text(state.sys.game.config.width / 2, 60, `Level: ${state.world.level}`, {
      font: '28px Arial Black',
      fill: '#fff'
    }).setOrigin(0.5, 0.5)
    state.worldProgressUI = state.add.text(state.sys.game.config.width / 2, 90, `Killed: ${state.world.killed}/${state.world.toKill}`, {
      font: '28px Arial Black',
      fill: '#fff'
    }).setOrigin(0.5, 0.5)
  
    // end of player info
  
    // monster
    state.monsterInfoUI = state.add.group();
    state.monsterNameTxt = state.add.text(state.currentMonster.x , state.currentMonster.y + 200, state.currentMonster.details.name, {
      font: '40px Arial Black',
      fill: '#fff',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5)
    state.monsterNameText = state.monsterInfoUI.add(state.monsterNameTxt);
    
    state.monsterHPText = state.add.text(state.currentMonster.x , state.currentMonster.y + 260, numFormat(state.currentMonster.health) + ' HP', {
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

function numFormat(num, digits = 2) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}