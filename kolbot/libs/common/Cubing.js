/**
*	@filename	Cubing.js
*	@author		kolton
*	@desc		transmute Horadric Cube recipes
*/

var Roll = {
	All: 0,
	Eth: 1,
	NonEth: 2
};

var Recipe = {
	Gem: 0,
	HitPower: {
		Helm: 1,
		Boots: 2,
		Gloves: 3,
		Belt: 4,
		Shield: 5,
		Body: 6,
		Amulet: 7,
		Ring: 8,
		Weapon: 9
	},
	Blood: {
		Helm: 10,
		Boots: 11,
		Gloves: 12,
		Belt: 13,
		Shield: 14,
		Body: 15,
		Amulet: 16,
		Ring: 17,
		Weapon: 18
	},
	Caster: {
		Helm: 19,
		Boots: 20,
		Gloves: 21,
		Belt: 22,
		Shield: 23,
		Body: 24,
		Amulet: 25,
		Ring: 26,
		Weapon: 27
	},
	Safety: {
		Helm: 28,
		Boots: 29,
		Gloves: 30,
		Belt: 31,
		Shield: 32,
		Body: 33,
		Amulet: 34,
		Ring: 35,
		Weapon: 36
	},
	Unique: {
		Weapon: {
			ToExceptional: 37,
			ToElite: 38
		},
		Armor: {
			ToExceptional: 39,
			ToElite: 40
		}
	},
	Rare: {
		Weapon: {
			ToExceptional: 41,
			ToElite: 42
		},
		Armor: {
			ToExceptional: 43,
			ToElite: 44
		}
	},
	Socket: {
		Shield: 45,
		Weapon: 46,
		Armor: 47,
		Helm: 48
	},
	Reroll: {
		Magic: 49,
		Rare: 50,
		HighRare: 51
	},
	Rune: 52,
	Token: 53,
	LowToNorm: {
		Armor: 54,
		Weapon: 55
	},
	Map: 56
};

var Cubing = {
	recipes: [],
	gemList: [],

	init: function () {
		if (!Config.Cubing) {
			return;
		}

		//print("We have " + Config.Recipes.length + " cubing recipe(s).");

		var i;

		for (i = 0; i < Config.Recipes.length; i += 1) {
			if (Config.Recipes[i].length > 1 && isNaN(Config.Recipes[i][1])) {
				if (NTIPAliasClassID.hasOwnProperty(Config.Recipes[i][1].replace(/\s+/g, "").toLowerCase())) {
					Config.Recipes[i][1] = NTIPAliasClassID[Config.Recipes[i][1].replace(/\s+/g, "").toLowerCase()];
				} else {
					Misc.errorReport("ÿc1Invalid cubing entry:ÿc0 " + Config.Recipes[i][1]);
					Config.Recipes.splice(i, 1);

					i -= 1;
				}
			}
		}

		this.buildRecipes();
		this.buildGemList();
		this.buildLists();
	},

	buildGemList: function () {
		var i, j,
			gemList = [561, 566, 571, 576, 581, 586, 601, 676, 678, 680, 682, 684, 686, 688];

		for (i = 0; i < this.recipes.length; i += 1) {
			if ([0, 49].indexOf(this.recipes[i].Index) === -1) { // Skip gems and other magic rerolling recipes
				for (j = 0; j < this.recipes[i].Ingredients.length; j += 1) {
					if (gemList.indexOf(this.recipes[i].Ingredients[j]) > -1) {
						gemList.splice(gemList.indexOf(this.recipes[i].Ingredients[j]), 1);
					}
				}
			}
		}

		this.gemList = gemList.slice(0);

		return true;
	},

	getCube: function () {
		// Don't activate from townchicken
		if (getScript(true).name === "tools\\townchicken.js") {
			return false;
		}

		var i, cube, chest;

		Pather.useWaypoint(57, true);
		Precast.doPrecast(true);

		if (Pather.moveToExit(60, true) && Pather.moveToPreset(me.area, 2, 354)) {
			chest = getUnit(2, 354);

			if (chest) {
				Misc.openChest(chest);

				for (i = 0; i < 5; i += 1) {
					cube = getUnit(4, 549);

					if (cube) {
						Pickit.pickItem(cube);

						break;
					}

					delay(200);
				}
			}
		}

		Town.goToTown();

		cube = me.getItem(549);

		if (cube) {
			return Storage.Stash.MoveTo(cube);
		}

		return false;
	},

	buildRecipes: function () {
		var i;

		this.recipes = [];

		for (i = 0; i < Config.Recipes.length; i += 1) {
			if (typeof Config.Recipes[i] !== "object" || (Config.Recipes[i].length > 2 && typeof Config.Recipes[i][2] !== "number") || Config.Recipes[i].length < 1) {
				throw new Error("Cubing.buildRecipes: Invalid recipe format.");
			}

			switch (Config.Recipes[i][0]) {			
			case Recipe.Gem:
				switch (Config.Recipes[i][1]) {
				case 669: // flawless amethyst stack
				case 671: // flawless topaz stack
				case 673: // flawless sapphire stack
				case 675: // flawless emerald stack
				case 677: // flawless ruby stack
				case 679: // flawless diamond stack
				case 681: // flawless skull stack
					this.recipes.push({Ingredients: [Config.Recipes[i][1], 543], Index: Recipe.Gem, AlwaysEnabled: true});

					break;
				}

				break;
			case Recipe.HitPower.Helm:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 688, 643, 674], Index: Recipe.HitPower.Helm});

				break;
			case Recipe.HitPower.Boots:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 690, 643, 674], Index: Recipe.HitPower.Boots});

				break;
			case Recipe.HitPower.Gloves:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 691, 643, 674], Index: Recipe.HitPower.Gloves});

				break;
			case Recipe.HitPower.Belt:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 689, 643, 674], Index: Recipe.HitPower.Belt});

				break;
			case Recipe.HitPower.Shield:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 687, 643, 674], Index: Recipe.HitPower.Shield});

				break;
			case Recipe.HitPower.Body:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 686, 643, 674], Index: Recipe.HitPower.Body});

				break;
			case Recipe.HitPower.Amulet:
				this.recipes.push({Ingredients: [520, 692, 643, 674], Index: Recipe.HitPower.Amulet});

				break;
			case Recipe.HitPower.Ring:
				this.recipes.push({Ingredients: [522, 693, 643, 674], Index: Recipe.HitPower.Ring});

				break;
			case Recipe.HitPower.Weapon:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 685, 643, 674], Index: Recipe.HitPower.Weapon});

				break;
			case Recipe.Blood.Helm:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 690, 643, 678], Index: Recipe.Blood.Helm});

				break;
			case Recipe.Blood.Boots:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 687, 643, 678], Index: Recipe.Blood.Boots});

				break;
			case Recipe.Blood.Gloves:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 686, 643, 678], Index: Recipe.Blood.Gloves});

				break;
			case Recipe.Blood.Belt:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 689, 643, 678], Index: Recipe.Blood.Belt});

				break;
			case Recipe.Blood.Shield:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 688, 643, 678], Index: Recipe.Blood.Shield});

				break;
			case Recipe.Blood.Body:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 692, 643, 678], Index: Recipe.Blood.Body});

				break;
			case Recipe.Blood.Amulet:
				this.recipes.push({Ingredients: [520, 693, 643, 678], Index: Recipe.Blood.Amulet});

				break;
			case Recipe.Blood.Ring:
				this.recipes.push({Ingredients: [522, 694, 643, 678], Index: Recipe.Blood.Ring});

				break;
			case Recipe.Blood.Weapon:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 618, 691, 678], Index: Recipe.Blood.Weapon});

				break;
			case Recipe.Caster.Helm:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 686, 643, 670], Index: Recipe.Caster.Helm});

				break;
			case Recipe.Caster.Boots:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 692, 643, 670], Index: Recipe.Caster.Boots});

				break;
			case Recipe.Caster.Gloves:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 691, 643, 670], Index: Recipe.Caster.Gloves});

				break;
			case Recipe.Caster.Belt:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 688, 643, 670], Index: Recipe.Caster.Belt});

				break;
			case Recipe.Caster.Shield:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 687, 643, 670], Index: Recipe.Caster.Shield});

				break;
			case Recipe.Caster.Body:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 689, 643, 670], Index: Recipe.Caster.Body});

				break;
			case Recipe.Caster.Amulet:
				this.recipes.push({Ingredients: [520, 690, 643, 670], Index: Recipe.Caster.Amulet, AlwaysEnabled: true});

				break;
			case Recipe.Caster.Ring:
				this.recipes.push({Ingredients: [522, 693, 643, 670], Index: Recipe.Caster.Ring});

				break;
			case Recipe.Caster.Weapon:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 685, 643, 670], Index: Recipe.Caster.Weapon});

				break;
			case Recipe.Safety.Helm:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 688, 643, 676], Index: Recipe.Safety.Helm});

				break;
			case Recipe.Safety.Boots:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 691, 643, 676], Index: Recipe.Safety.Boots});

				break;
			case Recipe.Safety.Gloves:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 690, 643, 676], Index: Recipe.Safety.Gloves});

				break;
			case Recipe.Safety.Belt:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 689, 643, 676], Index: Recipe.Safety.Belt});

				break;
			case Recipe.Safety.Shield:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 686, 643, 676], Index: Recipe.Safety.Shield});

				break;
			case Recipe.Safety.Body:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 687, 643, 676], Index: Recipe.Safety.Body});

				break;
			case Recipe.Safety.Amulet:
				this.recipes.push({Ingredients: [520, 692, 643, 676], Index: Recipe.Safety.Amulet});

				break;
			case Recipe.Safety.Ring:
				this.recipes.push({Ingredients: [522, 693, 643, 676], Index: Recipe.Safety.Ring});

				break;
			case Recipe.Safety.Weapon:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 694, 643, 676], Index: Recipe.Safety.Weapon});

				break;
			case Recipe.Unique.Weapon.ToExceptional:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 617, 621, 676], Index: Recipe.Unique.Weapon.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Unique.Weapon.ToElite: // Ladder only
				if (me.ladder) {
					this.recipes.push({Ingredients: [Config.Recipes[i][1], 626, 630, 676], Index: Recipe.Unique.Weapon.ToElite, Ethereal: Config.Recipes[i][2]});
				}

				break;
			case Recipe.Unique.Armor.ToExceptional:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 616, 622, 586], Index: Recipe.Unique.Armor.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Unique.Armor.ToElite: // Ladder only
				if (me.ladder) {
					this.recipes.push({Ingredients: [Config.Recipes[i][1], 629, 627, 586], Index: Recipe.Unique.Armor.ToElite, Ethereal: Config.Recipes[i][2]});
				}

				break;
			case Recipe.Rare.Weapon.ToExceptional:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 618, 620, 571], Index: Recipe.Rare.Weapon.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Rare.Weapon.ToElite:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 628, 631, 571], Index: Recipe.Rare.Weapon.ToElite, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Rare.Armor.ToExceptional:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 617, 619, 561], Index: Recipe.Rare.Armor.ToExceptional, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Rare.Armor.ToElite:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 627, 630, 561], Index: Recipe.Rare.Armor.ToElite, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Shield:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 616, 620, 581], Index: Recipe.Socket.Shield, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Weapon:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 617, 620, 561], Index: Recipe.Socket.Weapon, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Armor:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 616, 619, 566], Index: Recipe.Socket.Armor, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Socket.Helm:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 617, 619, 571], Index: Recipe.Socket.Helm, Ethereal: Config.Recipes[i][2]});

				break;
			case Recipe.Reroll.Magic: // Hacky solution ftw
				this.recipes.push({Ingredients: [Config.Recipes[i][1], "pgem", "pgem", "pgem"], Level: 91, Index: Recipe.Reroll.Magic});

				break;
			case Recipe.Reroll.Rare:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 601, 601, 601, 601, 601, 601], Index: Recipe.Reroll.Rare});

				break;
			case Recipe.Reroll.HighRare:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 601, 522], Index: Recipe.Reroll.HighRare, Enabled: false});

				break;
			case Recipe.LowToNorm.Weapon:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 611, "cgem"], Index: Recipe.LowToNorm.Weapon});

				break;
			case Recipe.LowToNorm.Armor:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], 610, "cgem"], Index: Recipe.LowToNorm.Armor});

				break;
			case Recipe.Rune:
				switch (Config.Recipes[i][1]) {
				case 610: // el
				case 611: // eld
				case 612: // tir
				case 613: // nef
				case 614: // eth
				case 615: // ith
				case 616: // tal
				case 617: // ral
				case 618: // ort
				case 619: // thul
				case 620: // amn
				case 621: // sol
				case 622: // shael
					this.recipes.push({Ingredients: [Config.Recipes[i][1], Config.Recipes[i][1], Config.Recipes[i][1], 543], Index: Recipe.Rune, AlwaysEnabled: true});

					break;
				case 623: // dol->hel
				case 624: // hel->io
				case 625: // io->lum
				case 626: // lum->ko
				case 627: // ko->fal
				case 628: // fal->lem
				case 629: // lem->pul
					if (me.ladder) {
						this.recipes.push({Ingredients: [Config.Recipes[i][1], Config.Recipes[i][1], Config.Recipes[i][1], 543], Index: Recipe.Rune});
					}

					break;
				case 630: // pul->um
				case 631: // um->mal
				case 632: // mal->ist
				case 633: // ist->gul
				case 634: // gul->vex
				case 635: // vex->ohm
				case 636: // ohm->lo
				case 637: // lo->sur
				case 638: // sur->ber
				case 639: // ber->jah
				case 640: // jah->cham
				case 641: // cham->zod
					if (me.ladder) {
						this.recipes.push({Ingredients: [Config.Recipes[i][1], Config.Recipes[i][1], 543], Index: Recipe.Rune});
					}

					break;	
				//PD2 Low Rune Stacks (3 Runes + Key)
				case 683: //El > Eld
				case 684: //Eld > Tir
				case 685: //Tir > Nef
				case 686: //Nef > Eth
				case 687: //Eth > Ith
				case 688: //Ith > Tal
				case 689: //Tal > Ral
				case 690: //Ral > Ort
				case 691: //Ort > Thul
				case 692: //Thul > Amn
				case 693: //Amn > Sol
				case 694: //Sol > Shael
				case 695: //Shael > Dol
				case 696: //Dol > Hel
				case 697: //Hel > Io
				case 698: //Io > Lum
				case 699: //Lum > Ko
				case 700: //Ko > Fal
				case 701: //Fal > Lem
				case 702: //Lem > Pul
					this.recipes.push({Ingredients: [Config.Recipes[i][1], 543], Index: Recipe.Rune});
					break;
				//PD2 Mid/High Rune Stacks (2 Runes + Key)	
				case 703: //Pul > Um
				case 704: //Um > Mal
				case 705: //Mal > Ist
				case 706: //Ist > Gul
				case 707: //Gul > Vex
				case 708: //Vex > Ohm
				case 709: //Ohm > Lo
				case 710: //Lo > Sur
				case 711: //Sur > Ber
				case 712: //Ber > Jah
				case 713: //Jah > Cham
				case 714: //Cham > Zod
					this.recipes.push({Ingredients: [Config.Recipes[i][1], 543], Index: Recipe.Rune});
					break;
			}
			break;
			case Recipe.Token:
				this.recipes.push({Ingredients: [654, 655, 656, 657], Index: Recipe.Token, AlwaysEnabled: true});
				break;
			//Used by mapper script, will make standalone cubing script later. -yayza
			case Recipe.Map:
				this.recipes.push({Ingredients: [Config.Recipes[i][1], Config.Recipes[i][2], Config.Recipes[i][3], Config.Recipes[i][4]], Index: Recipe.Map});
				break;				
			}
		} 
	},

	validIngredients: [], // What we have
	neededIngredients: [], // What we need
	subRecipes: [],

	buildLists: function () {
		var i, j, k, items;

		CraftingSystem.checkSubrecipes();

		this.validIngredients = [];
		this.neededIngredients = [];
		items = me.findItems(-1, 0);
	
		for (i = 0; i < this.recipes.length; i += 1) {
			// Set default Enabled property - true if recipe is always enabled, false otherwise
			this.recipes[i].Enabled = this.recipes[i].hasOwnProperty("AlwaysEnabled");

IngredientLoop:
			for (j = 0; j < this.recipes[i].Ingredients.length; j += 1) { // Loop thru recipe's ingredients
				for (k = 0; k < items.length; k += 1) { // Loop thru items
					if (((this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(items[k].classid) > -1) ||
						(this.recipes[i].Ingredients[j] === "cgem" && [557, 562, 567, 572, 577, 582, 597].indexOf(items[k].classid) > -1) ||
						items[k].classid === this.recipes[i].Ingredients[j]) && this.validItem(items[k], this.recipes[i])) {

						// push the item's info into the valid ingredients array. this will be used to find items when checking recipes
						this.validIngredients.push({classid: items[k].classid, gid: items[k].gid});

						// Remove from item list to prevent counting the same item more than once
						items.splice(k, 1);

						k -= 1;

						// Enable recipes for gem/jewel pickup
						if (this.recipes[i].Index !== Recipe.Rune || (this.recipes[i].Index === Recipe.Rune && j >= 1)) { // Enable rune recipe after 2 bases are found
							this.recipes[i].Enabled = true;
						}

						continue IngredientLoop;
					}
				}

				// add the item to needed list - enable pickup
				this.neededIngredients.push({classid: this.recipes[i].Ingredients[j], recipe: this.recipes[i]});

				// skip flawless gems adding if we don't have the main item (Recipe.Gem and Recipe.Rune for el-ort are always enabled)
				if (!this.recipes[i].Enabled) {
					break;
				}

				// if the recipe is enabled (we have the main item), add flawless gem recipes (if needed)

							
				// Make perf amethyst
				if (this.subRecipes.indexOf(561) === -1 && (this.recipes[i].Ingredients[j] === 561 || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(561) > -1))) {
					this.recipes.push({Ingredients: [560, 560, 560], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
					this.subRecipes.push(561);
				}

				// Make perf topaz
				if (this.subRecipes.indexOf(566) === -1 && (this.recipes[i].Ingredients[j] === 566 || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(566) > -1))) {
					this.recipes.push({Ingredients: [565, 565, 565], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
					this.subRecipes.push(566);
				}

				// Make perf sapphire
				if (this.subRecipes.indexOf(571) === -1 && (this.recipes[i].Ingredients[j] === 571 || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(571) > -1))) {
					this.recipes.push({Ingredients: [570, 570, 570], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
					this.subRecipes.push(571);
				}

				// Make perf emerald
				if (this.subRecipes.indexOf(576) === -1 && (this.recipes[i].Ingredients[j] === 576 || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(576) > -1))) {
					this.recipes.push({Ingredients: [575, 575, 575], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
					this.subRecipes.push(576);
				}

				// Make perf ruby
				if (this.subRecipes.indexOf(581) === -1 && (this.recipes[i].Ingredients[j] === 581 || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(581) > -1))) {
					this.recipes.push({Ingredients: [580, 580, 580], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
					this.subRecipes.push(581);
				}

				// Make perf diamond
				if (this.subRecipes.indexOf(586) === -1 && (this.recipes[i].Ingredients[j] === 586 || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(586) > -1))) {
					this.recipes.push({Ingredients: [585, 585, 585], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
					this.subRecipes.push(586);
				}

				// Make perf skull
				if (this.subRecipes.indexOf(601) === -1 && (this.recipes[i].Ingredients[j] === 601 || (this.recipes[i].Ingredients[j] === "pgem" && this.gemList.indexOf(601) > -1))) {
					this.recipes.push({Ingredients: [600, 600, 600], Index: Recipe.Gem, AlwaysEnabled: true, MainRecipe: this.recipes[i].Index});
					this.subRecipes.push(601);
				}
			}
		}
	},

	// Remove unneeded flawless gem recipes
	clearSubRecipes: function () {
		var i;

		this.subRecipes = [];

		for (i = 0; i < this.recipes.length; i += 1) {
			if (this.recipes[i].hasOwnProperty("MainRecipe")) {
				this.recipes.splice(i, 1);

				i -= 1;
			}
		}
	},

	update: function () {
		this.clearSubRecipes();
		this.buildLists();

	},

	checkRecipe: function (recipe) {
		var i, j, item,
			usedGids = [],
			matchList = [];

		for (i = 0; i < recipe.Ingredients.length; i += 1) {
			for (j = 0; j < this.validIngredients.length; j += 1) {
				if (usedGids.indexOf(this.validIngredients[j].gid) === -1 && (
						this.validIngredients[j].classid === recipe.Ingredients[i] ||
						(recipe.Ingredients[i] === "pgem" && this.gemList.indexOf(this.validIngredients[j].classid) > -1) ||
						(recipe.Ingredients[i] === "cgem" && [557, 562, 567, 572, 577, 582, 597].indexOf(this.validIngredients[j].classid) > -1)
					)) {
					item = me.getItem(this.validIngredients[j].classid, -1, this.validIngredients[j].gid);

					if (item && this.validItem(item, recipe)) { // 26.11.2012. check if the item actually belongs to the given recipe
						// don't repeat the same item
						usedGids.push(this.validIngredients[j].gid);
						// push the item into the match list
						matchList.push(copyUnit(item));
						
						break;
					}
				}
			}

			// no new items in the match list = not enough ingredients
			if (matchList.length !== i + 1) {
				return false;
			}
		}

		// return the match list. these items go to cube
		
		return matchList;
	},

	// debug function - get what each recipe needs
	getRecipeNeeds: function (index) {
		var i,
			rval = " [";

		for (i = 0; i < this.neededIngredients.length; i += 1) {
			if (this.neededIngredients[i].recipe.Index === index) {
				rval += this.neededIngredients[i].classid + (i === this.neededIngredients.length - 1 ? "" : " ");
			}
		}

		rval += "]";

		return rval;
	},

	checkItem: function (unit) { // Check an item on ground for pickup
		if (!Config.Cubing) {
			return false;
		}

		if (this.keepItem(unit)) {
			return true;
		}

		var i;

		for (i = 0; i < this.neededIngredients.length; i += 1) {
			if (unit.classid === this.neededIngredients[i].classid && this.validItem(unit, this.neededIngredients[i].recipe)) {
				//debugLog("Cubing: " + unit.name + " " + this.neededIngredients[i].recipe.Index + " " + (this.neededIngredients[i].recipe.hasOwnProperty("MainRecipe") ? this.neededIngredients[i].recipe.MainRecipe : "") + this.getRecipeNeeds(this.neededIngredients[i].recipe.Index));

				return true;
			}
		}

		return false;
	},

	keepItem: function (unit) { // Don't drop an item from inventory if it's a part of cubing recipe
		if (!Config.Cubing) {
			return false;
		}
		
		if(Scripts.Mapper){ // Band-aid
			if (unit.itemType === 58 && NTIP.CheckItem(unit) === 0) {
				return true;
			}
		}

		var i;

		for (i = 0; i < this.validIngredients.length; i += 1) {
			if (unit.mode === 0 && unit.gid === this.validIngredients[i].gid) {
				return true;
			}
		}

		return false;
	},

	validItem: function (unit, recipe) {
		// Don't use items in locked inventory space
		if (unit.mode === 0 && unit.location === 3 && Storage.Inventory.IsLocked(unit, Config.Inventory)) {
			return false;
		}

		// Excluded items
		if (Runewords.validGids.indexOf(unit.gid) > -1 || CraftingSystem.validGids.indexOf(unit.gid) > -1) {
			return false;
		}

		// Gems and runes
		if ((unit.itemType >= 96 && unit.itemType <= 103) || unit.itemType === 74) {
			if (!recipe.Enabled && recipe.Ingredients [0] !== unit.classid && recipe.Ingredients[1] !== unit.classid) {
				return false;
			}

			return true;
		}

		
		// PD2 Flawless Gems Validation
		if ((unit.itemType >= 149 && unit.itemType <= 155) && unit.getStat(70) >= 3 || unit.itemType == 41) {
/* 			if (!recipe.Enabled && recipe.Ingredients [0] !== unit.classid && recipe.Ingredients[1] !== unit.classid) {
				return false;
			} */
			return true;
		}
		//PD2 Perfect Gem Validation
		if ((unit.itemType >= 156 && unit.itemType <= 162) && unit.getStat(70) >= 1 || unit.itemType == 41) {
/* 			if (!recipe.Enabled && recipe.Ingredients [0] !== unit.classid && recipe.Ingredients[1] !== unit.classid) {
				return false;
			} */
			return true;
		}
		

		
		// PD2 - Validate & Quantity Check Low Rune Stack
		if (unit.classid >= 683 && unit.classid <= 702) {
			if(!Config.MinRuneStack && unit.getStat(70) >= 3){
				return true;
			} else if (unit.getStat(70) >= Config.MinRuneStack + 3) {
				return true;
			}	
		}
		
		// PD2 - Validate & Quantity Check Mid/High Rune Stack
		if (unit.classid >= 703 && unit.classid <= 714) {
			if(!Config.MinRuneStack && unit.getStat(70) >= 2){
				return true;
			} else if (unit.getStat(70) >= Config.MinRuneStack + 2) {
				return true;
			}	
		}
		


		if (recipe.Index >= Recipe.HitPower.Helm && recipe.Index <= Recipe.Safety.Weapon) {
			// Junk jewels (NOT matching a pickit entry)
			if (unit.itemType === 58) {
				if (recipe.Enabled && NTIP.CheckItem(unit) === 0) {
					return true;
				}
			// Main item, NOT matching a pickit entry
			} else if (unit.quality === 4 && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false; 
		}

		if (recipe.Index >= Recipe.Unique.Weapon.ToExceptional && recipe.Index <= Recipe.Unique.Armor.ToElite) {
			// Unique item matching pickit entry
			if (unit.quality === 7 && NTIP.CheckItem(unit) === 1) {
				switch (recipe.Ethereal) {
				case 0:
				case undefined:
					return NTIP.CheckItem(unit) === 1;
				case 1:
					return unit.getFlag(0x400000) && NTIP.CheckItem(unit) === 1;
				case 2:
					return !unit.getFlag(0x400000) && NTIP.CheckItem(unit) === 1;
				}
			}

			return false;
		}

		if (recipe.Index >= Recipe.Rare.Weapon.ToExceptional && recipe.Index <= Recipe.Rare.Armor.ToElite) {
			// Rare item matching pickit entry
			if (unit.quality === 6 && NTIP.CheckItem(unit) === 1) {
				switch (recipe.Ethereal) {
				case 0:
				case undefined:
					return NTIP.CheckItem(unit) === 1;
				case 1:
					return unit.getFlag(0x400000) && NTIP.CheckItem(unit) === 1;
				case 2:
					return !unit.getFlag(0x400000) && NTIP.CheckItem(unit) === 1;
				}
			}

			return false;
		}

		if (recipe.Index >= Recipe.Socket.Shield && recipe.Index <= Recipe.Socket.Helm) {
			// Normal item matching pickit entry, no sorcets
			if (unit.quality === 2 && unit.getStat(194) === 0) {
				switch (recipe.Ethereal) {
				case 0:
				case undefined:
					return NTIP.CheckItem(unit) === 1;
				case 1:
					return unit.getFlag(0x400000) && NTIP.CheckItem(unit) === 1;
				case 2:
					return !unit.getFlag(0x400000) && NTIP.CheckItem(unit) === 1;
				}
			}

			return false;
		}

		if (recipe.Index === Recipe.Reroll.Magic) {
			if (unit.quality === 4 && unit.ilvl >= recipe.Level && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false;
		}

		if (recipe.Index === Recipe.Reroll.Rare) {
			if (unit.quality === 6 && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false;
		}

		if (recipe.Index === Recipe.Reroll.HighRare) {
			if (recipe.Ingredients[0] === unit.classid && unit.quality === 6 && NTIP.CheckItem(unit) === 0) {
				recipe.Enabled = true;

				return true;
			}

			if (recipe.Enabled && recipe.Ingredients[2] === unit.classid && unit.itemType === 10 && unit.getStat(77) && !Storage.Inventory.IsLocked(unit, Config.Inventory)) {
				return true;
			}

			return false;
		}

		if (recipe.Index === Recipe.LowToNorm.Armor || recipe.Index === Recipe.LowToNorm.Weapon) {
			if (unit.quality === 1 && NTIP.CheckItem(unit) === 0) {
				return true;
			}

			return false;
		}

		if (recipe.Index === Recipe.Token) {
			return true;
		}
		
		if (recipe.Index === Recipe.Map) {
			return true;
		}

		return false;
	},

	doCubing: function () {
		if (!Config.Cubing) {
			return false;
		}

		if (!me.getItem(549) && !this.getCube()) { // Check if char has cube
			return false;
		}

		var i, j, items, string, result, tempArray;

		this.update();
		// Randomize the recipe array to prevent recipe blocking (multiple caster items etc.)
		tempArray = this.recipes.slice().shuffle();
		
		for (i = 0; i < tempArray.length; i += 1) {
			string = "Transmuting: ";
			items = this.checkRecipe(tempArray[i]);

			if (items) {
				// If cube isn't open, attempt to open stash (the function returns true if stash is already open)
				if ((!getUIFlag(0x1a) && !Town.openStash()) || !this.emptyCube()) {
					return false;
				}

				this.cursorCheck();

				i = -1;

				while (items.length) {
					string += (items[0].name.trim() + (items.length > 1 ? " + " : ""));
					Storage.Cube.MoveTo(items[0]);
					items.shift();
				}

				if (!this.openCube()) {
					return false;
				}

				transmute();
				delay(700 + me.ping);
				print("ÿc4Cubing: " + string);

				if (Config.ShowCubingInfo) {
					D2Bot.printToConsole(string, 5);
				}

				this.update();

				items = me.findItems(-1, -1, 6);

				if (items) {
					for (j = 0; j < items.length; j += 1) {
						
						if(this.validIngredients.indexOf(items[j].classid)){
							Storage.Inventory.MoveTo(items[j]);
						} else {
							result = Pickit.checkItem(items[j]);
							
							switch (result.result) {
							case 0:
							if(!items[j].classid == 549){
								Misc.itemLogger("Dropped", items[j], "doCubing");
								items[j].drop();
							}

								break;
							case 1:
								Misc.itemLogger("Cubing Kept", items[j]);
								Misc.logItem("Cubing Kept", items[j], result.line);

								break;
							case 5: // Crafting System
								CraftingSystem.update(items[j]);

								break;
							} 
						}
					}
				}

				if (!this.emptyCube()) {
					break;
				}
			}
		}

		if (getUIFlag(0x1A) || getUIFlag(0x19)) {
			delay(1000);

			while (getUIFlag(0x1A) || getUIFlag(0x19)) {
				me.cancel();
				delay(300);
			}
		}

		return true;
	},

	cursorCheck: function () {
		var item;

		if (me.itemoncursor) {
			item = getUnit(100);

			if (item) {
				if (Storage.Inventory.CanFit(item) && Storage.Inventory.MoveTo(item)) {
					return true;
				}

				if (Storage.Stash.CanFit(item) && Storage.Stash.MoveTo(item)) {
					return true;
				}

				Misc.itemLogger("Dropped", item, "cursorCheck");

				if (item.drop()) {
					return true;
				}
			}

			return false;
		}

		return true;
	},

	openCube: function () {
		var i, tick,
			cube = me.getItem(549);

		if (!cube) {
			return false;
		}

		if (getUIFlag(0x1a)) {
			return true;
		}

		if (cube.location === 7 && !Town.openStash()) {
			return false;
		}

		for (i = 0; i < 3; i += 1) {
			cube.interact();
			tick = getTickCount();

			while (getTickCount() - tick < 5000) {
				if (getUIFlag(0x1a)) {
					delay(100 + me.ping * 2); // allow UI to initialize

					return true;
				}

				delay(100);
			}
		}

		return false;
	},

	closeCube: function () {
		var i, tick;

		if (!getUIFlag(0x1a)) {
			return true;
		}

		for (i = 0; i < 5; i++) {
			me.cancel();
			tick = getTickCount();

			while (getTickCount() - tick < 3000) {
				if (!getUIFlag(0x1a)) {
					delay(250 + me.ping * 2); // allow UI to initialize
					return true;
				}

				delay(100);
			}
		}

		return false;
	},

	emptyCube: function () {
		var cube = me.getItem(549),
			items = me.findItems(-1, -1, 6);

		if (!cube) {
			return false;
		}

		if (!items) {
			return true;
		}

		while (items.length) {
			if (!Storage.Stash.MoveTo(items[0]) && !Storage.Inventory.MoveTo(items[0])) {
				return false;
			}

			items.shift();
		}

		return true;
	},

	makeRevPots: function () {
		let locations = {
				Belt: 2,
				Inventory: 3,
				Cube: 6,
				Stash: 7,
			},
			origin = [], cube = me.getItem(549/* the cube it self*/), cubeInStash;

		// Get a list of all items
		let revpots = me.getItems()
			.filter(item => item.classid === 515); // Filter out all those rev pots

		// Stop if less as 3 pots
		if (revpots.length < 3) {
			return;
		}

		// Go to town and open stash
		Town.goToTown() && Town.moveToSpot('stash');
		Town.openStash();

		// For reasons unclear, cubing goes wrong in stash in my test, so for ease, i put cube in inventory
		(cubeInStash = cube.location !== locations.Inventory) && Storage.Inventory.MoveTo(cube);
		me.cancel();
		me.cancel();

		// clear the cube, otherwise we cant transmute
		Cubing.emptyCube();

		// Remove excessive pots from the list. (only groups of 3)
		revpots.length -= revpots.length % 3;

		// Call this function for each pot
		revpots.forEach(function (pot, index) {

			// Add this to the original location array
			origin.push({location: pot.location, x: pot.x, y: pot.y});

			Town.openStash();

			// Move to inventory first (to avoid bugs)
			Storage.Inventory.MoveTo(pot);
			me.cancel(); // remove inventory/cube window
			me.cancel(); // remove inventory window (if it was cube)

			// Move the current pot to the cube
			Storage.Cube.MoveTo(pot);
			// For every third pot, excluding the first
			if (!index || (1 + index) % 3 !== 0) {
				me.cancel(); // remove cube window
				me.cancel(); // remove stash window
			} else {
				// press the transmute button
				Cubing.openCube() && transmute();

				// high delay here to avoid issues with ping spikes
				delay(me.ping * 5 + 1000); // <-- probably can be less

				// Find all items in the cube. (the full rev pot)
				let fullrev = me.findItem(-1, -1, 6);

				// Sort the original locations of the pots. Put a low location first (belt = 2, rest is higher).
				origin.sort((a, b) => a.location - b.location).some(function (orgin) { // Loop over all the original spots.

					// Loop trough all possible locations
					for (let i in locations) {
						// If location is matched with its orgin, we know the name of the spot
						locations[i] === orgin.location && (orgin.location = i); // Store the name of the location
					}

					Storage.Inventory.MoveTo(fullrev); // First put to inventory;
					me.cancel(); // cube
					me.cancel(); // inventory

					// If the storage location is known, put the pot to this location
					Storage[orgin.location] && Storage[orgin.location].moveTo(fullrev);

					// If returned true, the prototype some stops looping.
					return fullrev.location !== locations.Cube;
				});

				// empty the array
				origin.length = 0;

				// Cube should be empty, but lets be sure
				Cubing.emptyCube();
			}
		});
		// Put cube back in stash, if it was when we started
		cubeInStash && Storage.Stash.MoveTo(cube);

		me.cancel();
		me.cancel();
	},
};