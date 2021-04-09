/**
*	@filename	Mapper.js
*	@author		yayza_
*	@desc		All In One Mapping Script w/ upgrades
*/

function Mapper() {
	
	this.start = function (){
		var items;
		
		items = me.findItems(-1, 0);
		
		for (var i = 0; i < items.length; i++){
			if (this.checkMap(items[i])){
				this.openMap(items[i]);
				return true;
			}
		}
		
		this.upgradeMaps();
		
		return false;
		
	};

	this.upgradeMaps = function () {
		var map, maps, roll,
			ids = Config.Mapper.Maps,
			mapids = [];
		
		if(!this.buildRecipes("Rune")){
			return false;
		}		
		
		for (var i = 0; i < ids.length; i++){ 
			mapids.push(NTIPAliasClassID[ids[i]]);
		}
		
		if (me.getStat(14) + me.getStat(15) > 200000){
			maps = me.findItems(-1, 0).filter( function(x) { return mapids.indexOf(x.classid) > -1 && !this.checkMap(x)});
		} else {
			print("ÿc8Upgrading maps requiresÿc7 gold.ÿc8 Get your shit together!");
			return false;
		} 	
		
		if (maps.length > 0) {
			
			maps = maps.filter(function(elem, index, self){ // filter down to 1 map of each quality
			  return self.findIndex(function(t){
			  return t.quality == elem.quality;
				}) === index;
			});	
			
			print("ÿc7We have maps! ÿc2 Lets try upgrading...");
			
 			while(maps.length > 0) {
				map = maps.shift()
				
				if (this.buildRecipes("Item", map.quality)){
					roll = true;
					Config.Recipes.push([Recipe.Map, map.classid, this.buildRecipes("Rune"),
					this.buildRecipes("Item", map.quality), this.buildRecipes("Orb", map.quality)]);
					print("ÿc2Upgrading " + map.name);

				}
			} 
		} else {
			print("ÿc8No maps found to upgrade");
			return false;
		}
							
		if(roll){
			Cubing.buildRecipes();
			Cubing.update();
			Town.doChores();
			delay(200 + me.ping);
			this.start();
		}
		
		return false;
	};		
		
	this.shopAnya = function (orb){
		var anya,
			gold = me.getStat(14) + me.getStat(15);
		
		Town.goToTown(5);
		Town.move(NPC.Anya);
		anya = getUnit(1, NPC.Anya);
		anya.startTrade();
		orb = anya.getItem(orb, 0);
		
		if (gold < orb.getItemCost(0)){
			print("ÿc8Not enough gold for " + orb.name);
			return false;
		}
		
		if (orb.buy()) {
			return orb.classid;
		};
		
		return -1;
	};
	
	this.buildRecipes = function(type, mapquality){
		var items = me.findItems(-1, 0);
			
		
		switch(type){
			case "Rune":
				var lowrunes = [];
				for(var i = 692; i < 698; i++){ //Use runes from THUL to HEL for map upgrades
					lowrunes.push(i);
				}
				
				for (var i = 0; i < lowrunes.length; i++){
					if (me.getItem(lowrunes[i])){
						return me.getItem(lowrunes[i]).classid;
					}
				}
				print("ÿc8Couldn't find any low runes to use");
				return false;
				
			break;
			case "Item":
				switch(mapquality){
					case 2:
						for (var i = 0; i < items.length; i++){
							if (items[i].itemType == 58 && NTIP.CheckItem(items[i]) == 0){
								return items[i].classid;
							}
						}
						print("ÿc8No junk jewels to upgrade ÿc0normal map");	
						return false;
						
					break;
					case 4:
						if (me.getItem(682)){
							return 682
						}
						print("ÿc8No Perfect Skulls upgrade ÿc3magic map");					
						return false;
						
					break;					
					case 6:
						for (var i = 0; i < items.length; i++){
							if (items[i].itemType == 162){
								return items[i].classid;
							}
						}
						print("ÿc8No Perfect Gems to reroll ÿc9rare map");			
						return false;
						
					break;
				}
				
			break;
			case "Orb":
				switch(mapquality){
					case 2:
						if (!me.getItem(662)){
							return this.shopAnya(662);
						} else {
							return 662;
						}
					break;
					case 4:
						if (!me.getItem(665)){
							return this.shopAnya(665);
						} else {
							return 665;
						}					
					
					break;
					case 6:
						if (!me.getItem(663)){
							return this.shopAnya(663);
						} else {
							return 663;
						}						
					break;		
				}
			break;
		}
		
		return false;				
	};
	
	this.killBoss = function () { 
		var boss, bossPreset;
		
		bossPreset = [746, 750, 755, 800, 809, 826, 861, 870, 879, 882, 883, 884];
		boss = bossPreset.find( unit => getPresetUnit(me.area, 1, unit));
		
		Pather.moveToPreset(me.area, 1, boss, 0, 0, true, false);
		Attack.clear(30, 0, boss);
		
		return true;
	};	
	
	this.mapRooms = function () {
		var room, mapRooms = [];
		
		/*if (me.area == 149){ // Because Bastion wants to act funny
			Pather.moveTo(15135, 23648);
		  }*/

		room = getRoom(me.x, me.y);
		
		do {
			mapRooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);		
		} while (room.getNext());

		return mapRooms;
	};
	
	this.clearMap = function () { 
		
		var room, result, myRoom, bossPreset,
			rooms = this.mapRooms();
		
		function RoomSort(a, b) {
			return getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]);
		}

		while (rooms.length > 0) {
			// get the first room + initialize myRoom var
			if (!myRoom) {
				room = getRoom(me.x, me.y);
			}

			if (room) {
				if (room instanceof Array) { // use previous room to calculate distance
					myRoom = [room[0], room[1]];
				} else { // create a new room to calculate distance (first room, done only once)
					myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
				}
			}

			rooms.sort(RoomSort);
			room = rooms.shift();

			result = Pather.getNearestWalkable(room[0], room[1], 10, 2);

			if (result) {
				Pather.moveTo(result[0], result[1], 3);

				if (!Attack.clear(30)) {
					return false;
				}
			}
		}

		return true;
	}; 
	
	this.checkMap = function(map){
		
		 const MonsterTypes = { "Dolls":      437,
								"Succubus":   438,
								"Vampires":   439,
								"Cows":       440,
								"Reanimated": 441,
								"Ghosts":     442  },
								
			 MonsterAbsorbs = { "Cold":		  396,
								"Magic":	  397,
								"Lightning":  398,
								"Fire":		  399  };
								

		for(var config in Config.Mapper){
			switch(config){
 				case "Maps":
					var mapids = [];
					for(var i = 0; i < Config.Mapper[config].length; i++){
						mapids.push(NTIPAliasClassID[Config.Mapper[config][i]]);
					}
					if (mapids.indexOf(map.classid) < 0){
						return false;
					}
					
					break;
				case "Quality":
					if (Config.Mapper[config] == 2 || Config.Mapper[config] == 4) {
						return true; // Don't continue stat check for normal / magic maps, just farm them.
					} else if (map.quality != Config.Mapper[config]){
						return false;
					}
				break;
				case "MagicFind":
					if (map.getStat(370) < Config.Mapper[config]){
						return false;
					}
					
					break;
				case "GoldFind":
					if (map.getStat(371) < Config.Mapper[config]){
						return false;
					}

					break;		
				case "Density":
					if (map.getStat(372) < Config.Mapper[config]){
						return false;
					}
					
					break;
				case "Experience":
					if (map.getStat(373) < Config.Mapper[config]){
						return false;
					}
					
					break;
				case "Rarity":
					if (map.getStat(375) < Config.Mapper[config]){
						return false;
					}
					
					break;
				case "MapContains":
					var currentStat = Config.Mapper[config];
					for (var i = 0; i < currentStat.length; i++){
						if (MonsterTypes[currentStat[i]]){
							if (!map.getStat(MonsterTypes[currentStat[i]])) {
								return false;
							}
						}
					}
					
					break;
				case "SkipMonsters":
					var currentStat = Config.Mapper[config];
					for (var i = 0; i < currentStat.length; i++){
						if (MonsterTypes[currentStat[i]]){
							if (map.getStat(MonsterTypes[currentStat[i]])) {
								return false;
							}
						}
					}
				case "SorbSkip":
					var currentStat = Config.Mapper[config];
					for (var i = 0; i < currentStat.length; i++){
						if (MonsterAbsorbs[currentStat[i]]){
							if (map.getStat(MonsterAbsorbs[currentStat[i]])) {
								return false;
							}
						}							
					}	 	
			}
		}
		
		return true;
	};
	
	this.openMap = function (map) {
		
		print("Opening " + map.name);
		
		Town.goToTown(5);
		Town.openStash();
		if (map.location == 7){
			Storage.Inventory.MoveTo(map);
		}
		Pather.moveTo(5098, 5020);
		clickItem(1, map);
		delay(200 + me.ping);
		this.enterPortal();
		
		return true;
	};
	
	this.enterPortal = function(){
		var portal;
	
		for (var i = 137; i <= 155; i++) {
			if (Pather.getPortal(i)){
				portal = i;
			} 
		}
		
		if (!Pather.usePortal(portal)){
			throw new Error("Failed to use portal!");
			return false;
		};
		
		this.killBoss();
		return true;
	};

	// start
	Town.doChores();
	this.start();
	print("Ending Map Script.");
	return true;
}