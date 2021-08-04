/**
*	@filename	Precast.js
*	@author		noah-, kolton
*	@desc		handle player prebuff sequence
*/

var Precast = new function () {
	this.haveCTA = -1;
	this.BODuration = 0;
	this.BOTick = 0;
	this.bestSlot = {};

	this.precastCTA = function (force) {
		if (!force && me.getState(32)) {
			return true;
		}

		if (me.gametype === 0 || me.classid === 4 || me.inTown) {
			return false;
		}

		if (this.checkCTA()) {
			var slot = me.weaponswitch;

			Attack.weaponSwitch(this.haveCTA);
			Skill.cast(155, 0); // Battle Command
			Skill.cast(149, 0); // Battle Orders

			this.BODuration = (20 + me.getSkill(149, 1) * 10 + (me.getSkill(138, 0) + me.getSkill(155, 0)) * 5) * 1000;
			this.BOTick = getTickCount();

			Attack.weaponSwitch(slot);

			return true;
		}

		return false;
	};

	this.getBetterSlot = function (skillId) {
		if (this.bestSlot[skillId] !== undefined) {
			return this.bestSlot[skillId];
		}

		var item, classid, skillTab,
			sumCurr = 0,
			sumSwap = 0;

		switch (skillId) {
			//case 40: // Frozen Armor // PD2
			case 50: // Shiver Armor
			case 60: // Chilling Armor
				classid = 1;
				skillTab = 10;

				break;
			case 52: // Enchant
				classid = 1;
				skillTab = 8;

				break;
			case 57: // Thunder Storm
			case 58: // Energy Shield
				classid = 1;
				skillTab = 9;

				break;
			case 68: // Bone Armor
				classid = 2;
				skillTab = 17;

				break;
			case 117: // Holy Shield
				classid = 3;
				skillTab = 24;

				break;
			case 138: // Shout
			case 149: // Battle Orders
			case 155: // Battle Command
				classid = 4;
				skillTab = 34;

				break;
			case 235: // Cyclone Armor
				classid = 5;
				skillTab = 42;

				break;
			case 258: // Burst of Speed
			case 267: // Fade
				classid = 6;
				skillTab = 49;

				break;
			case 277: // Blade Shield
				classid = 6;
				skillTab = 48;

				break;
			default:
				return me.weaponswitch;
		}

		item = me.getItem();

		if (item) {
			do {
				if (item.bodylocation === 4 || item.bodylocation === 5) {
					sumCurr += (item.getStat(127) + item.getStat(83, classid) + item.getStat(188, skillTab) + item.getStat(107, skillId) + item.getStat(97, skillId));
				}

				if (item.bodylocation === 11 || item.bodylocation === 12) {
					sumSwap += (item.getStat(127) + item.getStat(83, classid) + item.getStat(188, skillTab) + item.getStat(107, skillId) + item.getStat(97, skillId));
				}
			} while (item.getNext());
		}

		this.bestSlot[skillId] = (sumSwap > sumCurr) ? me.weaponswitch ^ 1 : me.weaponswitch;
		return this.bestSlot[skillId];
	};

	this.precastSkill = function (skillId) {
		var swap = me.weaponswitch;

		Attack.weaponSwitch(this.getBetterSlot(skillId));
		Skill.cast(skillId, 0);
		Attack.weaponSwitch(swap);

		return true;
	};

	this.doPrecast = function (force) {
		var buffSummons = false;

		// Force BO 30 seconds before it expires
		this.precastCTA(!me.getState(32) || force || (getTickCount() - this.BOTick >= this.BODuration - 30000));

		switch (me.classid) {
			case 0: // Amazon
				if (Config.SummonValkyrie) {
					this.summon(32); // Valkyrie
				}

				break;
			case 1: // Sorceress
				if (me.getSkill(57, 0) && (!me.getState(38) || force)) {
					this.precastSkill(57); // Thunder Storm
				}

				if (me.getSkill(58, 0) && (!me.getState(30) || force)) {
					this.precastSkill(58); // Energy Shield
				}

				if (me.getSkill(50, 0)) {
					if (!me.getState(88) || force) {
						this.precastSkill(50); // Shiver Armor
					}
				} else if (me.getSkill(60, 0)) {
					if (!me.getState(20) || force) {
						this.precastSkill(60); // Chilling Armor

					}
				} else if (me.getSkill(50, 0)) {
					if (!me.getState(10) || force) {
						this.precastSkill(50); // Shiver Armor
					}
				}


				if (me.getSkill(52, 0) && (!me.getState(16) || force)) {
					this.enchant();
				}

				break;
			case 2: // Necromancer
				if (me.getSkill(68, 0) && (!me.getState(14) || force)) {
					this.precastSkill(68); // Bone Armor
				}
				if (me.getSkill(236, 1) && (!me.getState(148) || force)) {
					Skill.cast(236, 0); // Heart of Wolverine
				}
				switch (Config.Golem) {
					case 0:
					case "None":
						break;
					case 1:
					case "Clay":
						this.summon(75);
						break;
					case 2:
					case "Blood":
						this.summon(85);
						break;
					case 3:
					case "Fire":
						this.summon(94);
						break;
				}
				var i, corpse, corpseList, castTimes;
				for (castTimes = 0; castTimes < 4; castTimes += 1) { // Loop 4 times, to summon at least 16 skells + Revives
					if (me.getSkill(83, 0) || force) {
						var skill, maxSkeletons, maxMages, maxRevives;
						skill = me.getSkill(70, 1);
						maxSkeletons = skill < 4 ? skill : (Math.floor(skill / 3) + 2);
			　　        if (maxSkeletons > 8) {
						maxSkeletons = 8;
						}
						skill = me.getSkill(80, 1);
						maxMages = skill < 4 ? skill : (Math.floor(skill / 3) + 2);
			　　        if (maxMages > 8) {
						maxMages = 8;
						}
						
						// maxSkeletons = 10; // Leoric wand
						// maxMages = 10; // Leoric wand
						maxRevives = 3; // Need to set based on the skill
						if (me.getMinionCount(4) < maxSkeletons || me.getMinionCount(5) < maxMages) {
							this.precastSkill(83); // desecrate for raizeArmy()
							this.summon(75);

							var count = me.getMinionCount(4);
							var tick = getTickCount();

							while (getTickCount() - tick < 200) {
								if (me.getMinionCount(4) > count) {
									break;
								}

								delay(10);
							}
						}

						for (i = 0; i < 3; i += 1) {
							corpse = getUnit(1, -1, 12);
							corpseList = [];

							var	range = 25;
				
							if (corpse) {
								do {
									if (getDistance(me, corpse) <= range && this.checkCorpse(corpse)) { // within casting distance
										corpseList.push(copyUnit(corpse));
									}
								} while (corpse.getNext());
							}
				
							MainLoop:
							while (corpseList.length > 0) {
								corpse = corpseList.shift();
								if (me.getMinionCount(4) < maxSkeletons) {
				
									if (!Skill.cast(70, 0, corpse)) {
									//if (!this.precastSkill(70, 0, corpse)) {
										break;
									}
									me.overhead("!raize Skeletons : " + me.getMinionCount(4) + "/" + maxSkeletons);
				
									count = me.getMinionCount(4);
									tick = getTickCount();
				
									while (getTickCount() - tick < 200) {
										if (me.getMinionCount(4) > count) {
											break;
										}
				
										delay(10);
									}
								} else if (me.getMinionCount(5) < maxMages) {
									if (!Skill.cast(80, 0, corpse)) {
									//if (!this.precastSkill(80, 0, corpse)) {
										break;
									}
									me.overhead("!raize mage : " + me.getMinionCount(5) + "/" + maxMages);
				
									count = me.getMinionCount(5);
									tick = getTickCount();
				
									while (getTickCount() - tick < 200) {
										if (me.getMinionCount(5) > count) {
											break;
										}
				
										delay(10);
									}
								} else if (me.getMinionCount(6) < maxRevives) {
									if (this.checkCorpse(corpse, true)) {
										if (!Skill.cast(95, 0, corpse)) {
										//if (!this.precastSkill(95, 0, corpse)) {
											break;
										}
										me.overhead("!raize : (" + corpse.name + ") " + me.getMinionCount(6) + "/" + maxRevives);
				
										count = me.getMinionCount(6);
										tick = getTickCount();
				
										while (getTickCount() - tick < 200) {
											if (me.getMinionCount(6) > count) {
												break;
											}
				
											delay(10);
										}
									}
								} else {
									break;
								}
							}
						}

					}
				}

				break;
			case 3: // Paladin
				if (me.getSkill(117, 0) && (!me.getState(101) || force)) {
					this.precastSkill(117); // Holy Shield
				}

				break;
			case 4: // Barbarian - TODO: BO duration
				if (!me.getState(32) || !me.getState(51) || !me.getState(26) || force) {
					var swap = me.weaponswitch;

					Attack.weaponSwitch(this.getBetterSlot(149));

					if (!me.getState(51) || force) {
						Skill.cast(155, 0); // Battle Command
					}

					if (!me.getState(32) || force) {
						Skill.cast(149, 0); // Battle Orders
					}

					if (!me.getState(26) || force) {
						Skill.cast(138, 0); // Shout
					}

					Attack.weaponSwitch(swap);
				}

				break;
			case 5: // Druid
				if (me.getSkill(235, 0) && (!me.getState(151) || force)) {
					this.precastSkill(235); // Cyclone Armor
				}

				if (Config.SummonRaven) {
					this.summon(221); // Raven
				}

				switch (Config.SummonAnimal) {
					case 1:
					case "Spirit Wolf":
						buffSummons = this.summon(227) || buffSummons; // Summon Spirit Wolf

						break;
					case 2:
					case "Dire Wolf":
						buffSummons = this.summon(237) || buffSummons; // Summon Dire Wolf

						break;
					case 3:
					case "Grizzly":
						buffSummons = this.summon(247) || buffSummons; // Summon Grizzly

						break;
					case 4:
					case "All":
						buffSummons = this.summon(227) || buffSummons; // Summon Spirit Wolf
						buffSummons = this.summon(237) || buffSummons; // Summon Dire Wolf
						buffSummons = this.summon(247) || buffSummons; // Summon Grizzly

						break;
				}

				switch (Config.SummonVine) {
					case 1:
					case "Poison Creeper":
						buffSummons = this.summon(222) || buffSummons; // Poison Creeper

						break;
					case 2:
					case "Carrion Vine":
						buffSummons = this.summon(231) || buffSummons; // Carrion Vine

						break;
					case 3:
					case "Solar Creeper":
						buffSummons = this.summon(241) || buffSummons; // Solar Creeper

						break;
				}

				switch (Config.SummonSpirit) {
					case 1:
					case "Oak Sage":
						buffSummons = this.summon(226) || buffSummons; // Oak Sage

						break;
					case 2:
					case "Heart of Wolverine":
						buffSummons = this.summon(236) || buffSummons; // Heart of Wolverine

						break;
					case 3:
					case "Spirit of Barbs":
						buffSummons = this.summon(246) || buffSummons; // Spirit of Barbs

						break;
				}

				if (me.getSkill(250, 0) && (!me.getState(144) || force)) {
					Skill.cast(250, 0); // Hurricane
				}

				if (Config.SummonSpirit === 1 && me.getSkill(226, 1) && (!me.getState(149) || force)) {
					Skill.cast(226, 0); // Oak Sage
				}

				if (Config.SummonSpirit === 2 && me.getSkill(236, 1) && (!me.getState(148) || force)) {
					Skill.cast(236, 0); // Heart of Wolverine
				}

				if (Config.SummonSpirit === 3 && me.getSkill(246, 1) && (!me.getState(147) || force)) {
					Skill.cast(246, 0); // Spirit of Barbs
				}

				if (buffSummons) {
					this.precastCTA(force);
				}

				break;
			case 6: // Assassin
				if (me.getSkill(267, 0) && Config.UseFade && (!me.getState(159) || force)) {
					this.precastSkill(267); // Fade
				}

				if (me.getSkill(278, 0) && Config.UseVenom && (!me.getState(31) || force)) {
					Skill.cast(278, 0); // Venom
				}

				if (me.getSkill(277, 0) && (!me.getState(158) || force)) {
					this.precastSkill(277); // Blade Shield
				}

				if (me.getSkill(258, 0) && !Config.UseFade && Config.UseBoS && (!me.getState(157) || force)) {
					this.precastSkill(258); // Burst of Speed
				}

				switch (Config.SummonShadow) {
					case 1:
					case "Warrior":
						this.summon(268); // Shadow Warrior
						break;
					case 2:
					case "Master":
						this.summon(279); // Shadow Master
						break;
				}

				break;
		}

		Attack.weaponSwitch(Attack.getPrimarySlot());
	};

	this.checkCTA = function () {
		var item;

		if (this.haveCTA > -1) {
			return true;
		}

		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.getPrefix(20519)) { // Call to Arms
					switch (item.bodylocation) {
						case 4:
						case 5:
							this.haveCTA = me.weaponswitch;

							return true;
						case 11:
						case 12:
							this.haveCTA = me.weaponswitch ^ 1;

							return true;
					}
				}
			} while (item.getNext());
		}

		return false;
	};

	this.summon = function (skillId) {
		if (!me.getSkill(skillId, 1)) {
			return false;
		}

		var minion, rv,
			count = 1;

		switch (skillId) {
			case 32: // Valkyrie
				if (me.getSkill(32, 1) >= 20) {
					count = 2;
				}
				if (me.getSkill(32, 1) >= 30) {
					count = 3;
				}
				minion = 2;

				break;
			case 75: // Clay Golem
			case 85: // Blood Golem
			case 94: // Fire Golem
				if(Config.GolemCount){
					count = Config.GolemCount;
				}
				minion = 3;
				break;
			case 221: // Raven
				minion = 10;
				if (me.getSkill(221, 1) <= 10) {
					count = me.getSkill(221, 1) + 1;

				}
				if (me.getSkill(221, 1) > 10) {
					count = 12;
				}
				//me.overhead('Raven');


				break;
			case 226: // Oak Sage
			case 236: // Heart of Wolverine
			case 246: // Spirit of Barbs
				minion = 13;

				break;
			case 222: // Poison Creeper
			case 231: // Carrion Vine
			case 241: // Solar Creeper
				minion = 14;

				break;
			case 227: // Spirit Wolf
				minion = 11;
				count = Math.min(me.getSkill(227, 1), 5);

				break;
			case 237: // Dire Wolf
				minion = 12;
				count = Math.min(me.getSkill(237, 1), 3);

				break;
			case 247: // Grizzly
				minion = 15;

				break;
			case 268: // Shadow Warrior
			case 279: // Shadow Master
				minion = 16;

				break;
		}

		var minion_i = 1;
		while (me.getMinionCount(minion) < count) {
			rv = true;
			//me.overhead("call summon (" + minion + "):" + me.getMinionCount(minion) + "/" + count + "->" + minion_i);
			Skill.cast(skillId, 0);
			Pather.moveTo(me.x + Math.random(10) + 10, me.y + Math.random(10) + 10);
			minion_i++;
			if (minion_i > 10) {
				break;
			}
			delay(200);
		}

		return !!rv;
	};

	this.enchant = function () {
		var unit, slot = me.weaponswitch, chanted = [];

		Attack.weaponSwitch(this.getBetterSlot(52));

		// Player
		unit = getUnit(0);

		if (unit) {
			do {
				if (!unit.dead && Misc.inMyParty(unit.name) && getDistance(me, unit) <= 40) {
					Skill.cast(52, 0, unit);
					chanted.push(unit.name);
				}
			} while (unit.getNext());
		}

		// Minion
		unit = getUnit(1);

		if (unit) {
			do {
				if (unit.getParent() && chanted.indexOf(unit.getParent().name) > -1 && getDistance(me, unit) <= 40) {
					Skill.cast(52, 0, unit);
				}
			} while (unit.getNext());
		}

		Attack.weaponSwitch(slot);

		return true;
	};
	this.checkCorpseNearMonster = function (monster, range) {
		var corpse = getUnit(1, -1, 12);

		if (range === undefined) { // Assume CorpseExplosion if no range specified
			range = Math.floor((me.getSkill(Config.ExplodeCorpses, 1) + 7) / 3);
		}

		if (corpse) {
			do {
				if (getDistance(corpse, monster) <= range) {
					return true;
				}
			} while (corpse.getNext());
		}

		return false;
	},

	this.checkCorpse = function (unit, revive) {
		if (unit.mode !== 12) {
			return false;
		}

		if (revive === undefined) {
			revive = false;
		}

		var baseId = getBaseStat("monstats", unit.classid, "baseid"),
			badList = [312, 571];

		if (revive && ((unit.spectype & 0x7) || badList.indexOf(baseId) > -1 || (Config.ReviveUnstackable && getBaseStat("monstats2", baseId, "sizex") === 3))) {
			return false;
		}

		if (!getBaseStat("monstats2", baseId, revive ? "revive" : "corpseSel")) {
			return false;
		}

		if (getDistance(me, unit) <= 25 && !checkCollision(me, unit, 0x4) &&
				!unit.getState(1) && // freeze
				!unit.getState(96) && // revive
				!unit.getState(99) && // redeemed
				!unit.getState(104) && // nodraw
				!unit.getState(107) && // shatter
				!unit.getState(118) // noselect
				) {
			return true;
		}

		return false;
	}
};