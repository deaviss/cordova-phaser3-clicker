# cordova-phaser3-clicker

## How to run on android  
Make sure you have cordova installed `npm i -g cordova`  
After that, just type `cordova run android` or `cordova run browser`

## How does it look like
![img1](https://puu.sh/DPMDA/555cf8537c.png)


## What is done
- Monsters
	- Player can kill monster by clicking on it, or by player's damage per second
	- Monsters drop gold coins
	- Current monster is randomly choosen from monsterData
	- After clicking a monster a damage dealt is shown on screen (on/off later)
- Player
	- Player has his gold, click damage and damage per second coming from upgrades
- Gold coins
	- Gold coins drop after killing a monster in random quantity
		- If monster is a not a boss 1-6 golden coins can drop
		- If monster is a boss 6-9 golden coins can drop
	- Each gold coin has random amount of gold 
		- If monster is not a boss `Math.round(Math.pow(state.world.level, 1.14) * state.player.bossKilled + 1 * Random(1,1.2))`
		- If monster is a boss `Math.round(Math.pow(state.world.level, 1.14) * state.player.bossKilled + 1 * Random(1.3,1.5))`
	- Player can click on coin to pick it up. If after 3 seconds coin is not clicked, it's automaticly picked up.
- Background
	- Paralax background with 5 moving layers
- Upgrades
	- Upgrades are displayed via [rex.ui grid table](https://phaser.io/news/2019/01/rexui-plugins)
	- Each upgrade has it's own values
	- Each upgrade after certain level can be upgraded (eg. after having 25 of 'Attack' it gives 1.25 click damge instead of 1.0 )

## To-Do
- More upgrades
- Better graphics
- Better styling
- Game adjustment ( i get, that the game is not playable now, need to do more logic )
- Game settings
- Save/load