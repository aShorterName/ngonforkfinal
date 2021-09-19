    const tech = {
        totalCount: null,
        setupAllTech() {
            for (let i = 0, len = tech.tech.length; i < len; i++) {
                tech.tech[i].count = 0
                tech.tech[i].isLost = false
                tech.tech[i].remove();
                if (tech.tech[i].isJunk) {
                    tech.tech[i].frequency = 0
                } else if (tech.tech[i].frequencyDefault) {
                    tech.tech[i].frequency = tech.tech[i].frequencyDefault
                } else {
                    tech.tech[i].frequency = 2
                }
            }
            lore.techCount = 0;
            if (simulation.isCheating) { //simulation.isCommunityMaps ||
                for (let i = 0, len = tech.tech.length; i < len; i++) {
                    if (tech.tech[i].isLore) {
                        tech.tech[i].frequency = 0;
                        tech.tech[i].count = 0;
                    }
                }
            }
            // tech.removeJunkTechFromPool();
            // tech.removeLoreTechFromPool();
            // tech.addLoreTechToPool();
            tech.extraMaxHealth = 0;
            tech.totalCount = 0;
            simulation.updateTechHUD();
        },
        removeTech(index) {
            if (isNaN(index)) { //find index by name
                let found = false;
                for (let i = 0; i < tech.tech.length; i++) {
                    if (index === tech.tech[i].name) {
                        index = i;
                        found = true;
                        break;
                    }
                }
                if (!found) return //if name not found don't remove any tech
            }
            tech.tech[index].remove();
            tech.tech[index].count = 0;
            simulation.updateTechHUD();
        },
        // onclick="tech.removeTechPaused(${i}, this)"  //add this to tech elements in pause menu
        // removeTechPaused(index, who) {
        //     tech.tech[index].remove();
        //     tech.tech[index].count = 0;
        //     simulation.updateTechHUD();
        //     who.innerHTML = "removed"
        //     // who.style.display = "none"
        // },
        // removeLoreTechFromPool() {
        //     for (let i = tech.tech.length - 1; i > 0; i--) {
        //         if (tech.tech[i].isLore && tech.tech[i].count === 0) tech.tech.splice(i, 1)
        //     }
        // },
        addJunkTechToPool(num = 1) {
            let options = [];
            for (let i = 0; i < tech.tech.length; i++) {
                if (tech.tech[i].count < tech.tech[i].maxCount && tech.tech[i].isJunk) options.push(i);
            }
            if (options.length) {
                for (let i = 0; i < num; i++) tech.tech[options[Math.floor(Math.random() * options.length)]].frequency++
            }
            simulation.makeTextLog(`<span class='color-var'>tech</span>.tech.push(${num} <span class='color-text'>JUNK</span>)`)
        },
        removeJunkTechFromPool(num = 1) {
            for (let j = 0; j < num; j++) {
                for (let i = 0; i < tech.tech.length; i++) {
                    if (tech.tech[i].isJunk && tech.tech[i].frequency > 0 && tech.tech[i].count < tech.tech[i].maxCount) {
                        tech.tech[i].frequency--
                        break
                    }
                }
            }
        },
        giveTech(index = 'random') {
            if (index === 'random') {
                let options = [];
                for (let i = 0; i < tech.tech.length; i++) {
                    if (tech.tech[i].count < tech.tech[i].maxCount && tech.tech[i].allowed() && !tech.tech[i].isJunk && !tech.tech[i].isLore && !tech.tech[i].isBadRandomOption) options.push(i);
                }
                // give a random tech from the tech I don't have
                if (options.length > 0) {
                    let newTech = options[Math.floor(Math.random() * options.length)]
                    tech.giveTech(newTech)
                    simulation.makeTextLog(`<span class='color-var'>tech</span>.giveTech("<span class='color-text'>${tech.tech[newTech].name}</span>")<em> //random tech</em>`);
                }
            } else {
                if (isNaN(index)) { //find index by name
                    let found = false;
                    for (let i = 0; i < tech.tech.length; i++) {
                        if (index === tech.tech[i].name) {
                            index = i;
                            found = true;
                            break;
                        }
                    }
                    if (!found) return //if name not found don't give any tech
                }
                if (tech.isMetaAnalysis && tech.tech[index].isJunk) {
                    simulation.makeTextLog(`//tech: meta-analysis replaced junk tech with random tech`);
                    tech.giveTech('random')
                    for (let i = 0; i < 3; i++) powerUps.spawn(m.pos.x + 40 * Math.random(), m.pos.y + 40 * Math.random(), "research");
                    return
                }

                if (tech.tech[index].isLost) tech.tech[index].isLost = false; //give specific tech
                tech.tech[index].effect(); //give specific tech
                tech.tech[index].count++
                tech.totalCount++ //used in power up randomization
                simulation.updateTechHUD();
            }
        },
        setTechoNonRefundable(name) {
            for (let i = 0; i < tech.tech.length; i++) {
                if (tech.tech.name === name) {
                    tech.tech[i].isNonRefundable = true;
                    return
                }
            }
        },
        setCheating() {
            if (!simulation.isCheating) {
                simulation.isCheating = true;
                level.levelAnnounce();
                lore.techCount = 0;
                for (let i = 0, len = tech.tech.length; i < len; i++) {
                    if (tech.tech[i].isLore) {
                        tech.tech[i].frequency = 0;
                        tech.tech[i].count = 0;
                    }
                }
                console.log('cheating')
                sound.tone(250)
                sound.tone(300)
                sound.tone(375)
            }
        },
        haveGunCheck(name) {
            // if (
            //     !build.isExperimentSelection &&
            //     b.inventory.length > 2 &&
            //     name !== b.guns[b.activeGun].name &&
            //     Math.random() > 2 - b.inventory.length * 0.5
            // ) {
            //     return false
            // }
            // for (i = 0, len = b.inventory.length; i < len; i++) {
            //     if (b.guns[b.inventory[i]].name === name) return true
            // }
            // return false
            if (build.isExperimentSelection) {
                for (i = 0, len = b.inventory.length; i < len; i++) {
                    if (b.guns[b.inventory[i]].name === name) return true
                }
                return false
            } else {
                return b.inventory.length > 0 && b.guns[b.activeGun].name === name
            }
        },
        hasExplosiveDamageCheck() {
            return tech.haveGunCheck("missiles") || tech.isMissileField || tech.missileBotCount > 0 || tech.boomBotCount > 1 || tech.isIncendiary || tech.isPulseLaser || tech.isTokamak || (tech.haveGunCheck("grenades") && !tech.isNeutronBomb)
        },
        damageFromTech() {
            let dmg = 1 //m.fieldDamage
            if (tech.isCloakingDamage) dmg *= 1.35
            if (tech.isFlipFlopDamage && tech.isFlipFlopOn) dmg *= 1.5
            if (tech.isAnthropicDamage && tech.isDeathAvoidedThisLevel) dmg *= 2.3703599
            if (tech.isDamageAfterKill) dmg *= (m.lastKillCycle + 300 > m.cycle) ? 2 : 0.66
            if (m.isSneakAttack && m.cycle > m.lastKillCycle + 240) dmg *= tech.sneakAttackDmg
            if (tech.isTechDamage) dmg *= 1.9
            if (tech.isDupDamage) dmg *= 1 + Math.min(1, tech.duplicationChance())
            if (tech.isLowEnergyDamage) dmg *= 1 + Math.max(0, 1 - m.energy) * 0.5
            if (tech.isMaxEnergyTech) dmg *= 1.5
            if (tech.isEnergyNoAmmo) dmg *= 1.6
            if (tech.isDamageForGuns) dmg *= 1 + 0.14 * b.inventory.length
            if (tech.isLowHealthDmg) dmg *= 1 + Math.max(0, 1 - m.health) * 0.5
            if (tech.isHarmDamage && m.lastHarmCycle + 600 > m.cycle) dmg *= 3;
            if (tech.isEnergyLoss) dmg *= 1.55;
            if (tech.isAcidDmg && m.health > 1) dmg *= 1.35;
            if (tech.restDamage > 1 && player.speed < 1) dmg *= tech.restDamage
            if (tech.isEnergyDamage) dmg *= 1 + m.energy / 11;
            if (tech.isDamageFromBulletCount) dmg *= 1 + bullet.length * 0.005
            if (tech.isRerollDamage) dmg *= 1 + 0.037 * powerUps.research.count
            if (tech.isOneGun && b.inventory.length < 2) dmg *= 1.1995
            if (tech.isNoFireDamage && m.cycle > m.fireCDcycle + 120) dmg *= 2
            if (tech.isSpeedDamage) dmg *= 1 + Math.min(0.66, player.speed * 0.0165)
            if (tech.isBotDamage) dmg *= 1 + 0.06 * b.totalBots()
            return dmg * tech.slowFire * tech.aimDamage
        },
        duplicationChance() {
            return (tech.isPowerUpsVanish ? 0.13 : 0) + (tech.isStimulatedEmission ? 0.17 : 0) + tech.cancelCount * 0.045 + tech.duplicateChance + m.duplicateChance + tech.wormDuplicate + (tech.isAnthropicTech && tech.isDeathAvoidedThisLevel ? 0.5 : 0)
        },
        maxDuplicationEvent() {
            if (tech.is100Duplicate && tech.duplicationChance() > 0.99) {
                tech.is100Duplicate = false

                const range = 550
                for (let i = 0, len = 8; i < len; i++) {
                    const angle = 2 * Math.PI * i / len
                    spawn.randomLevelBoss(m.pos.x + range * Math.cos(angle), m.pos.y + range * Math.sin(angle), spawn.nonCollideBossList);
                }

                // spawn.randomLevelBoss(m.pos.x + range, m.pos.y, spawn.nonCollideBossList);
                // spawn.randomLevelBoss(m.pos.x, m.pos.y + range, spawn.nonCollideBossList);
                // spawn.randomLevelBoss(m.pos.x - range, m.pos.y, spawn.nonCollideBossList);
                // spawn.randomLevelBoss(m.pos.x, m.pos.y - range, spawn.nonCollideBossList);
                // spawn.randomLevelBoss(m.pos.x + range, m.pos.y + range, spawn.nonCollideBossList);
                // spawn.randomLevelBoss(m.pos.x + range, m.pos.y - range, spawn.nonCollideBossList);
                // spawn.randomLevelBoss(m.pos.x - range, m.pos.y + range, spawn.nonCollideBossList);
                // spawn.randomLevelBoss(m.pos.x - range, m.pos.y - range, spawn.nonCollideBossList);
            }
        },
        setTechFrequency(name, frequency) {
            for (let i = 0, len = tech.tech.length; i < len; i++) {
                if (tech.tech[i].name === name) tech.tech[i].frequency = frequency
            }
        },
        setBotTechFrequency(f = 0) {
            for (let i = 0, len = tech.tech.length; i < len; i++) {
                if (tech.tech[i].isBotTech) {
                    switch (tech.tech[i].name) {
                        case "dynamo-bot":
                            tech.tech[i].frequency = f
                            break;
                        case "orbital-bot":
                            tech.tech[i].frequency = f
                            break;
                        case "laser-bot":
                            tech.tech[i].frequency = f
                            break;
                        case "boom-bot":
                            tech.tech[i].frequency = f
                            break;
                        case "foam-bot":
                            tech.tech[i].frequency = f
                            break;
                        case "nail-bot":
                            tech.tech[i].frequency = f
                            break;
                    }
                }
            }
        },
        tech: [{
                name: "integrated armament",
                description: `increase <strong class='color-d'>damage</strong> by <strong>19.95%</strong><br>your inventory can only hold 1 <strong class='color-g'>gun</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return b.inventory.length === 1 //&& !tech.haveGunCheck("CPT gun")
                },
                requires: "only 1 gun",
                effect() {
                    tech.isOneGun = true;
                    for (let i = 0; i < tech.tech.length; i++) {
                        if (tech.tech[i].name === "CPT gun") tech.tech[i].description = `adds the <strong>CPT</strong> <strong class='color-g'>gun</strong> to your inventory<br>it <strong>rewinds</strong> your <strong class='color-h'>health</strong>, <strong>velocity</strong>, and <strong>position</strong><br><div style = 'color: #f24'>replaces your current gun</div>`
                    }
                },
                remove() {
                    tech.isOneGun = false;
                    for (let i = 0; i < tech.tech.length; i++) {
                        if (tech.tech[i].name === "CPT gun") tech.tech[i].description = `adds the <strong>CPT</strong> <strong class='color-g'>gun</strong> to your inventory<br>it <strong>rewinds</strong> your <strong class='color-h'>health</strong>, <strong>velocity</strong>, and <strong>position</strong>`
                    }
                }
            },
            {
                name: "entanglement",
                nameInfo: "<span id = 'tech-entanglement'></span>",
                addNameInfo() {
                    setTimeout(function() {
                        simulation.boldActiveGunHUD();
                    }, 1000);
                },
                description: "while your <strong>first</strong> <strong class='color-g'>gun</strong> is equipped<br>reduce <strong class='color-harm'>harm</strong> by <strong>13%</strong> for each of your <strong class='color-g'>guns</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return b.inventory.length > 1 && !tech.isEnergyHealth
                },
                requires: "at least 2 guns, not mass-energy",
                effect() {
                    tech.isEntanglement = true
                    setTimeout(function() {
                        simulation.boldActiveGunHUD();
                    }, 1000);

                },
                remove() {
                    tech.isEntanglement = false;
                }
            },
            {
                name: "arsenal",
                description: "increase <strong class='color-d'>damage</strong> by <strong>14%</strong><br>for each <strong class='color-g'>gun</strong> in your inventory",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return b.inventory.length > 2
                },
                requires: "at least 3 guns",
                effect() {
                    tech.isDamageForGuns = true;
                },
                remove() {
                    tech.isDamageForGuns = false;
                }
            },
            {
                name: "active cooling",
                description: "<strong>18%</strong> decreased <strong><em>delay</em></strong> after firing<br>for each <strong class='color-g'>gun</strong> in your inventory",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return b.inventory.length > 1
                },
                requires: "at least 2 guns",
                effect() {
                    tech.isFireRateForGuns = true;
                    b.setFireCD();
                },
                remove() {
                    tech.isFireRateForGuns = false;
                    b.setFireCD();
                }
            },
            {
                name: "generalist",
                description: "spawn <strong>8</strong> <strong class='color-g'>guns</strong>, but you can't <strong>switch</strong> <strong class='color-g'>guns</strong><br><strong class='color-g'>guns</strong> cycle automatically with each new level",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.isDamageForGuns || tech.isFireRateForGuns) && b.inventory.length < b.guns.length - 5 //12-5 guns total
                },
                requires: "arsenal or active cooling and less than 7 guns",
                effect() {
                    tech.isGunCycle = true;
                    for (let i = 0; i < 8; i++) powerUps.spawn(m.pos.x + 10 * Math.random(), m.pos.y + 10 * Math.random(), "gun");
                },
                remove() {
                    if (tech.isGunCycle) {
                        for (let i = 0; i < 8; i++) {
                            if (b.inventory.length) b.removeGun(b.guns[b.inventory[b.inventory.length - 1]].name) //remove your last gun
                        }
                        tech.isGunCycle = false;
                    }
                }
            },
            {
                name: "gun sciences",
                description: "spawn a <strong class='color-g'>gun</strong> and </strong>double</strong> the <strong class='flicker'>frequency</strong><br>of finding  <strong class='color-m'>tech</strong> for your <strong class='color-g'>guns</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                isNonRefundable: true,
                // isExperimentHide: true,
                isBadRandomOption: true,
                allowed() {
                    return !tech.isSuperDeterminism
                },
                requires: "not superdeterminism",
                effect() {
                    powerUps.spawn(m.pos.x, m.pos.y, "gun");
                    // this.count--
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (tech.tech[i].isGunTech) tech.tech[i].frequency *= 2
                    }
                },
                remove() {}
            },
            {
                name: "ad hoc",
                description: `for every <strong class='color-g'>gun</strong> in your inventory spawn a<br>${powerUps.orb.heal()}, ${powerUps.orb.research(1)}, <strong class='color-f'>field</strong>, ${powerUps.orb.ammo(1)}, or <strong class='color-m'>tech</strong>`,
                maxCount: 1, //random power up
                count: 0,
                frequency: 1,
                isNonRefundable: true,
                // isExperimentHide: true,
                allowed() {
                    return b.inventory.length > 1
                },
                requires: "at least 2 guns",
                effect() {
                    for (let i = 0; i < b.inventory.length; i++) {
                        if (Math.random() < 0.2) {
                            powerUps.spawn(m.pos.x + 10 * Math.random(), m.pos.y + 10 * Math.random(), "tech");
                        } else if (Math.random() < 0.25) {
                            powerUps.spawn(m.pos.x + 10 * Math.random(), m.pos.y + 10 * Math.random(), "field");
                        } else if (Math.random() < 0.33) {
                            powerUps.spawn(m.pos.x + 10 * Math.random(), m.pos.y + 10 * Math.random(), "heal");
                        } else if (Math.random() < 0.5) {
                            powerUps.spawn(m.pos.x + 10 * Math.random(), m.pos.y + 10 * Math.random(), "ammo");
                        } else {
                            powerUps.spawn(m.pos.x + 10 * Math.random(), m.pos.y + 10 * Math.random(), "research");
                        }
                    }
                },
                remove() {}
            },
            {
                name: "logistics",
                description: `${powerUps.orb.ammo()} give <strong>80%</strong> more <strong class='color-ammo'>ammo</strong>, but<br>it's only added to your current <strong class='color-g'>gun</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyNoAmmo
                },
                requires: "not exciton-lattice",
                effect() {
                    tech.isAmmoForGun = true;
                },
                remove() {
                    tech.isAmmoForGun = false;
                }
            },
            {
                name: "supply chain",
                description: "double your current <strong class='color-ammo'>ammo</strong> for all <strong class='color-g'>guns</strong>",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return tech.isAmmoForGun
                },
                requires: "logistics",
                effect() {
                    for (let i = 0; i < b.guns.length; i++) {
                        if (b.guns[i].have) b.guns[i].ammo = Math.floor(2 * b.guns[i].ammo)
                    }
                    simulation.makeGunHUD();
                },
                remove() {}
            },
            {
                name: "cache",
                description: `${powerUps.orb.ammo()} give <strong>11x</strong> more <strong class='color-ammo'>ammo</strong>, but<br>you can't <strong>store</strong> any more <strong class='color-ammo'>ammo</strong> than that`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyNoAmmo
                },
                requires: "not exciton-lattice",
                effect() {
                    tech.ammoCap = 11;
                    powerUps.ammo.effect()
                },
                remove() {
                    tech.ammoCap = 0;
                }
            },
            {
                name: "catabolism",
                description: `firing while <strong>out</strong> of <strong class='color-ammo'>ammo</strong> spawns ${powerUps.orb.ammo(4)}<br>but it reduces your <strong>maximum</strong> <strong class='color-h'>health</strong> by <strong>1</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyNoAmmo && !tech.isEnergyHealth
                },
                requires: "exciton-lattice, not mass-energy",
                effect: () => {
                    tech.isAmmoFromHealth = true;
                },
                remove() {
                    tech.isAmmoFromHealth = false;
                }
            },
            {
                name: "desublimated ammunition",
                description: "every other <strong>crouched</strong> shot uses no <strong class='color-ammo'>ammo</strong><br><strong>+6</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isCrouchAmmo = true
                    tech.addJunkTechToPool(6)
                },
                remove() {
                    tech.isCrouchAmmo = false;
                    if (this.count > 0) tech.removeJunkTechFromPool(6)
                }
            },
            // <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
            //     maxCount: 9,
            //     count: 0,
            //     frequency: 1,
            //     frequencyDefault: 1,
            //     allowed() {
            //         return true
            //     },
            //     requires: "",
            //     effect() {
            //         tech.bonusEnergy += 0.6
            //         m.setMaxEnergy()
            //         tech.addJunkTechToPool(10)
            //     },
            //     remove() {
            //         tech.bonusEnergy = 0;
            //         m.setMaxEnergy()
            //         if (this.count > 0) tech.removeJunkTechFromPool(10)
            //     }
            {
                name: "gun turret",
                description: "reduce <strong class='color-harm'>harm</strong> by <strong>55%</strong> when <strong>crouching</strong>",
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isCrouchAmmo && !tech.isEnergyHealth
                },
                requires: "desublimated ammunition, not mass-energy",
                effect() {
                    tech.isTurret = true
                },
                remove() {
                    tech.isTurret = false;
                }
            },
            {
                name: "dead reckoning",
                description: "increase <strong class='color-d'>damage</strong> by <strong>36%</strong> when at <strong>rest</strong>",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect: () => {
                    tech.restDamage += 0.36
                },
                remove() {
                    tech.restDamage = 1;
                }
            },
            {
                name: "Higgs mechanism",
                description: "while <strong>firing</strong> your <strong>position</strong> is locked<br><strong>50%</strong> decreased <strong><em>delay</em></strong> after firing",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !m.isShipMode && !tech.isAlwaysFire
                },
                requires: "not ship mode, not automatic",
                effect: () => {
                    tech.isFireMoveLock = true;
                    b.setFireCD();
                    b.setFireMethod();
                },
                remove() {
                    if (tech.isFireMoveLock) {
                        tech.isFireMoveLock = false
                        b.setFireCD();
                        b.setFireMethod();
                    }
                }
            },
            {
                name: "squirrel-cage rotor",
                description: "<strong>move</strong> and <strong>jump</strong> about <strong>30%</strong> faster<br>take <strong>5%</strong> more <strong class='color-harm'>harm</strong>",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return true
                },
                requires: "",
                effect() { // good with melee builds, content skipping builds
                    tech.squirrelFx += 0.25;
                    tech.squirrelJump += 0.1;
                    m.setMovement()
                },
                remove() {
                    tech.squirrelFx = 1;
                    tech.squirrelJump = 1;
                    m.setMovement()
                }
            },
            {
                name: "Newton's 1st law",
                description: "moving at high <strong>speeds</strong><br>reduces <strong class='color-harm'>harm</strong> by up to <strong>66%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy equivalence",
                effect() {
                    tech.isSpeedHarm = true //max at speed = 40
                },
                remove() {
                    tech.isSpeedHarm = false
                }
            },
            {
                name: "Newton's 2nd law",
                description: "moving at high <strong>speeds</strong><br>increases <strong class='color-d'>damage</strong> by up to <strong>66%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isSpeedDamage = true //max at speed = 40
                },
                remove() {
                    tech.isSpeedDamage = false
                }
            },
            {
                name: "kinetic bombardment",
                description: "increase <strong class='color-d'>damage</strong> by up to <strong>33%</strong><br>at a <strong>distance</strong> of 40 steps from the target",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isFarAwayDmg = true; //used in mob.damage()
                },
                remove() {
                    tech.isFarAwayDmg = false;
                }
            },
            {
                name: "simulated annealing",
                description: "increase <strong class='color-d'>damage</strong> by <strong>20%</strong><br><strong>20%</strong> increased <strong><em>delay</em></strong> after firing",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return true
                },
                effect() {
                    tech.slowFire = 1.2
                    b.setFireCD();
                },
                remove() {
                    tech.slowFire = 1;
                    b.setFireCD();
                }
            },
            {
                name: "auto-loading heuristics",
                description: "<strong>30%</strong> decreased <strong><em>delay</em></strong> after firing",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.fireRate *= 0.7
                    b.setFireCD();
                },
                remove() {
                    tech.fireRate = 1;
                    b.setFireCD();
                }
            },

            {
                name: "fracture analysis",
                description: "bullet impacts do <strong>400%</strong> <strong class='color-d'>damage</strong><br>to <strong>stunned</strong> mobs",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isStunField || tech.oneSuperBall || tech.isCloakStun || tech.orbitBotCount > 1 || tech.isExplosionStun || tech.isMineStun
                },
                requires: "a stun effect",
                effect() {
                    tech.isCrit = true;
                },
                remove() {
                    tech.isCrit = false;
                }
            },
            {
                name: "microstates",
                description: "increase <strong class='color-d'>damage</strong> by <strong>6%</strong><br>for every <strong>10</strong> active <strong>projectiles</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isDamageFromBulletCount = true
                },
                remove() {
                    tech.isDamageFromBulletCount = false
                }
            },
            {
                name: "anti-shear topology",
                description: "some <strong>projectiles</strong> last <strong>30% longer</strong><br><em style = 'font-size: 83%'>drones, spores, missiles, foam, wave, neutron</em>",
                // isGunTech: true,
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" || tech.haveGunCheck("spores") || tech.haveGunCheck("drones") || tech.haveGunCheck("missiles") || tech.haveGunCheck("foam") || tech.haveGunCheck("wave beam") || tech.isNeutronBomb || tech.isIceField || tech.isIceShot || tech.relayIce || tech.blockingIce > 1
                },
                requires: "drones, spores, missiles, foam, wave beam, neutron bomb, ice IX",
                effect() {
                    tech.isBulletsLastLonger += 0.3
                },
                remove() {
                    tech.isBulletsLastLonger = 1;
                }
            },
            {
                name: "radioactive contamination",
                description: "after a mob or shield <strong>dies</strong>,<br> leftover <strong class='color-p'>radiation</strong> <strong>spreads</strong> to a nearby mob",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isNailRadiation || tech.isWormholeDamage || tech.isNeutronBomb || tech.isExplodeRadio
                },
                requires: "radiation damage source",
                effect() {
                    tech.isRadioactive = true
                },
                remove() {
                    tech.isRadioactive = false
                }
            },
            {
                name: "water shielding",
                description: "<strong class='color-p'>radioactive</strong> effects on you are reduced by 75%<br><em>neutron bomb, drones, explosions, slime</em>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isNeutronBomb || tech.isDroneRadioactive || tech.isExplodeRadio
                },
                requires: "neutron bomb or irradiated drones or iridium-192",
                effect() {
                    tech.isRadioactiveResistance = true
                },
                remove() {
                    tech.isRadioactiveResistance = false
                }
            },
            {
                name: "iridium-192",
                description: "<strong class='color-e'>explosions</strong> release <strong class='color-p'>gamma radiation</strong><br><strong>100%</strong> more <strong class='color-d'>damage</strong>, but over 4 seconds",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.explosiveRadius === 1 && !tech.isSmallExplosion && (tech.haveGunCheck("missiles") || tech.isIncendiary || (tech.haveGunCheck("grenades") && !tech.isNeutronBomb) || tech.isPulseLaser || tech.isMissileField || tech.boomBotCount > 1 || tech.isTokamak)
                },
                requires: "an explosive damage source, not ammonium nitrate or nitroglycerin",
                effect: () => {
                    tech.isExplodeRadio = true; //iridium-192
                },
                remove() {
                    tech.isExplodeRadio = false;
                }
            },
            {
                name: "ammonium nitrate",
                description: "increase <strong class='color-e'>explosive</strong> <strong class='color-d'>damage</strong> by <strong>30%</strong><br>increase <strong class='color-e'>explosive</strong> <strong>radius</strong> by <strong>30%</strong>",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isExplodeRadio && tech.hasExplosiveDamageCheck()
                },
                requires: "an explosive damage source, not iridium-192",
                effect: () => {
                    tech.explosiveRadius += 0.3;
                },
                remove() {
                    tech.explosiveRadius = 1;
                }
            },
            {
                name: "nitroglycerin",
                description: "increase <strong class='color-e'>explosive</strong> <strong class='color-d'>damage</strong> by <strong>66%</strong><br>decrease <strong class='color-e'>explosive</strong> <strong>radius</strong> by <strong>33%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isExplodeRadio && tech.hasExplosiveDamageCheck()
                },
                requires: "an explosive damage source, not iridium-192",
                effect: () => {
                    tech.isSmallExplosion = true;
                },
                remove() {
                    tech.isSmallExplosion = false;
                }
            },
            {
                name: "acetone peroxide",
                description: "increase <strong class='color-e'>explosive</strong> <strong>radius</strong> by <strong>80%</strong>, but<br>you take <strong>300%</strong> more <strong class='color-harm'>harm</strong> from <strong class='color-e'>explosions</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                isBadRandomOption: true,
                allowed() {
                    return tech.hasExplosiveDamageCheck()
                },
                requires: "an explosive damage source",
                effect: () => {
                    tech.isExplosionHarm = true;
                },
                remove() {
                    tech.isExplosionHarm = false;
                }
            },
            {
                name: "shock wave",
                description: "<strong class='color-e'>explosions</strong> <strong>stun</strong> mobs for <strong>1-2</strong> seconds<br>decrease <strong class='color-e'>explosive</strong> <strong class='color-d'>damage</strong> by <strong>30%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isExplodeRadio && tech.hasExplosiveDamageCheck()
                },
                requires: "an explosive damage source, not iridium-192",
                effect() {
                    tech.isExplosionStun = true;
                },
                remove() {
                    tech.isExplosionStun = false;
                }
            },
            {
                name: "controlled explosion",
                description: `use ${powerUps.orb.research(3)} to dynamically <strong>reduce</strong> all<br><strong class='color-e'>explosions</strong> until they do no <strong class='color-harm'>harm</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isImmuneExplosion && (build.isExperimentSelection || powerUps.research.count > 2) && (tech.haveGunCheck("missiles") || tech.isMissileField || tech.missileBotCount > 0 || tech.isIncendiary || tech.isPulseLaser || tech.isTokamak || (tech.haveGunCheck("grenades") && !tech.isNeutronBomb))
                },
                requires: "an explosive damage source, not electric reactive armor",
                effect: () => {
                    tech.isSmartRadius = true;
                    for (let i = 0; i < 3; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                },
                remove() {
                    tech.isSmartRadius = false;
                    if (this.count > 0) powerUps.research.changeRerolls(3)
                }
            },
            {
                name: "electric reactive armor",
                // description: "<strong class='color-e'>explosions</strong> do no <strong class='color-harm'>harm</strong><br> while your <strong class='color-f'>energy</strong> is above <strong>98%</strong>",
                description: "<strong class='color-harm'>harm</strong> from <strong class='color-e'>explosions</strong> is passively reduced<br>by <strong>5%</strong> for every <strong>10</strong> stored <strong class='color-f'>energy</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isSmartRadius && !tech.isExplodeRadio && tech.hasExplosiveDamageCheck()
                },
                requires: "an explosive damage source, not iridium-192",
                effect: () => {
                    tech.isImmuneExplosion = true;
                },
                remove() {
                    tech.isImmuneExplosion = false;
                }
            },
            {
                name: "incendiary ammunition",
                description: "<strong>shotgun</strong>, <strong>super balls</strong>, and <strong>drones</strong><br>are loaded with <strong class='color-e'>explosives</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return ((m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" && !(tech.isDroneTeleport || tech.isDroneRadioactive || tech.isSporeField || tech.isMissileField || tech.isIceField)) || (tech.haveGunCheck("drones") && !tech.isDroneRadioactive && !tech.isDroneTeleport) || tech.haveGunCheck("super balls") || tech.haveGunCheck("shotgun")) && !tech.isNailShot && !tech.isIceShot && !tech.isFoamShot && !tech.isWormShot && !tech.isNeedleShot
                },
                requires: "super balls, basic or slug shotgun, drones, not irradiated drones or burst drones",
                effect() {
                    tech.isIncendiary = true
                },
                remove() {
                    tech.isIncendiary = false;
                }
            },
            {
                name: "fragmentation",
                description: "some <strong class='color-e'>detonations</strong> and collisions eject <strong>nails</strong><br><em style = 'font-size: 90%'>blocks, rail gun, grenades, missiles, slugs, harpoon</em>",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("harpoon") || (tech.haveGunCheck("grenades") && !tech.isNeutronBomb) || tech.haveGunCheck("missiles") || tech.missileBotCount || tech.haveGunCheck("rail gun") || (tech.haveGunCheck("shotgun") && tech.isSlugShot) || tech.throwChargeRate > 1
                },
                requires: "grenades, missiles, rail gun, shotgun slugs, harpoon, or mass driver",
                effect() {
                    tech.fragments++
                },
                remove() {
                    tech.fragments = 0
                }
            },
            {
                name: "thermal runaway",
                description: "mobs <strong class='color-e'>explode</strong> when they <strong>die</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.sporesOnDeath && !tech.nailsDeathMob && !tech.botSpawner && !tech.isMobBlockFling && !tech.iceIXOnDeath
                },
                requires: "no other mob death tech",
                effect: () => {
                    tech.isExplodeMob = true;
                },
                remove() {
                    tech.isExplodeMob = false;
                }
            },
            {
                name: "impact shear",
                description: "mobs release a <strong>nail</strong> when they <strong>die</strong><br><em>nails target nearby mobs</em>",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.sporesOnDeath && !tech.isExplodeMob && !tech.botSpawner && !tech.isMobBlockFling && !tech.iceIXOnDeath
                },
                requires: "no other mob death tech",
                effect: () => {
                    tech.nailsDeathMob++
                },
                remove() {
                    tech.nailsDeathMob = 0;
                }
            },
            {
                name: "zoospore vector",
                description: "mobs produce <strong class='color-p' style='letter-spacing: 2px;'>spores</strong> when they <strong>die</strong><br><strong>11%</strong> chance",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.nailsDeathMob && !tech.isExplodeMob && !tech.botSpawner && !tech.isMobBlockFling && !tech.iceIXOnDeath
                },
                requires: "no other mob death tech",
                effect() {
                    tech.sporesOnDeath += 0.11;
                    if (tech.isSporeWorm) {
                        for (let i = 0; i < 4; i++) b.worm(m.pos)

                    } else {
                        for (let i = 0; i < 8; i++) b.spore(m.pos)
                    }
                },
                remove() {
                    tech.sporesOnDeath = 0;
                }
            },
            {
                name: "reaction inhibitor",
                description: "mobs spawn with <strong>11%</strong> less <strong>health</strong>",
                maxCount: 3,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.nailsDeathMob || tech.sporesOnDeath || tech.isExplodeMob || tech.botSpawner || tech.isMobBlockFling || tech.iceIXOnDeath
                },
                requires: "any mob death tech",
                effect: () => {
                    tech.mobSpawnWithHealth *= 0.89

                    //set all mobs at full health to 0.85
                    for (let i = 0; i < mob.length; i++) {
                        if (mob.health > tech.mobSpawnWithHealth) mob.health = tech.mobSpawnWithHealth
                    }
                },
                remove() {
                    tech.mobSpawnWithHealth = 1;
                }
            },
            {
                name: "decorrelation",
                description: "reduce <strong class='color-harm'>harm</strong> by <strong>70%</strong> after not <strong>activating</strong><br>your <strong class='color-g'>gun</strong> or <strong class='color-f'>field</strong> for <strong>2</strong> seconds",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyHealth //((m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics" && (tech.blockingIce !== 0 || tech.blockDmg !== 0)) || b.totalBots() > 1 || tech.haveGunCheck("mine") || tech.haveGunCheck("spores") || m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing") && 
                },
                requires: "not mass-energy",
                effect() {
                    tech.isNoFireDefense = true
                },
                remove() {
                    tech.isNoFireDefense = false
                }
            },
            {
                name: "anticorrelation",
                description: "increase <strong class='color-d'>damage</strong> by <strong>100%</strong><br>after not using your <strong class='color-g'>gun</strong> or <strong class='color-f'>field</strong> for <strong>2</strong> seconds",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isNoFireDefense
                },
                requires: "decorrelation",
                effect() {
                    tech.isNoFireDamage = true
                },
                remove() {
                    tech.isNoFireDamage = false
                }
            },
            {
                name: "scrap bots",
                description: "<strong>33%</strong> chance after killing a mob to build<br>a scrap <strong class='color-bot'>bot</strong> that operates for <strong>14</strong> seconds",
                maxCount: 3,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBotTech: true,
                allowed() {
                    return !tech.sporesOnDeath && !tech.nailsDeathMob && !tech.isExplodeMob && !tech.isMobBlockFling && !tech.iceIXOnDeath
                },
                requires: "no other mob death tech",
                effect() {
                    tech.botSpawner += 0.33;
                },
                remove() {
                    tech.botSpawner = 0;
                }
            },
            {
                name: "scrap refit",
                description: "killing a mob resets your functional scrap <strong class='color-bot'>bots</strong><br>to <strong>14</strong> seconds of operation",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBotTech: true,
                allowed() {
                    return tech.botSpawner
                },
                requires: "scrap bots",
                effect() {
                    tech.isBotSpawnerReset = true;
                },
                remove() {
                    tech.isBotSpawnerReset = false;
                }
            },
            {
                name: "nail-bot",
                description: "a <strong class='color-bot'>bot</strong> fires <strong>nails</strong> at mobs in line of sight",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.nailBotCount++;
                    b.nailBot();
                },
                remove() {
                    if (this.count) {
                        tech.nailBotCount -= this.count;
                        b.clearPermanentBots();
                        b.respawnBots();
                    }
                }
            },
            {
                name: "nail-bot upgrade",
                description: "<strong>convert</strong> all your bots to <strong>nail-bots</strong><br><strong>500%</strong> increased nail-bot <strong>fire rate</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return tech.nailBotCount > 1 && !b.hasBotUpgrade()
                },
                requires: "2 or more nail bots and only 1 bot upgrade",
                effect() {
                    tech.isNailBotUpgrade = true
                    b.convertBotsTo("nail-bot")
                    for (let i = 0; i < bullet.length; i++) {
                        if (bullet[i].botType === 'nail') bullet[i].isUpgraded = true
                    }
                    tech.setBotTechFrequency()
                    tech.setTechFrequency("nail-bot", 5)
                },
                remove() {
                    if (this.count) {
                        for (let i = 0; i < bullet.length; i++) {
                            if (bullet[i].botType === 'nail') bullet[i].isUpgraded = false
                        }
                        tech.setBotTechFrequency(1)
                    }
                    tech.isNailBotUpgrade = false
                }
            },
            {
                name: "foam-bot",
                description: "a <strong class='color-bot'>bot</strong> fires <strong>foam</strong> at nearby mobs",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.foamBotCount++;
                    b.foamBot();
                },
                remove() {
                    if (this.count) {
                        tech.foamBotCount -= this.count;
                        b.clearPermanentBots();
                        b.respawnBots();
                    }
                }
            },
            {
                name: "foam-bot upgrade",
                description: "<strong>convert</strong> all your bots to <strong>foam-bots</strong><br><strong>250%</strong> increased foam <strong>size</strong> and <strong>fire rate</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return tech.foamBotCount > 1 && !b.hasBotUpgrade()
                },
                requires: "2 or more foam bots and only 1 bot upgrade",
                effect() {
                    tech.isFoamBotUpgrade = true
                    b.convertBotsTo("foam-bot")
                    for (let i = 0; i < bullet.length; i++) {
                        if (bullet[i].botType === 'foam') bullet[i].isUpgraded = true
                    }
                    tech.setBotTechFrequency()
                    tech.setTechFrequency("foam-bot", 5)
                },
                remove() {
                    if (this.count) {
                        for (let i = 0; i < bullet.length; i++) {
                            if (bullet[i].botType === 'foam') bullet[i].isUpgraded = false
                        }
                        tech.setBotTechFrequency(1)
                    }
                    tech.isFoamBotUpgrade = false
                }
            },
            {
                name: "boom-bot",
                description: "a <strong class='color-bot'>bot</strong> <strong>defends</strong> the space around you<br>ignites an <strong class='color-e'>explosion</strong> after hitting a mob",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.boomBotCount++;
                    b.boomBot();
                },
                remove() {
                    if (this.count) {
                        tech.boomBotCount -= this.count;
                        b.clearPermanentBots();
                        b.respawnBots();
                    }
                }
            },
            {
                name: "boom-bot upgrade",
                description: "<strong>convert</strong> all your bots to <strong>boom-bots</strong><br><strong>250%</strong> increased <strong class='color-e'>explosion</strong> <strong class='color-d'>damage</strong> and size",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return tech.boomBotCount > 1 && !b.hasBotUpgrade()
                },
                requires: "2 or more boom bots and only 1 bot upgrade",
                effect() {
                    tech.isBoomBotUpgrade = true
                    b.convertBotsTo("boom-bot")
                    for (let i = 0; i < bullet.length; i++) {
                        if (bullet[i].botType === 'boom') bullet[i].isUpgraded = true
                    }
                    tech.setBotTechFrequency()
                    tech.setTechFrequency("boom-bot", 5)
                },
                remove() {
                    if (this.count) {
                        for (let i = 0; i < bullet.length; i++) {
                            if (bullet[i].botType === 'boom') bullet[i].isUpgraded = false
                        }
                        tech.setBotTechFrequency(1)
                    }
                    tech.isBoomBotUpgrade = false
                }
            },
            {
                name: "laser-bot",
                description: "a <strong class='color-bot'>bot</strong> uses <strong class='color-f'>energy</strong> to emit a <strong class='color-laser'>laser</strong> beam<br>that targets nearby mobs",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return m.maxEnergy > 0.5
                },
                requires: "maximum energy above 50",
                effect() {
                    tech.laserBotCount++;
                    b.laserBot();
                },
                remove() {
                    if (this.count) {
                        tech.laserBotCount -= this.count;
                        b.clearPermanentBots();
                        b.respawnBots();
                    }
                }
            },
            {
                name: "laser-bot upgrade",
                description: "<strong>convert</strong> all your bots to <strong>laser-bots</strong><br><strong>75%</strong> improved <strong class='color-d'>damage</strong>, efficiency, and range", //  <strong>400%</strong> increased <strong>laser-bot</strong> <strong class='color-laser'>laser</strong> <strong class='color-d'>damage</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return tech.laserBotCount > 1 && !b.hasBotUpgrade()
                },
                requires: "2 or more laser bots and only 1 bot upgrade",
                effect() {
                    tech.isLaserBotUpgrade = true
                    b.convertBotsTo("laser-bot")
                    for (let i = 0; i < bullet.length; i++) {
                        if (bullet[i].botType === 'laser') bullet[i].isUpgraded = true
                    }
                    tech.setBotTechFrequency()
                    tech.setTechFrequency("laser-bot", 5)
                },
                remove() {
                    if (this.count) {
                        for (let i = 0; i < bullet.length; i++) {
                            if (bullet[i].botType === 'laser') bullet[i].isUpgraded = false
                        }
                        tech.setBotTechFrequency(1)
                    }
                    tech.isLaserBotUpgrade = false
                }
            },
            {
                name: "orbital-bot",
                description: "a <strong class='color-bot'>bot</strong> is locked in <strong>orbit</strong> around you<br><strong>stuns</strong> and <strong class='color-d'>damages</strong> mobs on <strong>contact</strong>",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    b.orbitBot();
                    tech.orbitBotCount++;
                },
                remove() {
                    if (this.count) {
                        tech.orbitBotCount -= this.count;
                        b.clearPermanentBots();
                        b.respawnBots();
                    }
                }
            },
            {
                name: "orbital-bot upgrade",
                description: "<strong>convert</strong> all your bots to <strong>orbital-bots</strong><br>increase <strong class='color-d'>damage</strong> by <strong>250%</strong> and <strong>radius</strong> by <strong>40%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return tech.orbitBotCount > 1 && !b.hasBotUpgrade()
                },
                requires: "2 or more orbital bots and only 1 bot upgrade",
                effect() {
                    tech.isOrbitBotUpgrade = true
                    b.convertBotsTo("orbital-bot")
                    const range = 190 + 100 * tech.isOrbitBotUpgrade
                    for (let i = 0; i < bullet.length; i++) {
                        if (bullet[i].botType === 'orbit') {
                            bullet[i].isUpgraded = true
                            bullet[i].range = range
                            bullet[i].orbitalSpeed = Math.sqrt(0.25 / range)
                        }
                    }
                    tech.setBotTechFrequency()
                    tech.setTechFrequency("orbital-bot", 5)
                },
                remove() {
                    if (this.count) {
                        const range = 190 + 100 * tech.isOrbitBotUpgrade
                        for (let i = 0; i < bullet.length; i++) {
                            if (bullet[i].botType === 'orbit') {
                                bullet[i].range = range
                                bullet[i].orbitalSpeed = Math.sqrt(0.25 / range)
                            }
                        }
                        tech.setBotTechFrequency(1)
                    }
                    tech.isOrbitBotUpgrade = false
                }
            },
            {
                name: "dynamo-bot",
                description: "a <strong class='color-bot'>bot</strong> <strong class='color-d'>damages</strong> mobs while it <strong>traces</strong> your path<br>regen <strong>6</strong> <strong class='color-f'>energy</strong> per second when it's near",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.dynamoBotCount++;
                    b.dynamoBot();
                },
                remove() {
                    if (this.count) {
                        tech.dynamoBotCount -= this.count;
                        b.clearPermanentBots();
                        b.respawnBots();
                    }
                }
            },
            {
                name: "dynamo-bot upgrade",
                description: "<strong>convert</strong> your bots to <strong>dynamo-bots</strong><br>increase regen to <strong>16</strong> <strong class='color-f'>energy</strong> per second",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return tech.dynamoBotCount > 1 && !b.hasBotUpgrade()
                },
                requires: "2 or more dynamo bots and only 1 bot upgrade",
                effect() {
                    tech.isDynamoBotUpgrade = true
                    b.convertBotsTo("dynamo-bot")
                    for (let i = 0; i < bullet.length; i++) {
                        if (bullet[i].botType === 'dynamo') bullet[i].isUpgraded = true
                    }
                    tech.setBotTechFrequency()
                    tech.setTechFrequency("dynamo-bot", 5)
                },
                remove() {
                    if (this.count) {
                        for (let i = 0; i < bullet.length; i++) {
                            if (bullet[i].botType === 'dynamo') bullet[i].isUpgraded = false
                        }
                        tech.setBotTechFrequency(1)
                    }
                    tech.isDynamoBotUpgrade = false
                }
            },
            {
                name: "bot fabrication",
                //-----------description is overwritten in powerUps.research.changeRerolls------------
                description: `if you collect ${powerUps.orb.research(2)}use them to build a<br>random <strong class='color-bot'>bot</strong> <em>(+1 cost every 5 bots)</em>`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return powerUps.research.count > 2 || build.isExperimentSelection
                },
                requires: "at least 3 research",
                effect() {
                    tech.isRerollBots = true;
                    powerUps.research.changeRerolls(0)
                    simulation.makeTextLog(`<span class='color-var'>m</span>.<span class='color-r'>research</span> <span class='color-symbol'>=</span> 0`)
                },
                remove() {
                    tech.isRerollBots = false;
                }
            },
            {
                name: "robotics",
                description: `spawn a random <strong>bot</strong><br><strong>quadruple</strong> the <strong class='flicker'>frequency</strong> of finding <strong>bot</strong> <strong class='color-m'>tech</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBotTech: true,
                allowed() {
                    return b.totalBots() > 1 || build.isExperimentSelection
                },
                requires: "at least 2 bots",
                effect: () => {
                    b.randomBot()
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (tech.tech[i].isBotTech) tech.tech[i].frequency *= 4
                    }
                },
                remove() {
                    if (this.count > 0) {
                        for (let i = 0, len = tech.tech.length; i < len; i++) {
                            if (tech.tech[i].isBotTech) tech.tech[i].frequency /= 4
                        }
                    }
                }
            },
            {
                name: "perimeter defense",
                description: "reduce <strong class='color-harm'>harm</strong> by <strong>7%</strong><br>for each of your permanent <strong class='color-bot'>bots</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return b.totalBots() > 3 && !tech.isEnergyHealth
                },
                requires: "at least 4 bots",
                effect() {
                    tech.isBotArmor = true
                },
                remove() {
                    tech.isBotArmor = false
                }
            },
            {
                name: "network effect",
                description: "increase <strong class='color-d'>damage</strong> by <strong>6%</strong><br>for each of your permanent <strong class='color-bot'>bots</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return b.totalBots() > 3
                },
                requires: "at least 4 bots",
                effect() {
                    tech.isBotDamage = true
                },
                remove() {
                    tech.isBotDamage = false
                }
            },
            {
                name: "ersatz bots",
                description: "<strong>double</strong> your current permanent <strong class='color-bot'>bots</strong><br>remove <strong>all</strong> of your current <strong class='color-g'>guns</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                // isNonRefundable: true,
                isBadRandomOption: true,
                numberOfGunsLost: 0,
                allowed() {
                    return b.totalBots() > 3
                },
                requires: "at least 4 bots",
                effect() {
                    this.numberOfGunsLost = b.inventory.length
                    b.removeAllGuns();
                    simulation.makeGunHUD();
                    //double bots
                    for (let i = 0; i < tech.nailBotCount; i++) b.nailBot();
                    tech.nailBotCount *= 2
                    for (let i = 0; i < tech.laserBotCount; i++) b.laserBot();
                    tech.laserBotCount *= 2
                    for (let i = 0; i < tech.foamBotCount; i++) b.foamBot();
                    tech.foamBotCount *= 2
                    for (let i = 0; i < tech.boomBotCount; i++) b.boomBot();
                    tech.boomBotCount *= 2
                    for (let i = 0; i < tech.orbitBotCount; i++) b.orbitBot();
                    tech.orbitBotCount *= 2
                    for (let i = 0; i < tech.dynamoBotCount; i++) b.dynamoBot();
                    tech.dynamoBotCount *= 2
                    for (let i = 0; i < tech.plasmaBotCount; i++) b.plasmaBot();
                    tech.plasmaBotCount *= 2
                    for (let i = 0; i < tech.missileBotCount; i++) b.missileBot();
                    tech.missileBotCount *= 2
                },
                remove() {
                    if (this.count) {
                        //return guns
                        for (let i = 0; i < this.numberOfGunsLost; i++) powerUps.spawn(m.pos.x + 60 * (Math.random() - 0.5), m.pos.y + 60 * (Math.random() - 0.5), "gun");
                        this.numberOfGunsLost = 0;

                        //half all current guns
                        tech.nailBotCount = Math.round(tech.nailBotCount / 2)
                        tech.laserBotCount = Math.round(tech.laserBotCount / 2)
                        tech.foamBotCount = Math.round(tech.foamBotCount / 2)
                        tech.boomBotCount = Math.round(tech.boomBotCount / 2)
                        tech.orbitBotCount = Math.round(tech.orbitBotCount / 2)
                        tech.dynamoBotCount = Math.round(tech.dynamoBotCount / 2)
                        tech.plasmaBotCount = Math.round(tech.plasmaBotCount / 2)
                        tech.missileBotCount = Math.round(tech.missileBotCount / 2)
                        b.clearPermanentBots();
                        b.respawnBots();
                    }
                }
            },
            {
                name: "mass driver",
                description: "charge <strong>throws</strong> more <strong>quickly</strong> for less <strong class='color-f'>energy</strong><br>increase <strong class='color-block'>block</strong> collision <strong class='color-d'>damage</strong> by <strong>200%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name !== "wormhole"
                },
                requires: "not wormhole",
                effect() {
                    tech.throwChargeRate = 3
                },
                remove() {
                    tech.throwChargeRate = 1
                }
            },
            {
                name: "inflation",
                description: "<strong>throwing</strong> a <strong class='color-block'>block</strong> expands it by <strong>300%</strong><br>increase <strong>throw</strong> charge rate by <strong>200%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.throwChargeRate > 1 && m.fieldUpgrades[m.fieldMode].name !== "pilot wave" && m.fieldUpgrades[m.fieldMode].name !== "wormhole" && !tech.isTokamak
                },
                requires: "mass driver, not pilot wave not tokamak",
                effect() {
                    tech.isAddBlockMass = true
                },
                remove() {
                    tech.isAddBlockMass = false
                }
            },
            {
                name: "restitution",
                description: "<strong>throwing</strong> a <strong class='color-block'>block</strong> makes it very <strong>bouncy</strong><br>increase <strong class='color-block'>block</strong> collision <strong class='color-d'>damage</strong> by <strong>150%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.throwChargeRate > 1 && m.fieldUpgrades[m.fieldMode].name !== "pilot wave" && m.fieldUpgrades[m.fieldMode].name !== "wormhole" && !tech.isTokamak
                },
                requires: "mass driver, not pilot wave not tokamak",
                effect() {
                    tech.isBlockRestitution = true
                },
                remove() {
                    tech.isBlockRestitution = false
                }
            },
            {
                name: "flywheel",
                description: "after a mob <strong>dies</strong> its <strong class='color-block'>block</strong> is <strong>flung</strong> at mobs<br>increase <strong class='color-block'>block</strong> collision <strong class='color-d'>damage</strong> by <strong>150%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.throwChargeRate > 1 && !tech.nailsDeathMob && !tech.sporesOnDeath && !tech.isExplodeMob && !tech.botSpawner && !tech.iceIXOnDeath
                },
                requires: "mass driver, no other mob death tech",
                effect() {
                    tech.isMobBlockFling = true
                },
                remove() {
                    tech.isMobBlockFling = false
                }
            },
            // {
            //     name: "fermions",
            //     description: "<strong class='color-block'>blocks</strong> thrown by you or <strong>pilot wave</strong> will<br><strong>collide</strong> with <strong>intangible</strong> mobs, but not you",
            //     maxCount: 1,
            //     count: 0,
            //     frequency: 2,
            //     frequencyDefault: 2,
            //     allowed() {
            //         return (tech.throwChargeRate > 1 || m.fieldUpgrades[m.fieldMode].name === "pilot wave") && !tech.isTokamak
            //     },
            //     requires: "mass driver or pilot wave, not tokamak",
            //     effect() {
            //         tech.isBlockBullets = true
            //     },
            //     remove() {
            //         tech.isBlockBullets = false
            //     }
            // },
            {
                name: "inelastic collision",
                description: "<strong>holding</strong> a <strong class='color-block'>block</strong> reduces <strong class='color-harm'>harm</strong> by <strong>85%</strong><br>increase <strong class='color-block'>block</strong> collision <strong class='color-d'>damage</strong> by <strong>150%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.throwChargeRate > 1 && m.fieldUpgrades[m.fieldMode].name !== "pilot wave" && m.fieldUpgrades[m.fieldMode].name !== "wormhole" && !tech.isEnergyHealth
                },
                requires: "mass driver, a field that can hold things, not mass-energy",
                effect() {
                    tech.isBlockHarm = true
                },
                remove() {
                    tech.isBlockHarm = false
                }
            },
            {
                name: "buckling",
                description: `if a <strong class='color-block'>block</strong> you threw kills a mob<br>spawn <strong>1</strong> ${powerUps.orb.heal()}, ${powerUps.orb.ammo()}, or ${powerUps.orb.research(1)}`,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.throwChargeRate > 1 && m.fieldUpgrades[m.fieldMode].name !== "pilot wave" && !tech.isTokamak
                },
                requires: "mass driver, not pilot wave not tokamak",
                effect() {
                    tech.isBlockPowerUps = true
                },
                remove() {
                    tech.isBlockPowerUps = false
                }
            },
            {
                name: "Pauli exclusion",
                description: `after receiving <strong class='color-harm'>harm</strong> from a <strong>collision</strong> become<br><strong>immune</strong> to <strong class='color-harm'>harm</strong> for <strong>1</strong> extra second`,
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.collisionImmuneCycles += 60;
                    if (m.immuneCycle < m.cycle + tech.collisionImmuneCycles) m.immuneCycle = m.cycle + tech.collisionImmuneCycles; //player is immune to damage for 30 cycles
                },
                remove() {
                    tech.collisionImmuneCycles = 30;
                }
            },
            {
                name: "complex spin-statistics",
                description: `become <strong>immune</strong> to <strong class='color-harm'>harm</strong> for <strong>1.5</strong> seconds<br>once every <strong>7</strong> seconds`,
                maxCount: 3,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true //tech.collisionImmuneCycles > 30
                },
                requires: "",
                effect() {
                    tech.cyclicImmunity += 90;
                },
                remove() {
                    tech.cyclicImmunity = 0;
                }
            },
            {
                name: "NOR gate",
                description: "if <strong>flip-flop</strong> is in the <strong class='color-flop'>ON</strong> state<br>take <strong>0</strong> <strong class='color-harm'>harm</strong> from collisions with mobs",
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isFlipFlop
                },
                requires: "flip-flop",
                effect() {
                    tech.isFlipFlopHarm = true //do you have this tech
                },
                remove() {
                    tech.isFlipFlopHarm = false
                }
            },
            {
                name: "flip-flop",
                description: `toggle <strong class="color-flop">ON</strong> and <strong class="color-flop">OFF</strong> after a <strong>collision</strong><br>unlock advanced <strong class='color-m'>tech</strong> that runs if <strong class="color-flop">ON</strong>`,
                nameInfo: "<span id = 'tech-flip-flop'></span>",
                addNameInfo() {
                    setTimeout(function() {
                        if (document.getElementById("tech-flip-flop")) {
                            if (tech.isFlipFlopOn) {
                                document.getElementById("tech-flip-flop").innerHTML = ` = <strong>ON</strong>`
                                m.eyeFillColor = m.fieldMeterColor //'#5af'
                            } else {
                                document.getElementById("tech-flip-flop").innerHTML = ` = <strong>OFF</strong>`
                                m.eyeFillColor = "transparent"
                            }
                        }
                    }, 100);
                },
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isRelay
                },
                requires: "not relay switch",
                effect() {
                    tech.isFlipFlop = true //do you have this tech?
                    tech.isFlipFlopOn = true //what is the state of flip-Flop?
                    if (!m.isShipMode) {
                        m.draw = m.drawFlipFlop
                    }
                },
                remove() {
                    tech.isFlipFlop = false
                    tech.isFlipFlopOn = false
                    m.eyeFillColor = 'transparent'
                }
            },
            {
                name: "relay switch",
                description: `toggle <strong class="color-flop">ON</strong> and <strong class="color-flop">OFF</strong> after picking up a <strong>power up</strong><br>unlock advanced <strong class='color-m'>tech</strong> that runs if <strong class="color-flop">ON</strong>`,
                nameInfo: "<span id = 'tech-switch'></span>",
                addNameInfo() {
                    setTimeout(function() {
                        if (document.getElementById("tech-switch")) {
                            if (tech.isFlipFlopOn) {
                                document.getElementById("tech-switch").innerHTML = ` = <strong>ON</strong>`
                                m.eyeFillColor = m.fieldMeterColor //'#5af'
                            } else {
                                document.getElementById("tech-switch").innerHTML = ` = <strong>OFF</strong>`
                                m.eyeFillColor = "transparent"
                            }
                        }
                    }, 100);
                },
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isFlipFlop
                },
                requires: "not flip-flop",
                effect() {
                    tech.isRelay = true //do you have this tech?
                    tech.isFlipFlopOn = true //what is the state of flip-Flop?
                    if (!m.isShipMode) {
                        m.draw = m.drawFlipFlop
                    }
                },
                remove() {
                    tech.isRelay = false
                    tech.isFlipFlopOn = false
                    m.eyeFillColor = 'transparent'
                }
            },
            {
                name: "thermocouple",
                description: "if  <strong>relay switch</strong> is in the <strong class='color-flop'>ON</strong> state<br>condense <strong>1-9</strong> <strong class='color-s'>ice IX</strong> crystals every second",
                maxCount: 9,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isRelay
                },
                requires: "relay switch",
                effect() {
                    tech.relayIce++
                },
                remove() {
                    tech.relayIce = 0
                }
            },
            {
                name: "NAND gate",
                description: "if in the <strong class='color-flop'>ON</strong> state<br>do <strong>50%</strong> more <strong class='color-d'>damage</strong>",
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isFlipFlop || tech.isRelay
                },
                requires: "ON/OFF tech",
                effect() {
                    tech.isFlipFlopDamage = true;
                },
                remove() {
                    tech.isFlipFlopDamage = false;
                }
            },
            {
                name: "transistor",
                description: "if <strong class='color-flop'>ON</strong> regen <strong>22</strong> <strong class='color-f'>energy</strong> per second<br>if <strong class='color-flop'>OFF</strong> drain <strong>2.2</strong> <strong class='color-f'>energy</strong> per second",
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isFlipFlop || tech.isRelay
                },
                requires: "ON/OFF tech",
                effect() {
                    tech.isFlipFlopEnergy = true;
                },
                remove() {
                    tech.isFlipFlopEnergy = false;
                }
            },
            {
                name: "shift registers",
                description: "set to the <strong class='color-flop'>ON</strong> state<br>at the start of a <strong>level</strong>",
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isFlipFlopEnergy || tech.isFlipFlopDamage || tech.isFlipFlopHarm || tech.relayIce
                },
                requires: "2 ON/OFF techs",
                effect() {
                    tech.isFlipFlopLevelReset = true;
                },
                remove() {
                    tech.isFlipFlopLevelReset = false;
                }
            },
            {
                name: "crystallizer",
                description: "after <strong class='color-s'>frozen</strong> mobs <strong>die</strong> they<br>shatter into <strong class='color-s'>ice IX</strong> crystals",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.isIceCrystals || tech.isSporeFreeze || tech.isIceField || tech.isIceShot || tech.relayIce || tech.blockingIce > 1) && !tech.sporesOnDeath && !tech.isExplodeMob && !tech.botSpawner && !tech.isMobBlockFling && !tech.nailsDeathMob
                },
                requires: "a localized freeze effect, no other mob death tech",
                effect() {
                    tech.iceIXOnDeath++
                },
                remove() {
                    tech.iceIXOnDeath = 0
                }
            },
            {
                name: "thermoelectric effect",
                description: "<strong>killing</strong> mobs with <strong class='color-s'>ice IX</strong><br>generates <strong>100</strong> <strong class='color-f'>energy</strong>",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isIceField || tech.relayIce || tech.blockingIce || tech.iceIXOnDeath || tech.isIceShot
                },
                requires: "ice IX",
                effect() {
                    tech.iceEnergy++
                },
                remove() {
                    tech.iceEnergy = 0;
                }
            },
            {
                name: "superfluidity",
                description: "<strong class='color-s'>freeze</strong> effects are applied to a small area",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isIceCrystals || tech.isSporeFreeze || tech.isIceField || tech.relayIce || tech.blockingIce > 1 || tech.iceIXOnDeath || tech.isIceShot
                },
                requires: "a localized freeze effect",
                effect() {
                    tech.isAoESlow = true
                },
                remove() {
                    tech.isAoESlow = false
                }
            },
            {
                name: "osmoprotectant",
                description: `collisions with <strong>stunned</strong> or <strong class='color-s'>frozen</strong> mobs<br>cause you <strong>no</strong> <strong class='color-harm'>harm</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isStunField || tech.isExplosionStun || tech.isMineStun || tech.oneSuperBall || tech.isHarmFreeze || tech.isIceField || tech.relayIce || tech.isIceCrystals || tech.isSporeFreeze || tech.isAoESlow || tech.isFreezeMobs || tech.isCloakStun || tech.orbitBotCount > 1 || tech.isWormholeDamage || tech.blockingIce > 1 || tech.iceIXOnDeath || tech.isIceShot
                },
                requires: "a freezing or stunning effect",
                effect() {
                    tech.isFreezeHarmImmune = true;
                },
                remove() {
                    tech.isFreezeHarmImmune = false;
                }
            },
            {
                name: "liquid cooling",
                description: `<strong class='color-s'>freeze</strong> all mobs for <strong>7</strong> seconds<br>after receiving <strong class='color-harm'>harm</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.isSlowFPS
                },
                requires: "clock gating",
                effect() {
                    tech.isHarmFreeze = true;
                },
                remove() {
                    tech.isHarmFreeze = false;
                }
            },
            {
                name: "clock gating",
                description: `<strong>slow</strong> <strong>time</strong> by <strong>50%</strong> after receiving <strong class='color-harm'>harm</strong><br>reduce <strong class='color-harm'>harm</strong> by <strong>20%</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return simulation.fpsCapDefault > 45
                },
                requires: "FPS above 45",
                effect() {
                    tech.isSlowFPS = true;
                },
                remove() {
                    tech.isSlowFPS = false;
                }
            },
            {
                name: "MACHO",
                description: "a massive but compact object slowly <strong>follows</strong> you<br>take <strong>66%</strong> less <strong class='color-harm'>harm</strong> inside it's <strong>halo</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy",
                effect: () => {
                    tech.isMACHO = true; //this harm reduction comes from the particle toggling  tech.isHarmMACHO
                    spawn.MACHO()
                },
                remove() {
                    tech.isMACHO = false;
                    for (let i = 0, len = mob.length; i < len; i++) {
                        if (mob[i].isMACHO) mob[i].alive = false;
                    }
                }
            },
            {
                name: "ablative drones",
                description: "rebuild your broken parts as <strong>drones</strong><br>chance to occur after receiving <strong class='color-harm'>harm</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.harmReduction() < 1
                },
                requires: "some harm reduction",
                effect() {
                    tech.isDroneOnDamage = true;
                    for (let i = 0; i < 4; i++) {
                        b.drone() //spawn drone
                    }
                },
                remove() {
                    tech.isDroneOnDamage = false;
                }
            },
            {
                name: "non-Newtonian armor",
                description: "for <strong>10 seconds</strong> after receiving <strong class='color-harm'>harm</strong><br>reduce <strong class='color-harm'>harm</strong> by <strong>66%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isEnergyHealth && m.harmReduction() < 1
                },
                requires: "some harm reduction",
                effect() {
                    tech.isHarmArmor = true;
                },
                remove() {
                    tech.isHarmArmor = false;
                }
            },
            {
                name: "radiative equilibrium",
                description: "for <strong>10 seconds</strong> after receiving <strong class='color-harm'>harm</strong><br>increase <strong class='color-d'>damage</strong> by <strong>200%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.harmReduction() < 1
                },
                requires: "some harm reduction",
                effect() {
                    tech.isHarmDamage = true;
                },
                remove() {
                    tech.isHarmDamage = false;
                }
            },
            {
                name: "CPT reversal",
                description: "<strong>charge</strong>, <strong>parity</strong>, and <strong>time</strong> invert to undo <strong class='color-harm'>harm</strong><br><strong class='color-rewind'>rewind</strong> <strong>(1.5—5)</strong> seconds for <strong>(66—220)</strong> <strong class='color-f'>energy</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() { //&& (m.fieldUpgrades[m.fieldMode].name !== "nano-scale manufacturing" || m.maxEnergy > 1)
                    return m.maxEnergy > 0.99 && m.fieldUpgrades[m.fieldMode].name !== "standing wave harmonics" && !tech.isEnergyHealth && !tech.isRewindGun
                },
                requires: "not standing wave, mass-energy, max energy reduction, CPT gun",
                effect() {
                    tech.isRewindAvoidDeath = true;
                },
                remove() {
                    tech.isRewindAvoidDeath = false;
                }
            },
            {
                name: "causality bots",
                description: "when you <strong class='color-rewind'>rewind</strong>, build several <strong class='color-bot'>bots</strong><br>that protect you for about <strong>9</strong> seconds",
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isBotTech: true,
                allowed() {
                    return tech.isRewindAvoidDeath
                },
                requires: "CPT",
                effect() {
                    tech.isRewindBot++;
                },
                remove() {
                    tech.isRewindBot = 0;
                }
            },
            {
                name: "causality bombs",
                description: "before you <strong class='color-rewind'>rewind</strong> drop several <strong>grenades</strong><br>become immune to <strong class='color-harm'>harm</strong> until they <strong class='color-e'>explode</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isRewindAvoidDeath
                },
                requires: "CPT",
                effect() {
                    tech.isRewindGrenade = true;
                },
                remove() {
                    tech.isRewindGrenade = false;
                }
            },
            {
                name: "piezoelectricity",
                description: "<strong>colliding</strong> with mobs gives you <strong>2048</strong> <strong class='color-f'>energy</strong>", //<br>reduce <strong class='color-harm'>harm</strong> by <strong>15%</strong>
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy",
                effect() {
                    tech.isPiezo = true;
                    m.energy += 20.48;
                },
                remove() {
                    tech.isPiezo = false;
                }
            },
            {
                name: "ground state",
                description: "reduce <strong class='color-harm'>harm</strong> by <strong>66%</strong><br>you <strong>no longer</strong> passively regenerate <strong class='color-f'>energy</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.iceEnergy || tech.isWormholeEnergy || tech.isPiezo || tech.isRailEnergyGain || tech.energySiphon || tech.isEnergyRecovery || tech.dynamoBotCount || tech.isFlipFlopEnergy || tech.isTokamak) && tech.energyRegen !== 0.004 && !tech.isEnergyHealth
                },
                requires: "a way to regen extra energy, not time crystals",
                effect: () => {
                    tech.energyRegen = 0;
                    m.fieldRegen = tech.energyRegen;
                },
                remove() {
                    tech.energyRegen = 0.001;
                    m.fieldRegen = tech.energyRegen;
                }
            },
            {
                name: "mass-energy equivalence",
                description: "<strong class='color-f'>energy</strong> protects you instead of <strong class='color-h'>health</strong><br><strong class='color-harm'>harm</strong> <strong>reduction</strong> effects provide <strong>no</strong> benefit",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isZeno && !tech.isNoHeals && !tech.isPiezo && !tech.isRewindAvoidDeath && !tech.isRewindGun && !tech.isTechDamage && !tech.isMutualism //&& !tech.isAmmoFromHealth
                },
                requires: "not Zeno, ergodicity, piezoelectricity, CPT, rewind gun, antiscience, mutualism",
                effect: () => {
                    m.health = 0
                    document.getElementById("health").style.display = "none"
                    document.getElementById("health-bg").style.display = "none"
                    document.getElementById("dmg").style.backgroundColor = "#0cf";
                    tech.isEnergyHealth = true;
                    simulation.mobDmgColor = "rgba(14, 190, 235,0.7)" //"#0cf"
                    m.displayHealth();
                },
                remove() {
                    if (tech.isEnergyHealth) {
                        tech.isEnergyHealth = false;
                        document.getElementById("health").style.display = "inline"
                        document.getElementById("health-bg").style.display = "inline"
                        document.getElementById("dmg").style.backgroundColor = "#f67";
                        m.health = Math.max(Math.min(m.maxHealth, m.energy), 0.1);
                        simulation.mobDmgColor = "rgba(255,0,0,0.7)"
                        m.displayHealth();
                    }
                }
            },
            {
                name: "1st ionization energy",
                description: `each ${powerUps.orb.heal()} you collect<br>increases your <strong>maximum</strong> <strong class='color-f'>energy</strong> by <strong>6</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isEnergyHealth
                },
                requires: "mass-energy equivalence",
                effect() {
                    tech.healGiveMaxEnergy = true; //tech.healMaxEnergyBonus given from heal power up
                    powerUps.heal.color = "#0ae"
                    for (let i = 0; i < powerUp.length; i++) { //find active heal power ups and adjust color live
                        if (powerUp[i].name === "heal") powerUp[i].color = powerUps.heal.color
                    }
                },
                remove() {
                    tech.healGiveMaxEnergy = false;
                    // tech.healMaxEnergyBonus = 0
                    powerUps.heal.color = "#0eb"
                    for (let i = 0; i < powerUp.length; i++) { //find active heal power ups and adjust color live
                        if (powerUp[i].name === "heal") powerUp[i].color = powerUps.heal.color
                    }
                }
            },
            {
                name: "inductive coupling",
                description: "each unused <strong>power up</strong> at the end of a <strong>level</strong><br>adds 3 <strong>maximum</strong> <strong class='color-f'>energy</strong>", // <em>(up to 51 health per level)</em>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isDroneGrab
                },
                requires: "not drone harvester",
                effect() {
                    tech.isExtraMaxEnergy = true; //tracked by  tech.extraMaxHealth
                },
                remove() {
                    tech.isExtraMaxEnergy = false;
                }
            },
            {
                name: "transceiver chip",
                description: "unused <strong>power ups</strong> at the end of each <strong>level</strong><br>are still activated <em>(selections are random)</em>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isExtraMaxEnergy
                },
                requires: "inductive coupling",
                effect() {
                    tech.isEndLevelPowerUp = true;
                },
                remove() {
                    tech.isEndLevelPowerUp = false;
                }
            },
            {
                name: "electrolytes",
                description: "increase <strong class='color-d'>damage</strong> by <strong>1%</strong><br>for every <strong>11</strong> stored <strong class='color-f'>energy</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return true
                },
                requires: "",
                effect: () => {
                    tech.isEnergyDamage = true
                },
                remove() {
                    tech.isEnergyDamage = false;
                }
            },
            {
                name: "exciton-lattice",
                description: `increase <strong class='color-d'>damage</strong> by <strong>60%</strong>, but<br>${powerUps.orb.ammo()} will no longer <strong>spawn</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isEnergyNoAmmo = true;
                },
                remove() {
                    tech.isEnergyNoAmmo = false;
                }
            },
            {
                name: "exothermic process",
                description: "increase <strong class='color-d'>damage</strong> by <strong>50%</strong><br>if a mob <strong>dies</strong> drain <strong class='color-f'>energy</strong> by <strong>25%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isEnergyLoss = true;
                },
                remove() {
                    tech.isEnergyLoss = false;
                }
            },
            {
                name: "heat engine",
                description: `increase <strong class='color-d'>damage</strong> by <strong>50%</strong>, but<br>reduce maximum <strong class='color-f'>energy</strong> by <strong>50</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isEnergyLoss && !tech.isRewindAvoidDeath
                },
                requires: "exothermic process, not CPT",
                effect() {
                    tech.isMaxEnergyTech = true;
                    m.setMaxEnergy()
                },
                remove() {
                    tech.isMaxEnergyTech = false;
                    m.setMaxEnergy()
                }
            },
            {
                name: "Gibbs free energy",
                description: `increase <strong class='color-d'>damage</strong> by <strong>5%</strong><br>for every <strong>10</strong> <strong class='color-f'>energy</strong> below <strong>100</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isEnergyLoss && m.maxEnergy < 1.01
                },
                requires: "exothermic process, not max energy increase",
                effect() {
                    tech.isLowEnergyDamage = true;
                },
                remove() {
                    tech.isLowEnergyDamage = false;
                }
            },
            {
                name: "overcharge",
                description: "increase your <strong>maximum</strong> <strong class='color-f'>energy</strong> by <strong>60</strong><br><strong>+10</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.bonusEnergy += 0.6
                    m.setMaxEnergy()
                    tech.addJunkTechToPool(10)
                },
                remove() {
                    tech.bonusEnergy = 0;
                    m.setMaxEnergy()
                    if (this.count > 0) tech.removeJunkTechFromPool(10)
                }
            },
            {
                name: "Maxwell's demon",
                description: "<strong class='color-f'>energy</strong> above your max decays <strong>92%</strong> slower<br><strong>+18</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.energy > m.maxEnergy || build.isExperimentSelection
                },
                requires: "energy above your max",
                effect() {
                    tech.overfillDrain = 0.85 //70% = 1-(1-0.75)/(1-0.15) //92% = 1-(1-0.75)/(1-0.87)
                    tech.addJunkTechToPool(18)
                },
                remove() {
                    tech.overfillDrain = 0.7
                    if (this.count > 0) tech.removeJunkTechFromPool(18)
                }
            },
            {
                name: "energy conservation",
                description: "<strong>5%</strong> of <strong class='color-d'>damage</strong> done recovered as <strong class='color-f'>energy</strong>",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.energySiphon += 0.05;
                },
                remove() {
                    tech.energySiphon = 0;
                }
            },
            {
                name: "waste energy recovery",
                description: "if a mob has <strong>died</strong> in the last <strong>5 seconds</strong><br>regen <strong>5%</strong> of max <strong class='color-f'>energy</strong> every second",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isEnergyRecovery = true;
                },
                remove() {
                    tech.isEnergyRecovery = false;
                }
            },
            {
                name: "scrap recycling",
                description: "if a mob has <strong>died</strong> in the last <strong>5 seconds</strong><br>regain <strong>1%</strong> of max <strong class='color-h'>health</strong> every second",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isHealTech: true,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy equivalence",
                effect() {
                    tech.isHealthRecovery = true;
                },
                remove() {
                    tech.isHealthRecovery = false;
                }
            },
            {
                name: "dormancy",
                description: "if a mob has <strong>died</strong> in the last <strong>5 seconds</strong><br><span style = 'font-size:90%;'>increase <strong class='color-d'>damage</strong> by <strong>99%</strong> else decrease it by <strong>33%</strong></span>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isDamageAfterKill = true;
                },
                remove() {
                    tech.isDamageAfterKill = false;
                }
            },
            {
                name: "torpor",
                description: "if a mob has <strong>died</strong> in the last <strong>5 seconds</strong><br>reduce <strong class='color-harm'>harm</strong> by <strong>66%</strong> else increase it by <strong>15%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.isDamageAfterKill && !tech.isEnergyHealth
                },
                requires: "dormancy, not mass-energy",
                effect() {
                    tech.isHarmReduceAfterKill = true;
                },
                remove() {
                    tech.isHarmReduceAfterKill = false;
                }
            },
            {
                name: "Zeno's paradox",
                description: "reduce <strong class='color-harm'>harm</strong> by <strong>83%</strong>, but every <strong>5</strong> seconds<br>remove <strong>1/10</strong> of your current <strong class='color-h'>health</strong>",
                // description: "every <strong>5</strong> seconds remove <strong>1/10</strong> of your <strong class='color-h'>health</strong><br>reduce <strong class='color-harm'>harm</strong> by <strong>90%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy",
                effect() {
                    tech.isZeno = true;
                },
                remove() {
                    tech.isZeno = false;
                }
            },
            {
                name: "negative feedback",
                description: "increase <strong class='color-d'>damage</strong> by <strong>5%</strong><br>for every <strong>10</strong> <strong class='color-h'>health</strong> below <strong>100</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.health < 0.6 || build.isExperimentSelection
                },
                requires: "health below 60",
                effect() {
                    tech.isLowHealthDmg = true; //used in mob.damage()
                },
                remove() {
                    tech.isLowHealthDmg = false;
                }
            },
            {
                name: "antiscience",
                description: "increase <strong class='color-d'>damage</strong> by <strong>90%</strong><br>lose <strong>11</strong> <strong class='color-h'>health</strong> when you pick up a <strong class='color-m'>tech</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy",
                effect() {
                    tech.isTechDamage = true;
                },
                remove() {
                    tech.isTechDamage = false;
                }
            },
            {
                name: "entropy exchange",
                description: "<strong class='color-h'>heal</strong> for <strong>3%</strong> of <strong class='color-d'>damage</strong> done<br>take <strong>10%</strong> more <strong class='color-harm'>harm</strong>",
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isHealTech: true,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy equivalence",
                effect() {
                    tech.healthDrain += 0.03;
                },
                remove() {
                    tech.healthDrain = 0;
                }
            },
            {
                name: "fluoroantimonic acid",
                description: "increase <strong class='color-d'>damage</strong> by <strong>35%</strong><br>when your <strong class='color-h'>health</strong> is above <strong>100</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.maxHealth > 1;
                },
                requires: "health above 100",
                effect() {
                    tech.isAcidDmg = true;
                },
                remove() {
                    tech.isAcidDmg = false;
                }
            },
            {
                name: "tungsten carbide",
                description: "increase your <strong>maximum</strong> <strong class='color-h'>health</strong> by <strong>100</strong><br><strong>landings</strong> that force you to crouch cause <strong class='color-harm'>harm</strong>",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy equivalence",
                effect() {
                    tech.isFallingDamage = true;
                    m.setMaxHealth();
                    m.addHealth(1 / simulation.healScale)
                },
                remove() {
                    tech.isFallingDamage = false;
                    m.setMaxHealth();
                }
            },
            {
                name: "quenching",
                description: `over healing from ${powerUps.orb.heal()} does <strong class='color-harm'>harm</strong><br>but it also increase your <strong>maximum</strong> <strong class='color-h'>health</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isEnergyHealth && !tech.isNoHeals
                },
                requires: "not mass-energy equivalence, ergodicity",
                effect() {
                    tech.isOverHeal = true;
                },
                remove() {
                    tech.isOverHeal = false;
                }
            },
            {
                name: "negative entropy",
                description: `at the start of each <strong>level</strong><br>spawn ${powerUps.orb.heal()} for every <strong>26</strong> missing health`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isHealTech: true,
                allowed() {
                    return m.health > 0.1 && !tech.isNoHeals
                },
                requires: "has some health, not ergodicity",
                effect() {
                    tech.isHealLowHealth = true;
                },
                remove() {
                    tech.isHealLowHealth = false;
                }
            },
            {
                name: "adiabatic healing",
                description: `${powerUps.orb.heal()} are <strong>100%</strong> more effective`,
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isHealTech: true,
                allowed() {
                    return ((m.health / m.maxHealth) < 0.7 || build.isExperimentSelection) && !tech.isEnergyHealth && !tech.isNoHeals
                },
                requires: "under 70% health, not mass-energy equivalence, ergodicity",
                effect() {
                    tech.largerHeals++;
                },
                remove() {
                    tech.largerHeals = 1;
                }
            },
            {
                name: "maintenance",
                description: `</strong>double</strong> the <strong class='flicker'>frequency</strong> of finding <strong class='color-h'>healing</strong> <strong class='color-m'>tech</strong><br>spawn ${powerUps.orb.heal(11)}`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0; i < 11; i++) powerUps.spawn(m.pos.x + 60 * (Math.random() - 0.5), m.pos.y + 60 * (Math.random() - 0.5), "heal");
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (tech.tech[i].isHealTech) tech.tech[i].frequency *= 2
                    }
                },
                remove() {}
            },
            {
                name: "anthropic principle",
                nameInfo: "<span id = 'tech-anthropic'></span>",
                addNameInfo() {
                    setTimeout(function() {
                        powerUps.research.changeRerolls(0)
                    }, 1000);
                },
                description: `once per level, instead of <strong>dying</strong><br>use ${powerUps.orb.research(1)} and spawn ${powerUps.orb.heal(5)}`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isHealTech: true,
                allowed() {
                    return powerUps.research.count > 0 || build.isExperimentSelection
                },
                requires: "at least 1 research",
                effect() {
                    tech.isDeathAvoid = true;
                    tech.isDeathAvoidedThisLevel = false;
                    setTimeout(function() {
                        powerUps.research.changeRerolls(0)
                    }, 1000);
                },
                remove() {
                    tech.isDeathAvoid = false;
                }
            },
            {
                name: "weak anthropic principle",
                description: "after <strong>anthropic principle</strong> prevents your <strong>death</strong><br>add <strong>50%</strong> <strong class='color-dup'>duplication</strong> chance for that level",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.isDeathAvoid && tech.duplicationChance() < 0.66
                },
                requires: "anthropic principle, below 66% duplication chance",
                effect() {
                    tech.isAnthropicTech = true
                    powerUps.setDo(); //needed after adjusting duplication chance
                },
                remove() {
                    tech.isAnthropicTech = false
                    powerUps.setDo(); //needed after adjusting duplication chance
                }
            },
            {
                name: "strong anthropic principle",
                description: "after <strong>anthropic principle</strong> prevents your <strong>death</strong><br>increase <strong class='color-d'>damage</strong> by <strong>137.03599%</strong> for that level",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.isDeathAvoid
                },
                requires: "anthropic principle",
                effect() {
                    tech.isAnthropicDamage = true
                },
                remove() {
                    tech.isAnthropicDamage = false
                }
            },
            {
                name: "quantum immortality",
                description: "reduce <strong class='color-harm'>harm</strong> by <strong>33%</strong><br>after <strong>dying</strong>, continue in an <strong class='alt'>alternate reality</strong>",
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.isDeathAvoid
                },
                requires: "anthropic principle",
                effect() {
                    tech.isImmortal = true;
                },
                remove() {
                    tech.isImmortal = false;
                }
            },
            {
                name: "non-unitary operator",
                description: "reduce combat <strong>difficulty</strong> by <strong>2 levels</strong>, but<br>after a <strong>collision</strong> enter an <strong class='alt'>alternate reality</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isResearchReality && !tech.isSwitchReality
                },
                requires: "Ψ(t) collapse, many-worlds",
                effect() {
                    tech.isCollisionRealitySwitch = true;
                    level.difficultyDecrease(simulation.difficultyMode * 2)
                },
                remove() {
                    tech.isCollisionRealitySwitch = false;
                    if (this.count > 0) {
                        level.difficultyIncrease(simulation.difficultyMode * 2)
                    }
                }
            },
            {
                name: "many-worlds",
                // description: "each <strong>level</strong> is an <strong class='alt'>alternate reality</strong>, where you<br>find a <strong class='color-m'>tech</strong> at the start of each level",
                description: `on each new <strong>level</strong> use ${powerUps.orb.research(1)} to enter an<br><strong class='alt'>alternate reality</strong> and spawn a <strong class='color-m'>tech</strong> power up`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isResearchReality && !tech.isCollisionRealitySwitch
                },
                requires: "not Ψ(t) collapse, non-unitary",
                effect() {
                    tech.isSwitchReality = true;
                },
                remove() {
                    tech.isSwitchReality = false;
                }
            },
            {
                name: "Ψ(t) collapse",
                description: `enter an <strong class='alt'>alternate reality</strong> after you <strong class='color-r'>research</strong><br>spawn ${powerUps.orb.research(16)}`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isSwitchReality && !tech.isCollisionRealitySwitch && !tech.isJunkResearch
                },
                requires: "many-worlds, non-unitary, not pseudoscience",
                effect() {
                    tech.isResearchReality = true;
                    for (let i = 0; i < 16; i++) powerUps.spawn(m.pos.x + Math.random() * 60, m.pos.y + Math.random() * 60, "research", false);
                },
                remove() {
                    tech.isResearchReality = false;
                }
            },
            {
                name: "decoherence",
                description: `<strong class='color-r'>researched</strong> or <strong>canceled</strong> <strong class='color-m'>tech</strong> won't <strong>reoccur</strong> <br>spawn ${powerUps.orb.research(9)}`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (powerUps.research.count > 2 || build.isExperimentSelection) && !tech.isDeterminism
                },
                requires: "not determinism, at least 3 research",
                effect() {
                    tech.isBanish = true
                    for (let i = 0; i < 9; i++) powerUps.spawn(m.pos.x + 40 * (Math.random() - 0.5), m.pos.y + 40 * (Math.random() - 0.5), "research", false);
                },
                remove() {
                    if (tech.isBanish) {
                        tech.isBanish = false
                        powerUps.tech.banishLog = [] //reset banish log
                        powerUps.research.changeRerolls(-10)
                    }
                }
            },
            {
                name: "renormalization",
                description: `using ${powerUps.orb.research(1)} for <strong>any</strong> purpose<br>has a <strong>40%</strong> chance to spawn ${powerUps.orb.research(1)}`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (powerUps.research.count > 2 || build.isExperimentSelection) && !tech.isSuperDeterminism
                },
                requires: "at least 3 research and not superdeterminism",
                effect() {
                    tech.renormalization = true; //40% set in regularization tech
                },
                remove() {
                    tech.renormalization = false;
                }
            },
            {
                name: "regularization",
                description: `increase <strong>renormalization</strong> chance by <strong>10%</strong><br>use ${powerUps.orb.research(6)}`,
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.renormalization && (powerUps.research.count > 5 || build.isExperimentSelection)
                },
                requires: "renormalization",
                effect() {
                    tech.regularization += 0.1
                    for (let i = 0; i < 6; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                    for (let i = 0; i < 6; i++) powerUps.spawn(m.pos.x + 120 * (Math.random() - 0.5), m.pos.y + 120 * (Math.random() - 0.5), "research", false);
                },
                remove() {
                    tech.regularization = 0.4
                }
            },
            {
                name: "perturbation theory",
                description: `<strong>66%</strong> decreased <strong><em>delay</em></strong> after firing<br>when you have no ${powerUps.orb.research(1)} in your inventory`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return powerUps.research.count === 0
                },
                requires: "no research",
                effect() {
                    tech.isRerollHaste = true;
                    tech.researchHaste = 0.33;
                    b.setFireCD();
                },
                remove() {
                    tech.isRerollHaste = false;
                    tech.researchHaste = 1;
                    b.setFireCD();
                }
            },
            {
                name: "ansatz",
                description: `after choosing a <strong class='color-f'>field</strong>, <strong class='color-m'>tech</strong>, or <strong class='color-g'>gun</strong><br>spawn ${powerUps.orb.research(2)}if you have 0 ${powerUps.orb.research(1)} in your inventory`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return powerUps.research.count === 0 && !tech.isSuperDeterminism && !tech.isRerollHaste && !tech.isResearchReality
                },
                requires: "no research, not superdeterminism, Ψ(t) collapse, perturbation theory",
                effect: () => {
                    tech.isAnsatz = true;
                },
                remove() {
                    tech.isAnsatz = false;
                }
            },
            {
                name: "Bayesian statistics",
                description: `increase <strong class='color-d'>damage</strong> by <strong>3.7%</strong><br>for each ${powerUps.orb.research(1)} in your inventory`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return powerUps.research.count > 4 || build.isExperimentSelection
                },
                requires: "at least 5 research",
                effect() {
                    tech.isRerollDamage = true;
                },
                remove() {
                    tech.isRerollDamage = false;
                }
            },
            {
                name: "pseudoscience",
                description: "<span style = 'font-size:94%;'>when <strong>selecting</strong> a power up, <strong class='color-r'>research</strong> <strong>3</strong> times</span><br>for <strong>free</strong>, but add <strong>0-3</strong> <strong class='color-j'>JUNK</strong> to the <strong class='color-m'>tech</strong> pool",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isResearchReality //tech.isResearchBoss || tech.isMetaAnalysis || tech.isRerollBots || tech.isDeathAvoid || tech.isRerollDamage || build.isExperimentSelection
                },
                requires: "not Ψ(t) collapse", //"abiogenesis, meta-analysis, bot fabrication, anthropic principle, or Bayesian statistics, not Ψ(t) collapse",
                effect() {
                    tech.isJunkResearch = true;
                },
                remove() {
                    tech.isJunkResearch = false;
                }
            },
            {
                name: "Born rule",
                description: "<strong>remove</strong> all current <strong class='color-m'>tech</strong><br>spawn new <strong class='color-m'>tech</strong> to replace them",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return (tech.totalCount > 6)
                },
                requires: "more than 6 tech",
                effect: () => {
                    //remove active bullets  //to get rid of bots
                    for (let i = 0; i < bullet.length; ++i) Matter.Composite.remove(engine.world, bullet[i]);
                    bullet = [];
                    let count = 1 //count tech
                    for (let i = 0, len = tech.tech.length; i < len; i++) { // spawn new tech power ups
                        if (!tech.tech[i].isNonRefundable) count += tech.tech[i].count
                    }
                    if (tech.isDeterminism) count -= 4 //remove the bonus tech 
                    if (tech.isSuperDeterminism) count -= 4 //remove the bonus tech 

                    tech.setupAllTech(); // remove all tech
                    if (simulation.isCheating) tech.setCheating();
                    lore.techCount = 0;
                    // tech.addLoreTechToPool();
                    for (let i = 0; i < count; i++) powerUps.spawn(m.pos.x + 100 * (Math.random() - 0.5), m.pos.y + 100 * (Math.random() - 0.5), "tech"); // spawn new tech power ups
                    //have state is checked in m.death()
                },
                remove() {}
            },
            {
                name: "abiogenesis",
                description: `at the start of a level spawn a 2nd <strong>boss</strong><br>use ${powerUps.orb.research(4)}or add <strong>49</strong> <strong class='color-j'>JUNK</strong> to the <strong class='color-m'>tech</strong> pool`,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (build.isExperimentSelection || powerUps.research.count > 3) && !tech.isDuplicateBoss
                },
                requires: "at least 4 research and not parthenogenesis",
                effect() {
                    tech.isResearchBoss = true; //abiogenesis
                },
                remove() {
                    tech.isResearchBoss = false;
                }
            },
            {
                name: "bubble fusion",
                description: `after destroying a mob's natural <strong>shield</strong><br>spawn <strong>1-2</strong> ${powerUps.orb.heal()}, ${powerUps.orb.ammo()}, or ${powerUps.orb.research(1)}`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    tech.isShieldAmmo = true;
                },
                remove() {
                    tech.isShieldAmmo = false;
                }
            },
            {
                name: "meta-analysis",
                description: `if you choose a <strong class='color-j'>JUNK</strong> <strong class='color-m'>tech</strong> you instead get a<br>random normal <strong class='color-m'>tech</strong> and ${powerUps.orb.research(3)}`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.duplicateChance
                },
                requires: "replication",
                effect() {
                    tech.isMetaAnalysis = true
                },
                remove() {
                    tech.isMetaAnalysis = false
                }
            },
            {
                name: "replication",
                description: "<strong>10%</strong> chance to <strong class='color-dup'>duplicate</strong> spawned <strong>power ups</strong><br><strong>+30</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.duplicationChance() < 1
                },
                requires: "below 100% duplication chance",
                effect() {
                    tech.duplicateChance += 0.1
                    powerUps.setDo(); //needed after adjusting duplication chance
                    tech.addJunkTechToPool(30)
                },
                remove() {
                    tech.duplicateChance = 0
                    powerUps.setDo(); //needed after adjusting duplication chance
                    if (this.count > 1) tech.removeJunkTechFromPool(30)
                }
            },
            {
                name: "stimulated emission",
                description: "<strong>17%</strong> chance to <strong class='color-dup'>duplicate</strong> spawned <strong>power ups</strong><br>but, after a <strong>collision</strong> eject <strong>1</strong> <strong class='color-m'>tech</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.duplicationChance() < 1
                },
                requires: "below 100% duplication chance",
                effect: () => {
                    tech.isStimulatedEmission = true
                    powerUps.setDo(); //needed after adjusting duplication chance
                },
                remove() {
                    tech.isStimulatedEmission = false
                    powerUps.setDo(); //needed after adjusting duplication chance
                }
            },
            {
                name: "metastability",
                description: "<strong>13%</strong> chance to <strong class='color-dup'>duplicate</strong> spawned <strong>power ups</strong><br><strong class='color-dup'>duplicates</strong> <strong class='color-e'>explode</strong> with a <strong>3</strong> second <strong>half-life</strong> ",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.duplicationChance() < 1
                },
                requires: "below 100% duplication chance",
                effect: () => {
                    tech.isPowerUpsVanish = true
                    powerUps.setDo(); //needed after adjusting duplication chance
                },
                remove() {
                    tech.isPowerUpsVanish = false
                    powerUps.setDo(); //needed after adjusting duplication chance
                }
            },
            {
                name: "futures exchange",
                description: "clicking <strong style = 'font-size:150%;'>×</strong> to <strong>cancel</strong> a <strong class='color-f'>field</strong>, <strong class='color-m'>tech</strong>, or <strong class='color-g'>gun</strong><br>adds <strong>4.5%</strong> power up <strong class='color-dup'>duplication</strong> chance",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.duplicationChance() < 1 && !tech.isDeterminism
                },
                requires: "below 100% duplication chance, not determinism",
                effect() {
                    tech.isCancelDuplication = true //search for tech.cancelCount  to balance
                    powerUps.setDo(); //needed after adjusting duplication chance
                },
                remove() {
                    tech.isCancelDuplication = false
                    powerUps.setDo(); //needed after adjusting duplication chance
                }
            },
            {
                name: "commodities exchange",
                description: `clicking <strong style = 'font-size:150%;'>×</strong> to cancel a <strong class='color-f'>field</strong>, <strong class='color-m'>tech</strong>, or <strong class='color-g'>gun</strong><br>spawns <strong>5-10</strong> ${powerUps.orb.heal()}, ${powerUps.orb.ammo()}, or ${powerUps.orb.research(1)}`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isDeterminism
                },
                requires: "not determinism",
                effect() {
                    tech.isCancelRerolls = true
                },
                remove() {
                    tech.isCancelRerolls = false
                }
            },
            {
                name: "correlated damage",
                description: "your chance to <strong class='color-dup'>duplicate</strong> power ups<br>increases your <strong class='color-d'>damage</strong> by the same percent",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.duplicationChance() > 0.15
                },
                requires: "duplication chance > 15%",
                effect() {
                    tech.isDupDamage = true;
                },
                remove() {
                    tech.isDupDamage = false;
                }
            },
            {
                name: "parthenogenesis",
                description: "levels have a chance to spawn a 2nd <strong>boss</strong><br>equal to <strong>double</strong> your <strong class='color-dup'>duplication</strong> chance",
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.duplicationChance() > 0 && !tech.isResearchBoss
                },
                requires: "some duplication chance, not abiogenesis",
                effect() {
                    tech.isDuplicateBoss = true;
                },
                remove() {
                    tech.isDuplicateBoss = false;
                }
            },
            {
                name: "apomixis",
                description: `immediately use ${powerUps.orb.research(11)} and if you<br>reach <strong>100%</strong> <strong class='color-dup'>duplication</strong> spawn <strong>8 bosses</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.duplicationChance() > 0.6 && powerUps.research.count > 10
                },
                requires: "duplication chance above 60%",
                effect() {
                    tech.is100Duplicate = true;
                    tech.maxDuplicationEvent()
                    for (let i = 0; i < 11; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                },
                remove() {
                    if (tech.is100Duplicate) {
                        tech.is100Duplicate = false;
                        if (this.count > 0) powerUps.research.changeRerolls(11)
                    }
                }
            },
            // {
            //     name: "zero point energy",
            //     description: "use <strong>2</strong> <strong class='color-r'>research</strong> to<br>increase your <strong>maximum</strong> <strong class='color-f'>energy</strong> by <strong>74</strong>",
            //     isFieldTech: true,
            //     maxCount: 1,
            //     count: 0,
            //     frequency: 3,
            //     frequencyDefault: 3,
            //     allowed() {
            //         return (m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics" || m.fieldUpgrades[m.fieldMode].name === "pilot wave") && (build.isExperimentSelection || powerUps.research.count > 1)
            //     },
            //     requires: "standing wave harmonics or pilot wave",
            //     effect() {
            //         tech.harmonicEnergy = 0.74
            //         m.setMaxEnergy()
            //         for (let i = 0; i < 2; i++) {
            //             if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
            //         }
            //     },
            //     remove() {
            //         tech.harmonicEnergy = 0;
            //         m.setMaxEnergy()
            //         if (this.count > 0) powerUps.research.changeRerolls(2)
            //     }
            // },
            {
                name: "exchange symmetry",
                description: "convert <strong>1</strong> random <strong class='color-m'>tech</strong> into <strong>3</strong> new <strong class='color-g'>guns</strong><br><em>recursive tech lose all stacks</em>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return (tech.totalCount > 3) && !tech.isSuperDeterminism
                },
                requires: "at least 4 tech, not superdeterminism",
                effect: () => {
                    const have = [] //find which tech you have
                    for (let i = 0; i < tech.tech.length; i++) {
                        if (tech.tech[i].count > 0) have.push(i)
                    }
                    const choose = have[Math.floor(Math.random() * have.length)]
                    simulation.makeTextLog(`<span class='color-var'>tech</span>.remove("<span class='color-text'>${tech.tech[choose].name}</span>")`)
                    for (let i = 0; i < tech.tech[choose].count; i++) {
                        powerUps.spawn(m.pos.x, m.pos.y, "gun");
                    }
                    powerUps.spawn(m.pos.x, m.pos.y, "gun");
                    powerUps.spawn(m.pos.x, m.pos.y, "gun");
                    tech.tech[choose].count = 0;
                    tech.tech[choose].remove(); // remove a random tech form the list of tech you have
                    tech.tech[choose].isLost = true
                    simulation.updateTechHUD();
                },
                remove() {}
            },
            {
                name: "monte carlo experiment",
                description: "spawn <strong>2</strong> <strong class='color-m'>tech</strong><br>remove <strong>1</strong> random <strong class='color-m'>tech</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return (tech.totalCount > 3) && !tech.isSuperDeterminism && tech.duplicationChance() > 0
                },
                requires: "at least 4 tech, a chance to duplicate power ups, not superdeterminism",
                effect: () => {
                    const removeTotal = powerUps.removeRandomTech()
                    for (let i = 0; i < removeTotal + 1; i++) powerUps.spawn(m.pos.x + 60 * (Math.random() - 0.5), m.pos.y + 60 * (Math.random() - 0.5), "tech");
                },
                remove() {}
            },
            {
                name: "strange attractor",
                description: `use ${powerUps.orb.research(2)} to spawn <strong>1</strong> <strong class='color-m'>tech</strong><br>with <strong>double</strong> your <strong class='color-dup'>duplication</strong> chance`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return !tech.isSuperDeterminism && tech.duplicationChance() > 0 && powerUps.research.count > 1
                },
                requires: "at least 2 research, not super determinism",
                effect: () => {
                    powerUps.research.changeRerolls(-2)
                    simulation.makeTextLog(`<span class='color-var'>m</span>.<span class='color-r'>research</span> <span class='color-symbol'>-=</span> 2<br>${powerUps.research.count}`)
                    const chanceStore = tech.duplicateChance
                    tech.duplicateChance = (tech.isStimulatedEmission ? 0.2 : 0) + tech.cancelCount * 0.045 + m.duplicateChance + tech.duplicateChance * 2 //increase duplication chance to simulate doubling all 3 sources of duplication chance
                    powerUps.spawn(m.pos.x, m.pos.y, "tech");
                    tech.duplicateChance = chanceStore
                },
                remove() {}
            },
            {
                name: "vector fields",
                description: "</strong>double</strong> the <strong class='flicker'>frequency</strong> of finding <strong class='color-f'>field</strong> <strong class='color-m'>tech</strong><br>spawn a <strong class='color-f'>field</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return !tech.isSuperDeterminism
                },
                requires: "not superdeterminism",
                effect() {
                    powerUps.spawn(m.pos.x, m.pos.y, "field");
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (tech.tech[i].isFieldTech) tech.tech[i].frequency *= 2
                    }
                },
                remove() {
                    // if (this.count > 1) {
                    //     for (let i = 0, len = tech.tech.length; i < len; i++) {
                    //         if (tech.tech[i].isFieldTech) tech.tech[i].frequency /= 2
                    //     }
                    // }
                }
            },
            {
                name: "reinforcement learning",
                description: "increase the <strong class='flicker'>frequency</strong> of finding copies of<br>recursive <strong class='color-m'>tech</strong> you already have by <strong>1000%</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.totalCount > 9
                },
                requires: "at least 10 tech",
                effect: () => {
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (tech.tech[i].count > 0) tech.tech[i].frequency *= 10
                    }
                },
                remove() {
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (tech.tech[i].count > 0 && tech.tech[i].frequency > 1) tech.tech[i].frequency /= 10
                    }
                }
            },
            {
                name: "backward induction",
                description: `use ${powerUps.orb.research(2)} to <strong>choose</strong> all the unchosen<br> <strong class='color-m'>tech</strong> from your previous <strong class='color-m'>tech</strong> selection`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isNonRefundable: true,
                isBadRandomOption: true,
                allowed() {
                    return powerUps.tech.choiceLog.length > 10 && !tech.isDeterminism && powerUps.research.count > 1
                },
                requires: "rejected an option in the last tech selection, at least 2 research, not determinism",
                effect: () => {
                    powerUps.research.changeRerolls(-2)
                    let num = 3
                    if (tech.isExtraChoice) num = 5
                    if (tech.isDeterminism) num = 1
                    for (let i = 0; i < num; i++) {
                        const index = powerUps.tech.choiceLog[powerUps.tech.choiceLog.length - i - 1]
                        if (index !== powerUps.lastTechIndex && tech.tech[index].count < tech.tech[index].maxCount && tech.tech[index].allowed() && tech.tech[index].name !== "backward induction") {
                            tech.giveTech(index)
                            simulation.makeTextLog(`<span class='color-var'>tech</span>.giveTech("<span class='color-text'>${tech.tech[index].name}</span>") <em> //backward induction</em>`);
                        }
                    }
                },
                remove() {}
            },
            {
                name: "unified field theory",
                description: `spawn ${powerUps.orb.research(6)}and when <strong>paused</strong><br><strong>clicking</strong> the <strong class='color-f'>field</strong> box switches your <strong class='color-f'>field</strong>`,
                // description: `in the <strong>pause</strong> menu, change your <strong class='color-f'>field</strong><br>by <strong>clicking</strong> on your <strong class='color-f'>field's</strong> box`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isSuperDeterminism
                },
                requires: "not superdeterminism",
                effect() {
                    tech.isGunSwitchField = true;
                    for (let i = 0; i < 6; i++) powerUps.spawn(m.pos.x + 40 * (Math.random() - 0.5), m.pos.y + 40 * (Math.random() - 0.5), "research", false);
                },
                remove() {
                    if (tech.isGunSwitchField) {
                        tech.isGunSwitchField = false;
                        powerUps.research.changeRerolls(-6)
                    }
                }
            },
            {
                name: "cross disciplinary",
                description: "<strong class='color-m'>tech</strong> have an extra <strong class='color-f'>field</strong> or <strong class='color-g'>gun</strong> <strong>choice</strong>", //<br><strong>+7</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool  //<br>spawn <strong>2</strong> <strong class='color-r'>research</strong>
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isDeterminism
                },
                requires: "not determinism",
                effect: () => {
                    tech.isExtraGunField = true;
                    // for (let i = 0; i < 2; i++) powerUps.spawn(m.pos.x + 40 * (Math.random() - 0.5), m.pos.y + 40 * (Math.random() - 0.5), "research", false);

                },
                remove() {
                    tech.isExtraGunField = false;
                    // if (this.count > 0) powerUps.research.changeRerolls(-2)
                }
            },
            {
                name: "emergence",
                description: "<strong class='color-m'>tech</strong>, <strong class='color-f'>fields</strong>, and <strong class='color-g'>guns</strong> have <strong>5</strong> <strong>choices</strong><br><strong>+5</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return !tech.isDeterminism
                },
                requires: "not determinism",
                effect: () => {
                    tech.isExtraChoice = true;
                    tech.addJunkTechToPool(5)
                },
                remove() {
                    tech.isExtraChoice = false;
                    if (this.count > 0) tech.removeJunkTechFromPool(5)
                }
            },
            {
                name: "determinism",
                description: "spawn <strong>5</strong> <strong class='color-m'>tech</strong>, but you have <strong>no cancel</strong><br>and <strong>1 choice</strong> for <strong class='color-m'>tech</strong>, <strong class='color-f'>fields</strong>, and <strong class='color-g'>guns</strong>",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBadRandomOption: true,
                allowed() {
                    return !tech.isExtraChoice && !tech.isCancelDuplication && !tech.isCancelRerolls
                },
                requires: "not emergence, not futures or commodities exchanges",
                effect: () => {
                    tech.isDeterminism = true;
                    //if you change the number spawned also change it in Born rule
                    for (let i = 0; i < 5; i++) powerUps.spawn(m.pos.x + 60 * (Math.random() - 0.5), m.pos.y + 60 * (Math.random() - 0.5), "tech");
                },
                remove() {
                    if (tech.isDeterminism) {
                        tech.isDeterminism = false;
                        for (let i = 0; i < 5; i++) powerUps.removeRandomTech()
                    }
                }
            },
            {
                name: "superdeterminism",
                description: `spawn <strong>5</strong> <strong class='color-m'>tech</strong><br>${powerUps.orb.research(1)}, <strong class='color-g'>guns</strong>, and <strong class='color-f'>fields</strong> no longer <strong>spawn</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 8,
                frequencyDefault: 8,
                isBadRandomOption: true,
                allowed() {
                    return tech.isDeterminism && !tech.isAnsatz && !tech.isGunSwitchField
                },
                requires: "determinism, not unified field theory, not ansatz",
                effect: () => {
                    tech.isSuperDeterminism = true;
                    //if you change the number spawned also change it in Born rule
                    for (let i = 0; i < 5; i++) powerUps.spawn(m.pos.x + 60 * (Math.random() - 0.5), m.pos.y + 60 * (Math.random() - 0.5), "tech");
                },
                remove() {
                    tech.isSuperDeterminism = false;
                    for (let i = 0; i < 5; i++) powerUps.removeRandomTech()
                }
            },
            {
                name: "dark patterns",
                description: "reduce combat <strong>difficulty</strong> by <strong>1 level</strong><br><strong>+31</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return level.onLevel < 8 && level.onLevel > 0
                },
                requires: "on levels 1 through 7",
                effect() {
                    level.difficultyDecrease(simulation.difficultyMode)
                    // simulation.difficulty<span class='color-symbol'>-=</span>
                    simulation.makeTextLog(`level.difficultyDecrease(simulation.difficultyMode)`)
                    tech.addJunkTechToPool(31)
                    // for (let i = 0; i < tech.junk.length; i++) tech.tech.push(tech.junk[i])
                },
                remove() {
                    if (this.count > 0) {
                        tech.removeJunkTechFromPool(31)
                        level.difficultyIncrease(simulation.difficultyMode)
                    }
                }
            },
            {
                name: "ergodicity",
                description: `reduce combat <strong>difficulty</strong> by <strong>2 levels</strong><br>${powerUps.orb.heal()} have <strong>no</strong> effect`,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return level.onLevel > 1 && !tech.isEnergyHealth
                },
                requires: "past levels 1, not mass-energy",
                effect() {
                    tech.isNoHeals = true;
                    level.difficultyDecrease(simulation.difficultyMode * 2)
                    simulation.makeTextLog(`level.difficultyDecrease(simulation.difficultyMode <span class='color-symbol'>*</span> 2)`)
                    powerUps.heal.color = "#abb"
                    for (let i = 0; i < powerUp.length; i++) { //find active heal power ups and adjust color live
                        if (powerUp[i].name === "heal") powerUp[i].color = powerUps.heal.color
                    }
                },
                remove() {
                    if (tech.isNoHeals) {
                        powerUps.heal.color = "#0eb"
                        for (let i = 0; i < powerUp.length; i++) { //find active heal power ups and adjust color live
                            if (powerUp[i].name === "heal") powerUp[i].color = powerUps.heal.color
                        }
                    }
                    tech.isNoHeals = false;
                    if (this.count > 0) level.difficultyIncrease(simulation.difficultyMode * 2)
                }
            },
            //************************************************** 
            //************************************************** gun
            //************************************************** tech
            //**************************************************
            {
                name: "CPT gun",
                description: `adds the <strong>CPT</strong> <strong class='color-g'>gun</strong> to your inventory<br>it <strong>rewinds</strong> your <strong class='color-h'>health</strong>, <strong>velocity</strong>, and <strong>position</strong>`,
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (b.totalBots() > 3 || m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" || m.fieldUpgrades[m.fieldMode].name === "plasma torch" || m.fieldUpgrades[m.fieldMode].name === "pilot wave") && !tech.isEnergyHealth && !tech.isRewindAvoidDeath //build.isExperimentSelection ||
                },
                requires: "bots > 3, plasma torch, nano-scale, pilot wave, not mass-energy equivalence, CPT",
                effect() {
                    tech.isRewindGun = true
                    b.guns.push(b.gunRewind)
                    b.giveGuns("CPT gun");
                },
                remove() {
                    if (tech.isRewindGun) {
                        b.removeGun("CPT gun", true)
                        // for (let i = 0; i < b.guns.length; i++) {
                        //     if (b.guns[i].name === "CPT gun") {
                        //         b.guns[i].have = false
                        //         for (let j = 0; j < b.inventory.length; j++) {
                        //             if (b.inventory[j] === i) {
                        //                 b.inventory.splice(j, 1)
                        //                 break
                        //             }
                        //         }
                        //         if (b.inventory.length) {
                        //             b.activeGun = b.inventory[0];
                        //         } else {
                        //             b.activeGun = null;
                        //         }
                        //         simulation.makeGunHUD();

                        //         b.guns.splice(i, 1) //also remove CPT gun from gun pool array
                        //         break
                        //     }
                        // }
                        tech.isRewindGun = false
                    }
                }
            },
            {
                name: "needle gun",
                description: "<strong>nail gun</strong> fires <strong>3</strong> mob piercing <strong>needles</strong><br>requires <strong>3</strong> times more <strong>bullets</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("nail gun") && !tech.nailInstantFireRate && !tech.isIceCrystals && !tech.isRivets
                },
                requires: "nail gun, not ice crystal, rivets, or pneumatic actuator",
                effect() {
                    tech.isNeedles = true
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "nail gun") {
                            b.guns[i].ammo = Math.ceil(b.guns[i].ammo / 3);
                            b.guns[i].ammoPack = Math.ceil(b.guns[i].defaultAmmoPack / 3);
                            b.guns[i].chooseFireMethod()
                            simulation.updateGunHUD();
                            break
                        }
                    }
                },
                remove() {
                    if (tech.isNeedles) {
                        tech.isNeedles = false
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "nail gun") {
                                b.guns[i].chooseFireMethod()
                                b.guns[i].ammo = Math.ceil(b.guns[i].ammo * 3);
                                b.guns[i].ammoPack = b.guns[i].defaultAmmoPack;
                                simulation.updateGunHUD();
                                break
                            }
                        }
                    }
                }
            },
            {
                name: "ceramics",
                description: `<strong>needles</strong> and <strong>harpoons</strong> pierce <strong>shields</strong><br>directly <strong class='color-d'>damaging</strong> shielded mobs`,
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("harpoon") || (tech.isNeedles || tech.isNeedleShot)
                },
                requires: "needle gun, needle-shot, harpoon",
                effect() {
                    tech.isNeedleShieldPierce = true
                },
                remove() {
                    tech.isNeedleShieldPierce = false
                }
            },
            {
                name: "rivet gun",
                description: "<strong>nail gun</strong> slowly fires a heavy <strong>rivet</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("nail gun") && !tech.nailInstantFireRate && !tech.isIceCrystals && !tech.isNeedles
                },
                requires: "nail gun, not ice crystal, needles, or pneumatic actuator",
                effect() {
                    tech.isRivets = true
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "nail gun") {
                            b.guns[i].chooseFireMethod()
                            break
                        }
                    }
                },
                remove() {
                    if (tech.isRivets) {
                        tech.isRivets = false
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "nail gun") {
                                b.guns[i].chooseFireMethod()
                                break
                            }
                        }
                    }
                }
            },
            {
                name: "rivet diameter",
                description: `<strong>rivets</strong> are <strong>20%</strong> larger<br>increases mass and physical <strong class='color-d'>damage</strong>`,
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isRivets
                },
                requires: "rivet gun",
                effect() {
                    tech.rivetSize += 0.2
                },
                remove() {
                    tech.rivetSize = 1;
                }
            },
            {
                name: "ice crystal nucleation",
                description: "the <strong>nail gun</strong> uses <strong class='color-f'>energy</strong> to condense<br>unlimited <strong class='color-s'>freezing</strong> <strong>ice shards</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("nail gun") && !tech.isRivets && !tech.isNeedles // && !tech.isNailRadiation && !tech.isNailCrit
                },
                requires: "nail gun, not rivets, needles",
                effect() {
                    tech.isIceCrystals = true;
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "nail gun") {
                            b.guns[i].ammoPack = Infinity
                            b.guns[i].recordedAmmo = b.guns[i].ammo
                            b.guns[i].ammo = Infinity
                            simulation.updateGunHUD();
                            break;
                        }
                    }
                },
                remove() {
                    if (tech.isIceCrystals) {
                        tech.isIceCrystals = false;
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "nail gun") {
                                b.guns[i].ammoPack = b.guns[i].defaultAmmoPack;
                                if (b.guns[i].recordedAmmo) b.guns[i].ammo = b.guns[i].recordedAmmo
                                simulation.updateGunHUD();
                                break;
                            }
                        }
                    }
                }
            },
            {
                name: "pneumatic actuator",
                description: "<strong>nail gun</strong> takes <strong>no</strong> time to ramp up<br>to it's shortest <strong><em>delay</em></strong> after firing",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("nail gun") && !tech.isRivets && !tech.isNeedles
                },
                requires: "nail gun, not rivets or needles",
                effect() {
                    tech.nailInstantFireRate = true
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "nail gun") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    if (tech.nailInstantFireRate) {
                        tech.nailInstantFireRate = false
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "nail gun") b.guns[i].chooseFireMethod()
                        }
                    }
                }
            },
            // {
            //     name: "powder-actuated",
            //     description: "<strong>nail gun</strong> takes <strong>no</strong> time to ramp up<br>nails have a <strong>30%</strong> faster muzzle <strong>speed</strong>",
            //     isGunTech: true,
            //     maxCount: 1,
            //     count: 0,
            //     frequency: 2,
            //     frequencyDefault: 2,
            //     allowed() {
            //         return tech.haveGunCheck("nail gun") && tech.nailFireRate && !tech.isIceCrystals
            //     },
            //     requires: "nail gun and pneumatic actuator not ice crystal nucleation",
            //     effect() {
            //         tech.nailInstantFireRate = true
            //         for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
            //             if (b.guns[i].name === "nail gun") b.guns[i].chooseFireMethod()
            //         }
            //     },
            //     remove() {
            //         if (tech.nailInstantFireRate) {
            //             tech.nailInstantFireRate = false
            //             for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
            //                 if (b.guns[i].name === "nail gun") b.guns[i].chooseFireMethod()
            //             }
            //         }
            //     }
            // },
            {
                name: "supercritical fission",
                description: "<strong>nails</strong>, <strong>needles</strong>, and <strong>rivets</strong> can <strong class='color-e'>explode</strong><br>if they strike mobs near their <strong>center</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.isNailShot || tech.isNeedleShot || tech.nailBotCount > 1 || tech.haveGunCheck("nail gun"))
                },
                requires: "nails",
                effect() {
                    tech.isNailCrit = true
                },
                remove() {
                    tech.isNailCrit = false
                }
            },
            {
                name: "irradiated nails",
                description: "<strong>nails</strong>, <strong>needles</strong>, and <strong>rivets</strong> are <strong class='color-p'>radioactive</strong><br>about <strong>90%</strong> more <strong class='color-d'>damage</strong> over <strong>2</strong> seconds",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isMineDrop + tech.nailBotCount + tech.fragments + tech.nailsDeathMob / 2 + ((tech.haveGunCheck("mine") && !tech.isLaserMine) + (tech.haveGunCheck("nail gun") && !tech.isNeedleShieldPierce) + tech.isNeedleShot + tech.isNailShot) * 2 > 1
                },
                requires: "nails, rivets, not ceramic needles",
                effect() {
                    tech.isNailRadiation = true;
                },
                remove() {
                    tech.isNailRadiation = false;
                }
            },
            {
                name: "4s half-life",
                description: "<strong>nails</strong> are made of <strong class='color-p'>plutonium-238</strong><br>increase <strong class='color-d'>damage</strong> by <strong>100%</strong> over <strong>6</strong> seconds",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isNailRadiation && !tech.isFastRadiation
                },
                requires: "irradiated nails, not 1/2s half-life",
                effect() {
                    tech.isSlowRadiation = true;
                },
                remove() {
                    tech.isSlowRadiation = false;
                }
            },
            {
                name: "1/2s half-life",
                description: "<strong>nails</strong> are made of <strong class='color-p'>lithium-8</strong><br><strong class='color-d'>damage</strong> occurs after <strong>1/2</strong> a second",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isNailRadiation && !tech.isSlowRadiation
                },
                requires: "irradiated nails, not 4s half-life",
                effect() {
                    tech.isFastRadiation = true;
                },
                remove() {
                    tech.isFastRadiation = false;
                }
            },
            {
                name: "shotgun spin-statistics",
                description: "<strong>immune</strong> to <strong class='color-harm'>harm</strong> while firing the <strong>shotgun</strong><br>shotgun has <strong>50%</strong> fewer shots",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun")
                },
                requires: "shotgun",
                effect() {
                    tech.isShotgunImmune = true;

                    //cut current ammo by 1/2
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "shotgun") {
                            b.guns[i].ammo = Math.ceil(b.guns[i].ammo * 0.5);
                            b.guns[i].ammoPack = b.guns[i].defaultAmmoPack * 0.5
                            break;
                        }
                    }
                    simulation.updateGunHUD();
                },
                remove() {
                    if (tech.isShotgunImmune) {
                        tech.isShotgunImmune = false;
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "shotgun") {
                                b.guns[i].ammoPack = b.guns[i].defaultAmmoPack;
                                b.guns[i].ammo = Math.ceil(b.guns[i].ammo * 2);
                                break;
                            }
                        }
                        simulation.updateGunHUD();
                    }
                }
            },
            {
                name: "Newton's 3rd law",
                description: "<strong>shotgun</strong> <strong>recoil</strong> is increased<br>decrease <strong>shotgun</strong> <strong><em>delay</em></strong> after firing by <strong>66%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun") && !tech.isShotgunReversed
                },
                requires: "shotgun, not Noether violation",
                effect() {
                    tech.isShotgunRecoil = true;
                },
                remove() {
                    tech.isShotgunRecoil = false;
                }
            },
            {
                name: "Noether violation",
                description: "increase <strong>shotgun</strong> and <strong>rail gun</strong> <strong class='color-d'>damage</strong> <strong>60%</strong><br>their <strong>recoil</strong> is increased and <strong>reversed</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.haveGunCheck("shotgun") || tech.haveGunCheck("rail gun")) && !tech.isShotgunRecoil
                },
                requires: "shotgun or rail gun, not Newton's 3rd law",
                effect() {
                    tech.isShotgunReversed = true;
                },
                remove() {
                    tech.isShotgunReversed = false;
                }
            },
            {
                name: "shotgun slug",
                description: "<strong>shotgun</strong> lobs <strong>1</strong> huge <strong>bullet</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun") && !tech.isNailShot && !tech.isIncendiary && !tech.isIceShot && !tech.isFoamShot && !tech.isWormShot && !tech.isNeedleShot
                },
                requires: "shotgun, not nail-shot, foam-shot, worm-shot, ice-shot",
                effect() {
                    tech.isSlugShot = true;
                },
                remove() {
                    tech.isSlugShot = false;
                }
            },
            {
                name: "nail-shot",
                description: "<strong>shotgun</strong> fires <strong>17</strong> <strong>nails</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun") && !tech.isIncendiary && !tech.isSlugShot && !tech.isIceShot && !tech.isFoamShot && !tech.isWormShot && !tech.isNeedleShot
                },
                requires: "shotgun, not incendiary, slug, foam-shot, worm-shot, ice-shot",
                effect() {
                    tech.isNailShot = true;
                },
                remove() {
                    tech.isNailShot = false;
                }
            },
            {
                name: "needle-shot",
                description: "<strong>shotgun</strong> propels <strong>11</strong> mob piercing <strong>needles</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun") && !tech.isNailShot && !tech.isIncendiary && !tech.isSlugShot && !tech.isFoamShot && !tech.isWormShot && !tech.isIceShot
                },
                requires: "shotgun, not incendiary, nail-shot, slug, foam-shot, worm-shot, ice-shot",
                effect() {
                    tech.isNeedleShot = true;
                },
                remove() {
                    tech.isNeedleShot = false;
                }
            },
            {
                name: "worm-shot",
                description: "<strong>shotgun</strong> hatches <strong>3-4</strong> mob seeking <strong class='color-p' style='letter-spacing: -0.8px;'>worms</strong><br><em>worms benefit from spore technology</em>", //<br><strong class='color-p' style='letter-spacing: -0.8px;'>worms</strong> seek out nearby mobs
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun") && !tech.isNailShot && !tech.isIncendiary && !tech.isSlugShot && !tech.isIceShot && !tech.isFoamShot && !tech.isNeedleShot
                },
                requires: "shotgun, not incendiary, nail-shot, slug, foam-shot, ice-shot",
                effect() {
                    tech.isWormShot = true;
                },
                remove() {
                    tech.isWormShot = false;
                }
            },
            {
                name: "foam-shot",
                description: "<strong>shotgun</strong> sprays <strong>13</strong> sticky <strong>foam</strong> bubbles",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun") && !tech.isNailShot && !tech.isIncendiary && !tech.isSlugShot && !tech.isIceShot && !tech.isWormShot && !tech.isNeedleShot
                },
                requires: "shotgun, not incendiary, nail-shot, slug, worm-shot, ice-shot",
                effect() {
                    tech.isFoamShot = true;
                },
                remove() {
                    tech.isFoamShot = false;
                }
            },
            {
                name: "ice-shot",
                description: "<strong>shotgun</strong> grows <strong>15</strong> freezing <strong class='color-s'>ice IX</strong> crystals",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("shotgun") && !tech.isNailShot && !tech.isIncendiary && !tech.isSlugShot && !tech.isFoamShot && !tech.isWormShot && !tech.isNeedleShot
                },
                requires: "shotgun, not incendiary, nail-shot, slug, foam-shot, worm-shot",
                effect() {
                    tech.isIceShot = true;
                },
                remove() {
                    tech.isIceShot = false;
                }
            },
            {
                name: "supertemporal",
                description: "fire <strong>super ball</strong> from the same point in <strong>space</strong><br> but separated by <strong>0.1</strong> seconds in <strong>time</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("super balls") && !tech.oneSuperBall
                },
                requires: "super balls, but not the tech super ball",
                effect() {
                    tech.superBallDelay = true
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "super balls") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    if (tech.superBallDelay) {
                        tech.superBallDelay = false;
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "super balls") b.guns[i].chooseFireMethod()
                        }
                    }
                }
            },
            {
                name: "super ball",
                description: "fire just <strong>1 large</strong> super <strong>ball</strong><br>that <strong>stuns</strong> mobs for <strong>3</strong> second",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("super balls") && tech.missileCount === 1 && !tech.superBallDelay
                },
                requires: "super balls, but not super duper or supertemporal",
                effect() {
                    tech.oneSuperBall = true;
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "super balls") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    if (tech.oneSuperBall) {
                        tech.oneSuperBall = false;
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "super balls") b.guns[i].chooseFireMethod()
                        }
                    }
                }
            },
            {
                name: "super sized",
                description: `increase <strong>super ball</strong> radius by <strong>17%</strong><br>increases <strong class='color-d'>damage</strong> by about <strong>35%</strong>`,
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("super balls")
                },
                requires: "super balls",
                effect() {
                    tech.bulletSize += 0.17
                },
                remove() {
                    tech.bulletSize = 1;
                }
            },
            {
                name: "phase velocity",
                description: "wave beam <strong>propagates</strong> faster through <strong>solids</strong><br>increase wave beam <strong class='color-d'>damage</strong> by <strong>15%</strong>",
                // description: "wave beam <strong>propagates</strong> faster through <strong>solids</strong><br>up by <strong>3000%</strong> in the map and <strong>760%</strong> in <strong class='color-block'>blocks</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("wave beam") && !tech.isLongitudinal
                },
                requires: "wave beam, not phonon",
                effect() {
                    tech.isPhaseVelocity = true;
                },
                remove() {
                    tech.isPhaseVelocity = false;
                }
            },
            {
                name: "bound state",
                description: "wave packets <strong>reflect</strong> backwards <strong>2</strong> times<br><strong>range</strong> is reduced by <strong>25%</strong>",
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("wave beam")
                },
                requires: "wave beam",
                effect() {
                    tech.waveReflections += 2
                },
                remove() {
                    tech.waveReflections = 1
                }
            },
            {
                name: "amplitude",
                description: "wave packet <strong>amplitude</strong> is <strong>33%</strong> higher<br>wave <strong class='color-d'>damage</strong> is increased by <strong>50%</strong>",
                isGunTech: true,
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("wave beam")
                },
                requires: "wave beam",
                effect() {
                    tech.waveFrequency *= 0.66
                    tech.wavePacketDamage *= 1.5
                },
                remove() {
                    tech.waveFrequency = 0.2
                    tech.wavePacketDamage = 1
                }
            },
            {
                name: "propagation",
                description: "wave packet propagation <strong>speed</strong> is <strong>20%</strong> slower<br>wave <strong class='color-d'>damage</strong> is increased by <strong>50%</strong>",
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("wave beam")
                },
                requires: "wave beam",
                effect() {
                    tech.waveBeamSpeed *= 0.8;
                    tech.waveBeamDamage += 1.5 * 0.5 //this sets base wave beam damage, not used by arcs or circles
                },
                remove() {
                    tech.waveBeamSpeed = 10;
                    tech.waveBeamDamage = 1.5 //this sets base wave beam damage, not used by arcs or circles
                }
            },
            {
                name: "phonon", //longitudinal  //gravitational wave?
                description: "wave beam emits low <strong>frequency</strong>, high <strong class='color-d'>damage</strong><br><strong>expanding arcs</strong> that propagate through <strong>solids</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.haveGunCheck("wave beam") && !tech.isPhaseVelocity && !tech.isBulletTeleport
                },
                requires: "wave beam, not phase velocity, uncertainty principle",
                effect() {
                    tech.isLongitudinal = true;
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "wave beam") {
                            b.guns[i].chooseFireMethod()
                            b.guns[i].ammoPack = b.guns[i].defaultAmmoPack / 8
                            b.guns[i].ammo = Math.ceil(b.guns[i].ammo / 8);
                            simulation.updateGunHUD();
                            break
                        }
                    }
                },
                remove() {
                    if (tech.isLongitudinal) {
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "wave beam") {
                                tech.isLongitudinal = false;
                                b.guns[i].chooseFireMethod()
                                b.guns[i].ammoPack = b.guns[i].defaultAmmoPack
                                b.guns[i].ammo = Math.ceil(b.guns[i].ammo * 8);
                                simulation.updateGunHUD();
                                break
                            }
                        }
                    }
                    tech.isLongitudinal = false;
                }
            },
            {
                name: "isotropic radiator",
                description: "<strong>wave beam</strong> expands in <strong>all</strong> directions<br><span style = 'font-size:90%;'><strong>range</strong> reduced <strong>40%</strong> and <strong class='color-d'>damage</strong> increased <strong>50%</strong></span>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.isLongitudinal
                },
                requires: "phonon",
                effect() {
                    tech.is360Longitudinal = true;
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "wave beam") {
                            b.guns[i].chooseFireMethod()
                            break
                        }
                    }
                },
                remove() {
                    tech.is360Longitudinal = false;
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "wave beam") {
                            b.guns[i].chooseFireMethod()
                            break
                        }
                    }
                }
            },
            {
                name: "cruise missile",
                description: "<strong>missiles</strong> travel <strong>63%</strong> slower,<br>but have a <strong>50%</strong> larger <strong class='color-e'>explosive</strong> payload",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("missiles") || tech.isMissileField || tech.missileBotCount
                },
                requires: "missiles",
                effect() {
                    tech.missileSize = true
                },
                remove() {
                    tech.missileSize = false
                }
            },
            {
                name: "missile-bot",
                description: "remove your <strong>missile gun</strong><br>gain a <strong class='color-bot'>bot</strong> that fires <strong>missiles</strong> at mobs",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return tech.haveGunCheck("missiles")
                },
                requires: "missiles",
                effect() {
                    tech.missileBotCount++;
                    b.missileBot();
                    if (tech.haveGunCheck("missiles")) b.removeGun("missiles") //remove your last gun
                },
                remove() {
                    if (this.count) {
                        tech.missileBotCount = 0;
                        b.clearPermanentBots();
                        b.respawnBots();
                        if (!tech.haveGunCheck("missiles")) b.giveGuns("missiles")
                    }
                }
            },
            {
                name: "MIRV",
                description: "fire <strong>+1</strong> <strong>missile</strong>, <strong>grenade</strong>, and <strong>super ball</strong><br>decrease <strong class='color-e'>explosion</strong> <strong>radius</strong> up to <strong>10%</strong>",
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("missiles") || tech.missileBotCount || tech.haveGunCheck("grenades") || (tech.haveGunCheck("super balls") && !tech.oneSuperBall)
                },
                requires: "missiles, grenades, super balls, not super ball",
                effect() {
                    tech.missileCount++;
                },
                remove() {
                    tech.missileCount = 1;
                }
            },
            {
                name: "rocket-propelled grenade",
                description: "<strong>grenades</strong> rapidly <strong>accelerate</strong> forward<br>map <strong>collisions</strong> trigger an <strong class='color-e'>explosion</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("grenades")
                },
                requires: "grenades",
                effect() {
                    tech.isRPG = true;
                    b.setGrenadeMode()
                },
                remove() {
                    tech.isRPG = false;
                    b.setGrenadeMode()
                }
            },
            {
                name: "vacuum bomb",
                description: "<strong>grenades</strong> fire slower, <strong class='color-e'>explode</strong> bigger<br> and, <strong>suck</strong> everything towards them",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("grenades") && !tech.isNeutronBomb
                },
                requires: "grenades, not neutron bomb",
                effect() {
                    tech.isVacuumBomb = true;
                    b.setGrenadeMode()
                },
                remove() {
                    tech.isVacuumBomb = false;
                    b.setGrenadeMode()
                }
            },
            {
                name: "chain reaction",
                description: "increase <strong>grenade</strong> radius and <strong class='color-d'>damage</strong> <strong>33%</strong><br><strong class='color-block'>blocks</strong> caught in <strong class='color-e'>explosions</strong> also <strong class='color-e'>explode</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return tech.isVacuumBomb && !tech.isExplodeRadio
                },
                requires: "vacuum bomb, not iridium-192",
                effect() {
                    tech.isBlockExplode = true; //chain reaction
                },
                remove() {
                    tech.isBlockExplode = false;
                }
            },
            {
                name: "neutron bomb",
                description: "<strong>grenades</strong> are <strong class='color-p'>irradiated</strong> with <strong class='color-p'>Cf-252</strong><br>does <strong class='color-d'>damage</strong>, <strong class='color-harm'>harm</strong>, and drains <strong class='color-f'>energy</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("grenades") && !tech.fragments && !tech.isVacuumBomb
                },
                requires: "grenades, not fragmentation, vacuum bomb",
                effect() {
                    tech.isNeutronBomb = true;
                    b.setGrenadeMode()
                },
                remove() {
                    tech.isNeutronBomb = false;
                    b.setGrenadeMode()
                }
            },
            {
                name: "vacuum permittivity",
                description: "increase <strong class='color-p'>radioactive</strong> range by <strong>20%</strong><br>objects in range of the bomb are <strong>slowed</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isNeutronBomb
                },
                requires: "neutron bomb",
                effect() {
                    tech.isNeutronSlow = true
                },
                remove() {
                    tech.isNeutronSlow = false
                }
            },
            {
                name: "booby trap",
                description: "drop a <strong>mine</strong> after picking up a <strong>power up</strong><br><strong>+53</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("mine")
                },
                requires: "mines, not mine reclamation",
                effect() {
                    tech.isMineDrop = true;
                    if (tech.isMineDrop) b.mine(m.pos, { x: 0, y: 0 }, 0)
                    tech.addJunkTechToPool(53)
                },
                remove() {
                    tech.isMineDrop = false;
                    if (this.count > 0) tech.removeJunkTechFromPool(53)
                }
            },
            {
                name: "laser-mines",
                description: "<strong>mines</strong> laid while you are <strong>crouched</strong><br>use <strong class='color-f'>energy</strong> to emit <strong>3</strong> unaimed <strong class='color-laser'>lasers</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("mine")
                },
                requires: "mines",
                effect() {
                    tech.isLaserMine = true;
                },
                remove() {
                    tech.isLaserMine = false;
                }
            },
            {
                name: "sentry",
                description: "instead of detonating, <strong>mines</strong> <strong>target</strong> mobs<br>with a stream of nails for about <strong>17</strong> seconds",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("mine")
                },
                requires: "mines",
                effect() {
                    tech.isMineSentry = true;
                },
                remove() {
                    tech.isMineSentry = false;
                }
            },
            {
                name: "blast mines",
                description: "when a <strong>mine</strong> <strong>activates</strong><br>it <strong>stuns</strong> nearby mobs for <strong>2-4</strong> seconds",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("mine")
                },
                requires: "mines",
                effect() {
                    tech.isMineStun = true;
                },
                remove() {
                    tech.isMineStun = false;
                }
            },
            {
                name: "mycelial fragmentation",
                description: "<strong class='color-p' style='letter-spacing: 2px;'>sporangium</strong> release <strong>6</strong> extra <strong class='color-p' style='letter-spacing: 2px;'>spores</strong><br>during their <strong>growth</strong> phase",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("spores")
                },
                requires: "spores",
                effect() {
                    tech.isSporeGrowth = true
                },
                remove() {
                    tech.isSporeGrowth = false
                }
            },
            {
                name: "tinsellated flagella",
                description: "<strong class='color-p' style='letter-spacing: 2px;'>sporangium</strong> release <strong>2</strong> more <strong class='color-p' style='letter-spacing: 2px;'>spores</strong><br><strong class='color-p' style='letter-spacing: 2px;'>spores</strong> accelerate <strong>40% faster</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("spores") || tech.sporesOnDeath > 0 || tech.isSporeField
                },
                requires: "spores",
                effect() {
                    tech.isFastSpores = true
                },
                remove() {
                    tech.isFastSpores = false
                }
            },
            {
                name: "cryodesiccation",
                description: "<strong class='color-p' style='letter-spacing: 2px;'>sporangium</strong> release <strong>2</strong> more <strong class='color-p' style='letter-spacing: 2px;'>spores</strong><br><strong class='color-p' style='letter-spacing: 2px;'>spores</strong> <strong class='color-s'>freeze</strong> mobs for <strong>1.5</strong> second",
                // <br><strong class='color-p' style='letter-spacing: 2px;'>spores</strong> do <strong>1/3</strong> <strong class='color-d'>damage</strong>
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("spores") || tech.sporesOnDeath > 0 || tech.isSporeField || tech.isWormShot
                },
                requires: "spores or worms",
                effect() {
                    tech.isSporeFreeze = true
                },
                remove() {
                    tech.isSporeFreeze = false
                }
            },
            {
                name: "diplochory",
                description: "<strong class='color-p' style='letter-spacing: 2px;'>spores</strong> use you for <strong>dispersal</strong><br>until they <strong>locate</strong> a viable host",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("spores") || tech.sporesOnDeath > 0 || tech.isSporeField || tech.isWormShot
                },
                requires: "spores or worms",
                effect() {
                    tech.isSporeFollow = true
                },
                remove() {
                    tech.isSporeFollow = false
                }
            },
            {
                name: "mutualism",
                description: "increase <strong class='color-p' style='letter-spacing: 2px;'>spore</strong> <strong class='color-d'>damage</strong> by <strong>150%</strong><br><strong class='color-p' style='letter-spacing: 2px;'>spores</strong> borrow <strong>0.5</strong> <strong class='color-h'>health</strong> until they <strong>die</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.haveGunCheck("spores") || tech.sporesOnDeath > 0 || tech.isSporeField) && !tech.isEnergyHealth || tech.isWormShot
                },
                requires: "spores, worms, not mass-energy",
                effect() {
                    tech.isMutualism = true
                },
                remove() {
                    tech.isMutualism = false
                }
            },
            {
                name: "nematodes",
                description: "<strong class='color-p' style='letter-spacing: 2px;'>spores</strong> develop into <strong>1/2</strong> as many <strong class='color-p' style='letter-spacing: -0.8px;'>worms</strong><br><strong class='color-p' style='letter-spacing: -0.8px;'>worms</strong> do <strong>250%</strong> more <strong class='color-d'>damage</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 4,
                frequencyDefault: 4,
                allowed() {
                    return tech.haveGunCheck("spores") || tech.sporesOnDeath > 0 || tech.isSporeField || tech.isWormholeSpores
                },
                requires: "spores",
                effect() {
                    tech.isSporeWorm = true
                },
                remove() {
                    tech.isSporeWorm = false
                }
            },
            {
                name: "necrophage",
                description: "if <strong class='color-p' style='letter-spacing: -0.8px;'>worms</strong> <strong>kill</strong> their target<br>they reset their <strong>lifespan</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isSporeWorm || tech.isWormShot
                },
                requires: "worms",
                effect() {
                    tech.wormSurviveDmg = true
                },
                remove() {
                    tech.wormSurviveDmg = false
                }
            },
            {
                name: "reduced tolerances",
                description: `increase <strong>drones</strong> per ${powerUps.orb.ammo()} or <strong class='color-f'>energy</strong> <strong>66%</strong><br>reduce the average <strong>drone</strong> lifetime by <strong>40%</strong>`,
                isGunTech: true,
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isDroneRadioactive && (tech.haveGunCheck("drones") || (m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" && !(tech.isSporeField || tech.isMissileField || tech.isIceField)))
                },
                requires: "drones, not irradiated drones",
                effect() {
                    tech.droneCycleReduction = Math.pow(0.6, 1 + this.count)
                    tech.droneEnergyReduction = Math.pow(0.333, 1 + this.count)
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "drones") {
                            const scale = Math.pow(3, this.count + 1)
                            b.guns[i].ammoPack = b.guns[i].defaultAmmoPack * scale
                        }
                    }
                },
                remove() {
                    tech.droneCycleReduction = 1
                    tech.droneEnergyReduction = 1
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "drones") b.guns[i].ammoPack = b.guns[i].defaultAmmoPack
                    }
                }
            },
            {
                name: "delivery drone",
                description: "if a <strong>drone</strong> picks up a <strong>power up</strong>,<br>it becomes <strong>larger</strong>, <strong>faster</strong>, and more <strong>durable</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isExtraMaxEnergy && (tech.haveGunCheck("drones") || (m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" && !(tech.isSporeField || tech.isMissileField || tech.isIceField)))
                },
                requires: "drones, not inductive coupling",
                effect() {
                    tech.isDroneGrab = true
                },
                remove() {
                    tech.isDroneGrab = false
                }
            },
            {
                name: "drone repair",
                description: "after a <strong>drone</strong> ends it <strong>redeploys</strong><br>for a <strong>25%</strong> chance to use <strong>1</strong> <strong>drone</strong> <strong class='color-ammo'>ammo</strong>",
                // description: "broken <strong>drones</strong> <strong>repair</strong> if the drone <strong class='color-g'>gun</strong> is active<br><strong>repairing</strong> has a <strong>25%</strong> chance to use <strong>1</strong> <strong>drone</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("drones")
                },
                requires: "drone gun",
                effect() {
                    tech.isDroneRespawn = true
                },
                remove() {
                    tech.isDroneRespawn = false
                }
            },
            {
                name: "torque bursts",
                description: "<strong>drones</strong> rapidly <strong>rush</strong> towards their target<br>increase <strong>drone</strong> collision <strong class='color-d'>damage</strong> by <strong>33%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return tech.haveGunCheck("drones") && !tech.isDroneRadioactive && !tech.isIncendiary
                },
                requires: "drone gun, not irradiated drones, incendiary",
                effect() {
                    tech.isDroneTeleport = true
                },
                remove() {
                    tech.isDroneTeleport = false
                }
            },
            {
                name: "brushless motor",
                description: "<strong>drones</strong> can <strong>rush</strong> <strong>66%</strong> more often<br>increase <strong>drone</strong> collision <strong class='color-d'>damage</strong> by <strong>44%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isDroneTeleport
                },
                requires: "torque bursts",
                effect() {
                    tech.isDroneFastLook = true
                },
                remove() {
                    tech.isDroneFastLook = false
                }
            },
            {
                name: "irradiated drones",
                description: `the space around <strong>drones</strong> is <strong class='color-p'>irradiated</strong><br>reduce <strong>drones</strong> per ${powerUps.orb.ammo()} or <strong class='color-f'>energy</strong> <strong>75%</strong>`,
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.droneCycleReduction === 1 && !tech.isIncendiary && !tech.isDroneTeleport && (tech.haveGunCheck("drones") || (m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" && !(tech.isSporeField || tech.isMissileField || tech.isIceField)))
                },
                requires: "drones, not reduced tolerances, incendiary, torque bursts",
                effect() {
                    tech.isDroneRadioactive = true
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "drones") {
                            b.guns[i].ammoPack = b.guns[i].defaultAmmoPack * 0.25
                            b.guns[i].ammo = Math.ceil(b.guns[i].ammo * 0.25)
                            simulation.makeGunHUD();
                        }
                    }
                },
                remove() {
                    if (tech.isDroneRadioactive) {
                        tech.isDroneRadioactive = false
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "drones") {
                                b.guns[i].ammoPack = b.guns[i].defaultAmmoPack
                                b.guns[i].ammo = b.guns[i].ammo * 4
                                simulation.makeGunHUD();
                            }
                        }
                    }
                }
            },
            {
                name: "beta radiation", //"control rod ejection",
                description: "reduce the average <strong>drone</strong> lifetime by <strong>50%</strong><br>increase <strong class='color-p'>radiation</strong> <strong class='color-d'>damage</strong> by <strong>100%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isDroneRadioactive
                },
                requires: "irradiated drones",
                effect() {
                    tech.droneRadioDamage = 2
                },
                remove() {
                    tech.droneRadioDamage = 1
                }
            },
            {
                name: "orthocyclic winding",
                description: "<strong>drones</strong> accelerate <strong>66%</strong> faster<br>increase <strong class='color-p'>radiation</strong> <strong class='color-d'>damage</strong> by <strong>33%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isDroneRadioactive
                },
                requires: "irradiated drones",
                effect() {
                    tech.isFastDrones = true
                },
                remove() {
                    tech.isFastDrones = false
                }
            },
            {
                name: "electrostatic induction",
                description: "<strong>foam</strong> bubbles are electrically charged<br>causing <strong>attraction</strong> to nearby <strong>mobs</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return !tech.isBulletTeleport && (tech.haveGunCheck("foam") || tech.foamBotCount > 1 || tech.isFoamShot)
                },
                requires: "foam, not uncertainty",
                effect() {
                    tech.isFoamAttract = true
                },
                remove() {
                    tech.isFoamAttract = false
                }
            },
            {
                name: "uncertainty principle",
                description: "<strong>foam</strong> and <strong>wave</strong> particle <strong>positions</strong> are random<br>increase their <strong class='color-d'>damage</strong> by <strong>50%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (!tech.isFoamAttract && (tech.haveGunCheck("foam") || tech.foamBotCount > 1 || tech.isFoamShot)) || (tech.haveGunCheck("wave beam") && !tech.isLongitudinal)
                },
                requires: "foam, not electrostatic induction, wave beam, not phonon",
                effect() {
                    tech.isBulletTeleport = true
                },
                remove() {
                    tech.isBulletTeleport = false;
                }
            },
            {
                name: "necrophoresis",
                description: "<strong>foam</strong> bubbles grow and split into 3 <strong>copies</strong><br> when the mob they are stuck to <strong>dies</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("foam") || tech.foamBotCount > 1 || tech.isFoamShot
                },
                requires: "foam",
                effect() {
                    tech.isFoamGrowOnDeath = true
                },
                remove() {
                    tech.isFoamGrowOnDeath = false;
                }
            },
            {
                name: "aerogel",
                description: "<strong>foam</strong> bubbles <strong>float</strong> and dissipate <strong>50%</strong> faster<br>increase <strong>foam</strong> <strong class='color-d'>damage</strong> per second by <strong>260%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("foam") || tech.foamBotCount > 1 || tech.isFoamShot
                },
                requires: "foam",
                effect() {
                    tech.isFastFoam = true
                    tech.foamGravity = -0.0003
                },
                remove() {
                    tech.isFastFoam = false;
                    tech.foamGravity = 0.00008
                }
            },
            {
                name: "quantum foam",
                description: "<strong>foam</strong> gun fires <strong>0.25</strong> seconds into the <strong>future</strong><br>increase <strong>foam</strong> gun <strong class='color-d'>damage</strong> by <strong>66%</strong>",
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("foam")
                },
                requires: "foam gun",
                effect() {
                    tech.foamFutureFire++
                },
                remove() {
                    tech.foamFutureFire = 0;
                }
            },
            {
                name: "foam fractionation",
                description: "<strong>foam</strong> gun bubbles are <strong>100%</strong> larger<br>when you have below <strong>300</strong> <strong>foam</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("foam")
                },
                requires: "foam gun",
                effect() {
                    tech.isAmmoFoamSize = true
                },
                remove() {
                    tech.isAmmoFoamSize = false;
                }
            },
            {
                name: "filament",
                description: "increase the <strong>length</strong> of your <strong>harpoon</strong>'s <strong>rope</strong><br>by <strong>3%</strong> per harpoon <strong class='color-ammo'>ammo</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("harpoon")
                },
                requires: "harpoon, not spear",
                effect() {
                    tech.isFilament = true;
                },
                remove() {
                    tech.isFilament = false;
                }
            },
            {
                name: "unaaq",
                description: "increase the <strong>length</strong> of your <strong>harpoon</strong><br>by <strong>15%</strong> of the square root of its <strong class='color-ammo'>ammo</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("harpoon")
                },
                requires: "harpoon",
                effect() {
                    tech.isLargeHarpoon = true;
                },
                remove() {
                    tech.isLargeHarpoon = false;
                }
            },
            {
                name: "toggling harpoon",
                description: "increase the <strong class='color-d'>damage</strong> of your next <strong>harpoon</strong><br>by <strong>600%</strong> after using it to collect a <strong>power up</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("harpoon")
                },
                requires: "harpoon",
                effect() {
                    tech.isHarpoonPowerUp = true
                },
                remove() {
                    tech.isHarpoonPowerUp = false
                    tech.harpoonDensity = 0.005
                }
            },
            {
                name: "reticulum",
                description: "fire <strong>+1</strong> harpoon<br>when there are multiple targets in range",
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("harpoon")
                },
                requires: "harpoon",
                effect() {
                    tech.extraHarpoons++;
                },
                remove() {
                    tech.extraHarpoons = 0;
                }
            },
            // {
            //     name: "spear",
            //     description: "<strong>harpoons</strong> fired while <strong>crouched</strong><br>have no <strong>rope</strong> and improved <strong>steering</strong>",
            //     isGunTech: true,
            //     maxCount: 1,
            //     count: 0,
            //     frequency: 2,
            //     frequencyDefault: 2,
            //     allowed() {
            //         return tech.haveGunCheck("harpoon") && !tech.isFilament
            //     },
            //     requires: "harpoon, not filament",
            //     effect() {
            //         tech.isSpear = true;
            //     },
            //     remove() {
            //         tech.isSpear = false;
            //     }
            // },
            {
                name: "half-wave rectifier",
                description: "charging the <strong>rail gun</strong> gives you <strong class='color-f'>energy</strong><br><em>instead of draining it</em>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("rail gun")
                },
                requires: "rail gun",
                effect() {
                    tech.isRailEnergyGain = true;
                },
                remove() {
                    tech.isRailEnergyGain = false;
                }
            },
            {
                name: "dielectric polarization",
                description: "firing the <strong>rail gun</strong> <strong class='color-d'>damages</strong> nearby <strong>mobs</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("rail gun")
                },
                requires: "rail gun",
                effect() {
                    tech.isRailAreaDamage = true;
                },
                remove() {
                    tech.isRailAreaDamage = false;
                }
            },
            {
                name: "capacitor bank",
                description: "the <strong>rail gun</strong> no longer takes time to <strong>charge</strong><br><strong>rail gun</strong> rods are <strong>66%</strong> less massive",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("rail gun")
                },
                requires: "rail gun",
                effect() {
                    tech.isCapacitor = true;
                },
                remove() {
                    tech.isCapacitor = false;
                }
            },
            {
                name: "laser diode",
                description: "all <strong class='color-laser'>lasers</strong> drain <strong>30%</strong> less <strong class='color-f'>energy</strong><br><em>affects laser-gun, laser-bot, and laser-mines</em>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.haveGunCheck("laser") || tech.laserBotCount > 1 || tech.isLaserMine) && tech.laserDamage === 0.16
                },
                requires: "laser, not free-electron",
                effect() {
                    tech.isLaserDiode = 0.70; //100%-37%
                    tech.laserColor = "rgb(0, 11, 255)"
                    tech.laserColorAlpha = "rgba(0, 11, 255,0.5)"
                },
                remove() {
                    tech.isLaserDiode = 1;
                    tech.laserColor = "#f02"
                    tech.laserColorAlpha = "rgba(255, 0, 0, 0.5)"
                }
            },
            {
                name: "free-electron laser",
                description: "increase all <strong class='color-laser'>laser</strong> <strong class='color-d'>damage</strong> by <strong>200%</strong><br>increase all <strong class='color-laser'>laser</strong> <strong class='color-f'>energy</strong> drain by <strong>250%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.haveGunCheck("laser") || tech.isLaserMine || tech.laserBotCount > 1) && !tech.isPulseLaser && tech.isLaserDiode === 1
                },
                requires: "laser, not pulse, diodes",
                effect() {
                    tech.laserFieldDrain = 0.007 //base is 0.002
                    tech.laserDamage = 0.48; //base is 0.16
                    tech.laserColor = "#83f"
                    tech.laserColorAlpha = "rgba(136, 51, 255,0.5)"
                },
                remove() {
                    tech.laserFieldDrain = 0.002;
                    tech.laserDamage = 0.16; //used in check on pulse and diode: tech.laserDamage === 0.16
                    tech.laserColor = "#f00"
                    tech.laserColorAlpha = "rgba(255, 0, 0, 0.5)"
                }
            },
            {
                name: "relativistic momentum",
                description: "all <strong class='color-laser'>lasers</strong> push mobs away<br><em>affects laser-gun, laser-bot, and laser-mines</em>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.haveGunCheck("laser") && !tech.isPulseLaser) || tech.laserBotCount > 1
                },
                requires: "laser, not pulse",
                effect() {
                    tech.isLaserPush = true;
                },
                remove() {
                    tech.isLaserPush = false;
                }
            },
            {
                name: "specular reflection",
                description: "<strong>+2</strong> reflection for all <strong class='color-laser'>lasers</strong><br><em>affects laser-gun, laser-bot, and laser-mines</em>",
                isGunTech: true,
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.haveGunCheck("laser") || tech.isLaserMine || tech.laserBotCount > 1) && !tech.isWideLaser && !tech.isPulseLaser && !tech.historyLaser
                },
                requires: "laser, not wide beam, diffuse beam, pulse, or slow light",
                effect() {
                    tech.laserReflections += 2;
                },
                remove() {
                    tech.laserReflections = 2;
                }
            },
            {
                name: "diffraction grating",
                description: `<strong class='color-laser'>laser</strong> gains a <strong>diverging</strong> beam`,
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("laser") && !tech.isWideLaser && !tech.isPulseAim && !tech.historyLaser
                },
                requires: "laser gun, not neocognitron, diffuse beam, or slow light",
                effect() {
                    tech.beamSplitter++
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    if (tech.beamSplitter !== 0) {
                        tech.beamSplitter = 0
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                        }
                    }
                }
            },
            {
                name: "diffuse beam",
                description: "<strong class='color-laser'>laser</strong> beam is <strong>wider</strong> and doesn't <strong>reflect</strong><br>increase full beam <strong class='color-d'>damage</strong> by <strong>200%</strong>",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("laser") && tech.laserReflections < 3 && !tech.beamSplitter && !tech.isPulseLaser && !tech.historyLaser
                },
                requires: "laser gun, not specular reflection, diffraction grating, slow light, pulse",
                effect() {
                    if (tech.wideLaser === 0) tech.wideLaser = 3
                    tech.isWideLaser = true;
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    if (tech.isWideLaser) {
                        // tech.wideLaser = 0
                        tech.isWideLaser = false;
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                        }
                    }
                }
            },
            {
                name: "output coupler",
                description: "<strong>widen</strong> diffuse <strong class='color-laser'>laser</strong> beam by <strong>40%</strong><br>increase full beam <strong class='color-d'>damage</strong> by <strong>40%</strong>",
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isWideLaser
                },
                requires: "diffuse beam",
                effect() {
                    tech.wideLaser += 2
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    if (tech.isWideLaser) {
                        tech.wideLaser = 3
                    } else {
                        tech.wideLaser = 0
                    }
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                    }
                }
            },
            {
                name: "slow light",
                description: "<strong class='color-laser'>laser</strong> beam is <strong>spread</strong> into your recent <strong>past</strong><br>increase total beam <strong class='color-d'>damage</strong> by <strong>300%</strong>",
                isGunTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("laser") && tech.laserReflections < 3 && !tech.beamSplitter && !tech.isWideLaser
                },
                requires: "laser gun, not specular reflection, diffraction grating, diffuse beam",
                effect() {
                    // this.description = `add 5 more <strong>laser</strong> beams into into your past`
                    tech.historyLaser++
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    // this.description = "<strong>laser</strong> beam is <strong>spread</strong> into your recent <strong>past</strong><br>increase total beam <strong class='color-d'>damage</strong> by <strong>300%</strong>"
                    if (tech.historyLaser) {
                        tech.historyLaser = 0
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                        }
                    }
                }
            },
            {
                name: "pulse",
                description: "charge your <strong class='color-f'>energy</strong> and release it as a<br><strong class='color-laser'>laser</strong> pulse that initiates an <strong class='color-e'>explosion</strong> cluster",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.haveGunCheck("laser") && tech.laserReflections < 3 && !tech.isWideLaser && tech.laserDamage === 0.16
                },
                requires: "laser gun, not specular reflection, diffuse, free-electron laser",
                effect() {
                    tech.isPulseLaser = true;
                    for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                        if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                    }
                },
                remove() {
                    if (tech.isPulseLaser) {
                        tech.isPulseLaser = false;
                        for (i = 0, len = b.guns.length; i < len; i++) { //find which gun 
                            if (b.guns[i].name === "laser") b.guns[i].chooseFireMethod()
                        }
                    }
                }
            },
            {
                name: "neocognitron",
                description: "<strong class='color-laser'>pulse</strong> automatically <strong>aims</strong> at a nearby mob",
                isGunTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return tech.isPulseLaser && !tech.beamSplitter
                },
                requires: "pulse, not diffraction grating",
                effect() {
                    tech.isPulseAim = true;
                },
                remove() {
                    tech.isPulseAim = false;
                }
            },
            //************************************************** 
            //************************************************** field
            //************************************************** tech
            //************************************************** 
            {
                name: "zero point energy",
                description: `use ${powerUps.orb.research(2)}to increase your <strong>max</strong> <strong class='color-f'>energy</strong> by <strong>74</strong>`,
                // description: "use <strong>2</strong> <strong class='color-r'>research</strong> to<br>increase your <strong>maximum</strong> <strong class='color-f'>energy</strong> by <strong>74</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return (m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics" || m.fieldUpgrades[m.fieldMode].name === "pilot wave") && (build.isExperimentSelection || powerUps.research.count > 1)
                },
                requires: "standing wave harmonics or pilot wave",
                effect() {
                    tech.harmonicEnergy = 0.74
                    m.setMaxEnergy()
                    for (let i = 0; i < 2; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                },
                remove() {
                    tech.harmonicEnergy = 0;
                    m.setMaxEnergy()
                    if (this.count > 0) powerUps.research.changeRerolls(2)
                }
            },
            {
                name: "spherical harmonics",
                description: "<strong>standing wave</strong> oscillates in a 3rd dimension<br>increasing <strong>deflecting</strong> efficiency by <strong>40%</strong>",
                isFieldTech: true,
                maxCount: 9,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics"
                },
                requires: "standing wave harmonics",
                effect() {
                    tech.harmonics++
                    m.fieldShieldingScale = 1.3 * Math.pow(0.6, (tech.harmonics - 2))
                    m.harmonicShield = m.harmonicAtomic
                },
                remove() {
                    tech.harmonics = 2
                    m.fieldShieldingScale = 1.3 * Math.pow(0.6, (tech.harmonics - 2))
                    m.harmonicShield = m.harmonic3Phase
                }
            },
            {
                name: "expansion",
                description: "using <strong>standing wave</strong> field uses <strong class='color-f'>energy</strong><br>to temporarily <strong>expand</strong> its <strong>radius</strong>",
                // description: "use <strong class='color-f'>energy</strong> to <strong>expand</strong> <strong>standing wave</strong><br>the field slowly <strong>contracts</strong> when not used",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics"
                },
                requires: "standing wave harmonics",
                effect() {
                    tech.isStandingWaveExpand = true
                },
                remove() {
                    tech.isStandingWaveExpand = false
                    m.harmonicRadius = 1
                }
            },
            {
                name: "bremsstrahlung",
                description: "<strong>deflecting</strong> does <strong class='color-d'>damage</strong> to mobs",
                isFieldTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics" || m.fieldUpgrades[m.fieldMode].name === "perfect diamagnetism"
                },
                requires: "standing wave harmonics, perfect diamagnetism",
                effect() {
                    tech.blockDmg += 1.25 //if you change this value also update the for loop in the electricity graphics in m.pushMass
                },
                remove() {
                    tech.blockDmg = 0;
                }
            },
            {
                name: "triple point",
                description: "the pressure from <strong>deflecting</strong> is used<br>to condense <strong class='color-s'>ice IX</strong> crystals",
                isFieldTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics" || m.fieldUpgrades[m.fieldMode].name === "perfect diamagnetism"
                },
                requires: "standing wave harmonics, perfect diamagnetism",
                effect() {
                    tech.blockingIce++
                },
                remove() {
                    tech.blockingIce = 0;
                }
            },
            {
                name: "flux pinning",
                description: "<strong>deflecting</strong> mobs with your <strong>field</strong><br><strong>stuns</strong> them for <strong>2</strong> seconds",
                isFieldTech: true,
                maxCount: 9,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "perfect diamagnetism" || m.fieldUpgrades[m.fieldMode].name === "standing wave harmonics" || m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing"
                },
                requires: "a field that can block",
                effect() {
                    tech.isStunField += 120;
                },
                remove() {
                    tech.isStunField = 0;
                }
            },
            {
                name: "eddy current brake",
                description: "project a field that limits the <strong>top speed</strong> of mobs<br>field <strong>radius</strong> scales with stored <strong class='color-f'>energy</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "perfect diamagnetism"
                },
                requires: "perfect diamagnetism",
                effect() {
                    tech.isPerfectBrake = true;
                },
                remove() {
                    tech.isPerfectBrake = false;
                }
            },
            {
                name: "Meissner effect",
                description: "increase <strong>perfect diamagnetism</strong> field<br><strong>radius</strong> by <strong>55%</strong> and circular <strong>arc</strong> by <strong>22°</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "perfect diamagnetism"
                },
                requires: "perfect diamagnetism",
                effect() {
                    tech.isBigField = true;
                },
                remove() {
                    tech.isBigField = false;
                }
            },
            {
                name: "tessellation",
                description: `use ${powerUps.orb.research(4)}to reduce <strong class='color-harm'>harm</strong> by <strong>50%</strong>`,
                // description: "use <strong>4</strong> <strong class='color-r'>research</strong><br>reduce <strong class='color-harm'>harm</strong> by <strong>50%</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return (m.fieldUpgrades[m.fieldMode].name === "perfect diamagnetism" || m.fieldUpgrades[m.fieldMode].name === "negative mass field") && (build.isExperimentSelection || powerUps.research.count > 3)
                },
                requires: "perfect diamagnetism or negative mass field",
                effect() {
                    tech.isFieldHarmReduction = true
                    for (let i = 0; i < 4; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                },
                remove() {
                    tech.isFieldHarmReduction = false
                    if (this.count > 0) powerUps.research.changeRerolls(4)
                }
            },
            {
                name: "degenerate matter",
                description: "reduce <strong class='color-harm'>harm</strong> by <strong>60%</strong> while your <strong class='color-f'>field</strong> is active",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (m.fieldUpgrades[m.fieldMode].name === "plasma torch" || m.fieldUpgrades[m.fieldMode].name === "perfect diamagnetism" || m.fieldUpgrades[m.fieldMode].name === "pilot wave" || m.fieldUpgrades[m.fieldMode].name === "negative mass field") && !tech.isEnergyHealth
                },
                requires: "field: perfect, negative mass, pilot wave, plasma, not mass-energy",
                effect() {
                    tech.isHarmReduce = true
                },
                remove() {
                    tech.isHarmReduce = false;
                }
            },
            {
                name: "annihilation",
                description: "<strong>touching</strong> normal mobs <strong>annihilates</strong> them<br>but drains <strong>33%</strong> of your maximum <strong class='color-f'>energy</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "negative mass field"
                },
                requires: "negative mass field",
                effect() {
                    tech.isAnnihilation = true
                },
                remove() {
                    tech.isAnnihilation = false;
                }
            },
            {
                name: "inertial mass",
                description: "<strong>negative mass field</strong> is larger and <strong>faster</strong><br><strong class='color-block'>blocks</strong> also move <strong>horizontally</strong> with the field",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "negative mass field"
                },
                requires: "negative mass field",
                effect() {
                    tech.isFlyFaster = true
                },
                remove() {
                    tech.isFlyFaster = false;
                }
            },
            {
                name: "Bose Einstein condensate",
                description: "<strong>mobs</strong> inside your <strong class='color-f'>field</strong> are <strong class='color-s'>frozen</strong><br><em style = 'font-size: 100%'>pilot wave, negative mass, time dilation</em>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "pilot wave" || m.fieldUpgrades[m.fieldMode].name === "negative mass field" || m.fieldUpgrades[m.fieldMode].name === "time dilation"
                },
                requires: "pilot wave, negative mass field, time dilation",
                effect() {
                    tech.isFreezeMobs = true
                },
                remove() {
                    tech.isFreezeMobs = false
                }
            },
            {
                name: "bot manufacturing",
                description: `use <strong>nano-scale manufacturing</strong> and ${powerUps.orb.research(2)}<br>to build <strong>3</strong> random <strong class='color-bot'>bots</strong>`,
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBotTech: true,
                isNonRefundable: true,
                // isExperimentHide: true,
                allowed() {
                    return powerUps.research.count > 1 && m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing"
                },
                requires: "nano-scale manufacturing",
                effect: () => {
                    for (let i = 0; i < 2; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                    m.energy = 0.01;
                    b.randomBot()
                    b.randomBot()
                    b.randomBot()
                },
                remove() {}
            },
            {
                name: "bot prototypes",
                description: `use ${powerUps.orb.research(3)}to build<br><strong>2</strong> random <strong class='color-bot'>bots</strong> and <strong>upgrade</strong> all <strong class='color-bot'>bots</strong> to that type`,
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                isBotTech: true,
                isNonRefundable: true,
                // isExperimentHide: true,
                allowed() {
                    return powerUps.research.count > 2 && m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing"
                },
                requires: "nano-scale manufacturing",
                effect: () => {
                    for (let i = 0; i < 3; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }

                    //fill array of available bots
                    const notUpgradedBots = []
                    const num = 2
                    notUpgradedBots.push(() => {
                        tech.giveTech("nail-bot upgrade")
                        for (let i = 0; i < num; i++) {
                            b.nailBot()
                            tech.nailBotCount++;
                        }
                        simulation.makeTextLog(`tech.isNailBotUpgrade = true`)
                    })
                    notUpgradedBots.push(() => {
                        tech.giveTech("foam-bot upgrade")
                        for (let i = 0; i < num; i++) {
                            b.foamBot()
                            tech.foamBotCount++;
                        }
                        simulation.makeTextLog(`tech.isFoamBotUpgrade = true`)
                    })
                    notUpgradedBots.push(() => {
                        tech.giveTech("boom-bot upgrade")
                        for (let i = 0; i < num; i++) {
                            b.boomBot()
                            tech.boomBotCount++;
                        }
                        simulation.makeTextLog(`tech.isBoomBotUpgrade = true`)
                    })
                    notUpgradedBots.push(() => {
                        tech.giveTech("laser-bot upgrade")
                        for (let i = 0; i < num; i++) {
                            b.laserBot()
                            tech.laserBotCount++;
                        }
                        simulation.makeTextLog(`tech.isLaserBotUpgrade = true`)
                    })
                    notUpgradedBots.push(() => {
                        tech.giveTech("orbital-bot upgrade")
                        for (let i = 0; i < num; i++) {
                            b.orbitBot()
                            tech.orbitBotCount++;
                        }
                        simulation.makeTextLog(`tech.isOrbitalBotUpgrade = true`)
                    })
                    for (let i = 0; i < 2; i++) { //double chance for dynamo-bot, since it's very good for nano-scale
                        notUpgradedBots.push(() => {
                            tech.giveTech("dynamo-bot upgrade")
                            for (let i = 0; i < num; i++) {
                                b.dynamoBot()
                                tech.dynamoBotCount++;
                            }
                            simulation.makeTextLog(`tech.isDynamoBotUpgrade = true`)
                        })
                    }
                    notUpgradedBots[Math.floor(Math.random() * notUpgradedBots.length)]() //choose random function from the array and run it
                },
                remove() {}
            },
            {
                name: "mycelium manufacturing",
                description: `use ${powerUps.orb.research(3)}to repurpose <strong>nano-scale</strong> field<br>excess <strong class='color-f'>energy</strong> used to grow <strong class='color-p' style='letter-spacing: 2px;'>spores</strong>`,
                // description: "use <strong>3</strong> <strong class='color-r'>research</strong> to repurpose <strong>nano-scale</strong><br>excess <strong class='color-f'>energy</strong> used to grow <strong class='color-p' style='letter-spacing: 2px;'>spores</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return (build.isExperimentSelection || powerUps.research.count > 2) && m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" && !(tech.isMissileField || tech.isIceField || tech.isFastDrones || tech.isDroneGrab || tech.isDroneRadioactive || tech.isDroneTeleport)
                },
                requires: "nano-scale manufacturing, no other manufacturing, no drone tech",
                effect() {
                    if (!build.isExperimentSelection) {
                        for (let i = 0; i < 3; i++) {
                            if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                        }
                    }
                    tech.isSporeField = true;
                },
                remove() {
                    tech.isSporeField = false;
                    if (this.count > 0) powerUps.research.changeRerolls(3)
                }
            },
            {
                name: "missile manufacturing",
                description: `use ${powerUps.orb.research(3)}to repurpose <strong>nano-scale</strong> field<br>excess <strong class='color-f'>energy</strong> used to construct <strong>missiles</strong>`,
                // description: "use <strong>3</strong> <strong class='color-r'>research</strong> to repurpose <strong>nano-scale</strong><br>excess <strong class='color-f'>energy</strong> used to construct <strong>missiles</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return (build.isExperimentSelection || powerUps.research.count > 2) && m.maxEnergy > 0.5 && m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" && !(tech.isSporeField || tech.isIceField || tech.isFastDrones || tech.isDroneGrab || tech.isDroneRadioactive || tech.isDroneTeleport)
                },
                requires: "nano-scale manufacturing, no other manufacturing, no drone tech",
                effect() {
                    if (!build.isExperimentSelection) {
                        for (let i = 0; i < 3; i++) {
                            if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                        }
                    }
                    tech.isMissileField = true;
                },
                remove() {
                    tech.isMissileField = false;
                    if (this.count > 0) powerUps.research.changeRerolls(3)
                }
            },
            {
                name: "ice IX manufacturing",
                description: `use ${powerUps.orb.research(3)}to repurpose <strong>nano-scale</strong> field<br>excess <strong class='color-f'>energy</strong> used to condense <strong class='color-s'>ice IX</strong>`,
                // description: "use <strong>3</strong> <strong class='color-r'>research</strong> to repurpose <strong>nano-scale</strong><br>excess <strong class='color-f'>energy</strong> used to condense <strong class='color-s'>ice IX</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return (build.isExperimentSelection || powerUps.research.count > 2) && m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" && !(tech.isSporeField || tech.isMissileField || tech.isFastDrones || tech.isDroneGrab || tech.isDroneRadioactive || tech.isDroneTeleport)
                },
                requires: "nano-scale manufacturing, no other manufacturing, no drone tech",
                effect() {
                    if (!build.isExperimentSelection) {
                        for (let i = 0; i < 3; i++) {
                            if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                        }
                    }
                    tech.isIceField = true;
                },
                remove() {
                    tech.isIceField = false;
                    if (this.count > 0) powerUps.research.changeRerolls(3)
                }
            },
            {
                name: "pair production",
                description: "picking up a <strong>power up</strong> gives you <strong>200</strong> <strong class='color-f'>energy</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "nano-scale manufacturing" || m.fieldUpgrades[m.fieldMode].name === "pilot wave"
                },
                requires: "nano-scale manufacturing or pilot wave",
                effect: () => {
                    tech.isMassEnergy = true // used in m.grabPowerUp
                    m.energy += 2
                },
                remove() {
                    tech.isMassEnergy = false;
                }
            },
            // {
            //     name: "thermal reservoir",
            //     description: "increase your <strong class='color-plasma'>plasma</strong> <strong class='color-d'>damage</strong> by <strong>100%</strong><br><strong class='color-plasma'>plasma</strong> temporarily lowers health not <strong class='color-f'>energy</strong>",
            //     isFieldTech: true,
            //     maxCount: 1,
            //     count: 0,
            // frequency: 2,
            //     allowed() {
            //         return m.fieldUpgrades[m.fieldMode].name === "plasma torch" && !tech.isEnergyHealth
            //     },
            //     requires: "plasma torch, not mass-energy equivalence",
            //     effect() {
            //         tech.isPlasmaRange += 0.27;
            //     },
            //     remove() {
            //         tech.isPlasmaRange = 1;
            //     }
            // },
            {
                name: "plasma-bot",
                description: "remove your <strong>field</strong> to build a <strong class='color-bot'>bot</strong><br>that uses <strong class='color-f'>energy</strong> to emit <strong class='color-plasma'>plasma</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                isBot: true,
                isBotTech: true,
                allowed() {
                    return !tech.isExtruder && m.fieldUpgrades[m.fieldMode].name === "plasma torch" && (build.isExperimentSelection || powerUps.research.count > 0)
                },
                requires: "plasma torch, not micro-extruder",
                effect() {
                    tech.plasmaBotCount++;
                    b.plasmaBot();
                    if (build.isExperimentSelection) {
                        document.getElementById("field-" + m.fieldMode).classList.remove("build-field-selected");
                        document.getElementById("field-0").classList.add("build-field-selected");
                    }
                    m.setField("field emitter")
                },
                remove() {
                    if (this.count > 0) {
                        tech.plasmaBotCount = 0;
                        b.clearPermanentBots();
                        b.respawnBots();
                        if (m.fieldMode === 0) {
                            m.setField("plasma torch")
                            if (build.isExperimentSelection) {
                                document.getElementById("field-0").classList.remove("build-field-selected");
                                document.getElementById("field-" + m.fieldMode).classList.add("build-field-selected");
                            }
                        }
                    }
                }
            },
            {
                name: "plasma jet",
                description: `use ${powerUps.orb.research(1)} to increase <strong class='color-plasma'>plasma</strong> <strong>torch</strong> range <strong>50%</strong>`,
                // description: "use <strong>1</strong> <strong class='color-r'>research</strong> to <br>increase <strong class='color-plasma'>plasma</strong> <strong>torch's</strong> range by <strong>50%</strong>",
                isFieldTech: true,
                maxCount: 3,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (tech.plasmaBotCount || (m.fieldUpgrades[m.fieldMode].name === "plasma torch" && !tech.isExtruder)) && (build.isExperimentSelection || powerUps.research.count > 0)
                },
                requires: "plasma torch, not micro-extruder",
                effect() {
                    tech.isPlasmaRange += 0.5;
                    if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                },
                remove() {
                    tech.isPlasmaRange = 1;
                    if (this.count > 0) powerUps.research.changeRerolls(this.count)
                }
            },
            {
                name: "tokamak",
                description: "throwing a <strong class='color-block'>block</strong> converts it into <strong class='color-f'>energy</strong><br>and a pulsed fusion <strong class='color-e'>explosion</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "plasma torch"
                },
                requires: "plasma torch",
                effect() {
                    tech.isTokamak = true;
                },
                remove() {
                    tech.isTokamak = false;
                }
            },
            {
                name: "micro-extruder",
                description: "<strong class='color-plasma'>plasma</strong> <strong>torch</strong> extrudes a thin <strong class='color-plasma'>hot</strong> wire<br>increases <strong class='color-d'>damage</strong>, <strong class='color-f'>energy</strong> drain, and <strong>lag</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "plasma torch" && tech.isPlasmaRange === 1 && tech.plasmaBotCount === 0
                },
                requires: "plasma torch, not plasma jet, plasma-bot",
                effect() {
                    tech.isExtruder = true;
                },
                remove() {
                    tech.isExtruder = false;
                }
            },
            {
                name: "timelike world line",
                description: "<strong>time dilation</strong> doubles your relative time <strong>rate</strong><br>and makes you <strong>immune</strong> to <strong class='color-harm'>harm</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "time dilation"
                },
                requires: "time dilation",
                effect() {
                    tech.isTimeSkip = true;
                    b.setFireCD();
                },
                remove() {
                    tech.isTimeSkip = false;
                    b.setFireCD();
                }
            },
            {
                name: "Lorentz transformation",
                description: `use ${powerUps.orb.research(3)}to increase your time rate<br><strong>move</strong>, <strong>jump</strong>, and <strong>shoot</strong> <strong>50%</strong> faster`,
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "time dilation" && (build.isExperimentSelection || powerUps.research.count > 2)
                },
                requires: "time dilation",
                effect() {
                    tech.isFastTime = true
                    m.setMovement();
                    b.setFireCD();
                    for (let i = 0; i < 3; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                },
                remove() {
                    tech.isFastTime = false
                    m.setMovement();
                    b.setFireCD();
                    if (this.count > 0) powerUps.research.changeRerolls(3)
                }
            },
            {
                name: "time crystals",
                description: "<strong>quadruple</strong> your default <strong class='color-f'>energy</strong> regeneration",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return (m.fieldUpgrades[m.fieldMode].name === "time dilation") && tech.energyRegen !== 0
                },
                requires: "time dilation, not ground state",
                effect: () => {
                    tech.energyRegen = 0.004;
                    m.fieldRegen = tech.energyRegen;
                },
                remove() {
                    tech.energyRegen = 0.001;
                    m.fieldRegen = tech.energyRegen;
                }
            },
            {
                name: "boson composite",
                description: "<strong>intangible</strong> to <strong class='color-block'>blocks</strong> and mobs while <strong class='color-cloaked'>cloaked</strong><br>passing through <strong>mobs</strong> drains your <strong class='color-f'>energy</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "metamaterial cloaking"
                },
                requires: "metamaterial cloaking",
                effect() {
                    tech.isIntangible = true;
                },
                remove() {
                    if (tech.isIntangible) {
                        tech.isIntangible = false;
                        player.collisionFilter.mask = cat.body | cat.map | cat.mob | cat.mobBullet | cat.mobShield //normal collisions
                    }
                }
            },
            {
                name: "dazzler",
                description: "<strong class='color-cloaked'>decloaking</strong> <strong>stuns</strong> nearby mobs<br>drains <strong>25%</strong> of your stored <strong class='color-f'>energy</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "metamaterial cloaking"
                },
                requires: "metamaterial cloaking",
                effect() {
                    tech.isCloakStun = true;
                },
                remove() {
                    tech.isCloakStun = false;
                }
            },
            {
                name: "ambush",
                description: "metamaterial cloaking field <strong class='color-d'>damage</strong> effect<br>is increased from <span style = 'text-decoration: line-through;'>300%</span> to <strong>600%</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "metamaterial cloaking"
                },
                requires: "metamaterial cloaking",
                effect() {
                    tech.sneakAttackDmg = 7
                },
                remove() {
                    tech.sneakAttackDmg = 4
                }
            },
            {
                name: "dynamical systems",
                description: `use ${powerUps.orb.research(1)}to increase your <strong class='color-d'>damage</strong> by <strong>35%</strong>`,
                // description: "use <strong>1</strong> <strong class='color-r'>research</strong><br>increase your <strong class='color-d'>damage</strong> by <strong>35%</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return (m.fieldUpgrades[m.fieldMode].name === "metamaterial cloaking" || m.fieldUpgrades[m.fieldMode].name === "pilot wave") && (build.isExperimentSelection || powerUps.research.count > 0)
                },
                requires: "metamaterial cloaking or pilot wave",
                effect() {
                    tech.isCloakingDamage = true
                    for (let i = 0; i < 1; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                },
                remove() {
                    tech.isCloakingDamage = false
                    if (this.count > 0) powerUps.research.changeRerolls(1)
                }
            },
            {
                name: "discrete optimization",
                description: "increase <strong class='color-d'>damage</strong> by <strong>50%</strong><br><strong>50%</strong> increased <strong><em>delay</em></strong> after firing",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "metamaterial cloaking" || m.fieldUpgrades[m.fieldMode].name === "pilot wave"
                },
                requires: "metamaterial cloaking or pilot wave",
                effect() {
                    tech.aimDamage = 1.5
                    b.setFireCD();
                },
                remove() {
                    tech.aimDamage = 1
                    b.setFireCD();
                }
            },
            {
                name: "potential well",
                description: "the force that <strong>pilot wave</strong> generates<br>to trap <strong class='color-block'>blocks</strong> is greatly increased",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "pilot wave"
                },
                requires: "pilot wave",
                effect() {
                    tech.pilotForce = 0.0006
                },
                remove() {
                    tech.pilotForce = 0.00002
                }
            },
            {
                name: "WIMPs",
                description: `at the end of each <strong>level</strong> spawn ${powerUps.orb.research(5)}<br> and a <strong class='color-harm'>harmful</strong> particle that slowly <strong>chases</strong> you`,
                isFieldTech: true,
                maxCount: 9,
                count: 0,
                frequency: 1,
                frequencyDefault: 1,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "wormhole"
                },
                requires: "wormhole",
                effect: () => {
                    tech.wimpCount++
                    spawn.WIMP()
                    for (let j = 0, len = 1 + 5 * Math.random(); j < len; j++) powerUps.spawn(level.exit.x + 100 * (Math.random() - 0.5), level.exit.y - 100 + 100 * (Math.random() - 0.5), "research", false)
                },
                remove() {
                    tech.wimpCount = 0
                }
            },
            {
                name: "cosmic string",
                description: "<strong>stun</strong> and do <strong class='color-p'>radioactive</strong> <strong class='color-d'>damage</strong> to <strong>mobs</strong><br>if you tunnel through them with a <strong class='color-worm'>wormhole</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "wormhole"
                },
                requires: "wormhole",
                effect() {
                    tech.isWormholeDamage = true
                },
                remove() {
                    tech.isWormholeDamage = false
                }
            },
            {
                name: "virtual particles",
                description: `use ${powerUps.orb.research(4)}to exploit your <strong>wormhole</strong> for a<br><strong>14%</strong> chance to <strong class='color-dup'>duplicate</strong> spawned <strong>power ups</strong>`,
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "wormhole" && (build.isExperimentSelection || powerUps.research.count > 3) && tech.duplicationChance() < 1
                },
                requires: "wormhole,below 100% duplication chance",
                effect() {
                    tech.wormDuplicate = 0.14
                    powerUps.setDo(); //needed after adjusting duplication chance
                    for (let i = 0; i < 4; i++) {
                        if (powerUps.research.count > 0) powerUps.research.changeRerolls(-1)
                    }
                },
                remove() {
                    tech.wormDuplicate = 0
                    powerUps.setDo(); //needed after adjusting duplication chance
                    if (this.count > 0) powerUps.research.changeRerolls(4)
                }
            },
            {
                name: "Penrose process",
                description: "after a <strong class='color-block'>block</strong> falls into a <strong class='color-worm'>wormhole</strong><br>you gain <strong>63</strong> <strong class='color-f'>energy</strong>",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "wormhole"
                },
                requires: "wormhole",
                effect() {
                    tech.isWormholeEnergy = true
                },
                remove() {
                    tech.isWormholeEnergy = false
                }
            },
            {
                name: "transdimensional spores",
                description: "when <strong class='color-block'>blocks</strong> fall into a <strong class='color-worm'>wormhole</strong><br>higher dimension <strong class='color-p' style='letter-spacing: 2px;'>spores</strong> are summoned",
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "wormhole"
                },
                requires: "wormhole",
                effect() {
                    tech.isWormholeSpores = true
                },
                remove() {
                    tech.isWormholeSpores = false
                }
            },
            {
                name: "traversable geodesics",
                description: `your <strong>projectiles</strong> can traverse <strong class='color-worm'>wormholes</strong><br>spawn 2 <strong class='color-g'>guns</strong> and ${powerUps.orb.ammo(2)}`,
                isFieldTech: true,
                maxCount: 1,
                count: 0,
                frequency: 2,
                frequencyDefault: 2,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name === "wormhole"
                },
                requires: "wormhole",
                effect() {
                    tech.isWormBullets = true
                    for (let i = 0; i < 2; i++) {
                        powerUps.spawn(m.pos.x, m.pos.y, "gun");
                        powerUps.spawn(m.pos.x, m.pos.y, "ammo");
                    }
                },
                remove() {
                    if (tech.isWormBullets) {
                        for (let i = 0; i < 2; i++) {
                            if (b.inventory.length) b.removeGun(b.guns[b.inventory[b.inventory.length - 1]].name) //remove your last gun
                        }
                        tech.isWormBullets = false;
                    }
                }
            },
            //************************************************** 
            //************************************************** experimental
            //************************************************** modes
            //************************************************** 
            {
                name: "-ship-",
                description: "<strong style='color: #f55;'>experiment:</strong> fly around with no legs<br>aim with the keyboard",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isBadRandomOption: true,
                isExperimentalMode: true,
                allowed() {
                    return build.isExperimentSelection && !m.isShipMode && m.fieldUpgrades[m.fieldMode].name !== "negative mass field"
                },
                requires: "",
                effect() {
                    m.shipMode()
                    for (let i = 0; i < 7; i++) tech.giveTech("undefined")
                },
                remove() {}
            },
            {
                name: "-quantum leap-",
                description: "<strong style='color: #f55;'>experiment:</strong> every 20 seconds<br>become an <strong class='alt'>alternate</strong> version of yourself",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isBadRandomOption: true,
                isExperimentalMode: true,
                allowed() {
                    return build.isExperimentSelection
                },
                requires: "",
                interval: undefined,
                effect() {
                    this.interval = setInterval(() => {
                        if (!build.isExperimentSelection) {
                            m.switchWorlds()
                            simulation.trails()
                        }
                    }, 20000); //every 20 seconds
                    for (let i = 0; i < 7; i++) tech.giveTech("undefined")

                },
                remove() {
                    if (this.count > 0) clearTimeout(this.interval);
                }
            },
            {
                name: "-shields-",
                description: "<strong style='color: #f55;'>experiment:</strong> every 5 seconds<br>all mobs gain a shield",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isBadRandomOption: true,
                isExperimentalMode: true,
                allowed() {
                    return build.isExperimentSelection
                },
                requires: "",
                effect() {
                    this.interval = setInterval(() => {
                        if (!build.isExperimentSelection) {
                            for (let i = 0; i < mob.length; i++) {
                                if (!mob[i].isShielded && !mob[i].shield && mob[i].isDropPowerUp) spawn.shield(mob[i], mob[i].position.x, mob[i].position.y, 1, true);
                            }
                        }
                    }, 5000); //every 5 seconds
                    for (let i = 0; i < 7; i++) tech.giveTech("undefined")
                },
                interval: undefined,
                remove() {
                    if (this.count > 0) clearTimeout(this.interval);
                }
            },
            {
                name: "-Fourier analysis-",
                description: "<strong style='color: #f55;'>experiment:</strong> your aiming is random",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isBadRandomOption: true,
                isExperimentalMode: true,
                allowed() {
                    return build.isExperimentSelection && !m.isShipMode
                },
                requires: "not ship",
                effect() {
                    m.look = () => {
                        m.angle = 2 * Math.sin(m.cycle * 0.0133) + Math.sin(m.cycle * 0.013) + 0.5 * Math.sin(m.cycle * 0.031) + 0.33 * Math.sin(m.cycle * 0.03)
                        const scale = 0.8;
                        m.transSmoothX = canvas.width2 - m.pos.x - (simulation.mouse.x - canvas.width2) * scale;
                        m.transSmoothY = canvas.height2 - m.pos.y - (simulation.mouse.y - canvas.height2) * scale;
                        m.transX += (m.transSmoothX - m.transX) * 0.07;
                        m.transY += (m.transSmoothY - m.transY) * 0.07;
                    }
                    for (let i = 0; i < 7; i++) tech.giveTech("undefined")
                },
                remove() {
                    if (this.count > 0) m.look = m.lookDefault()
                }
            },
            {
                name: "-panopticon-",
                description: "<strong style='color: #f55;'>experiment:</strong> mobs can always see you",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isBadRandomOption: true,
                isExperimentalMode: true,
                allowed() {
                    return build.isExperimentSelection
                },
                requires: "",
                effect() {
                    this.interval = setInterval(() => {
                        if (!build.isExperimentSelection) {
                            for (let i = 0; i < mob.length; i++) {
                                if (!mob[i].shield && mob[i].isDropPowerUp) {
                                    mob[i].locatePlayer()
                                    mob[i].seePlayer.yes = true;
                                }
                            }
                        }
                    }, 1000); //every 1 seconds
                    for (let i = 0; i < 7; i++) tech.giveTech("undefined")
                },
                interval: undefined,
                remove() {
                    if (this.count > 0) clearTimeout(this.interval);
                }
            },
            {
                name: "-decomposers-",
                description: "<strong style='color: #f55;'>experiment:</strong> after they die<br>mobs leave behind spawns",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isBadRandomOption: true,
                isExperimentalMode: true,
                allowed() {
                    return build.isExperimentSelection
                },
                requires: "",
                effect() {
                    tech.deathSpawns = 0.2
                    for (let i = 0; i < 7; i++) tech.giveTech("undefined")
                },
                remove() {
                    tech.deathSpawns = 0
                }
            },
            {
                name: "-WIMP-",
                description: "<strong style='color: #f55;'>experiment:</strong> <strong class='color-harm'>harmful</strong> particles slowly <strong>chase</strong> you",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isBadRandomOption: true,
                isExperimentalMode: true,
                allowed() {
                    return build.isExperimentSelection
                },
                requires: "",
                effect() {
                    tech.wimpExperiment = 5
                    for (let i = 0; i < 7; i++) tech.giveTech("undefined")
                },
                remove() {
                    tech.wimpExperiment = 0
                }
            },
            //************************************************** 
            //************************************************** JUNK
            //************************************************** tech
            //************************************************** 
            // {
            //     name: "junk",
            //     description: "",
            //     maxCount: 9,
            //     count: 0,
            //     frequency: 0,
            //     isNonRefundable: true,
            //     isExperimentHide: true,
            //     isJunk: true,
            //     allowed() {
            //         return true
            //     },
            //     requires: "",
            //     effect() {

            //     },
            //     remove() {}
            // },
            {
                name: "true colors",
                description: `set all power ups to their real world colors`,
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    // const colors = shuffle(["#f7b", "#0eb", "#467", "#0cf", "hsl(246,100%,77%)", "#26a"])
                    const colors = shuffle([powerUps.research.color, powerUps.heal.color, powerUps.ammo.color, powerUps.ammo.color, powerUps.field.color, powerUps.gun.color])
                    powerUps.research.color = colors[0]
                    powerUps.heal.color = colors[1]
                    powerUps.ammo.color = colors[2]
                    powerUps.field.color = colors[3]
                    powerUps.tech.color = colors[4]
                    powerUps.gun.color = colors[5]
                    for (let i = 0; i < powerUp.length; i++) {
                        switch (powerUp[i].name) {
                            case "research":
                                powerUp[i].color = colors[0]
                                break;
                            case "heal":
                                powerUp[i].color = colors[1]
                                break;
                            case "ammo":
                                powerUp[i].color = colors[2]
                                break;
                            case "field":
                                powerUp[i].color = colors[3]
                                break;
                            case "tech":
                                powerUp[i].color = colors[4]
                                break;
                            case "gun":
                                powerUp[i].color = colors[5]
                                break;
                        }
                    }
                },
                remove() {
                    const colors = ["#f7b", "#0eb", "#467", "#0cf", "hsl(246,100%,77%)", "#26a"] //no shuffle
                    powerUps.research.color = colors[0]
                    powerUps.heal.color = colors[1]
                    powerUps.ammo.color = colors[2]
                    powerUps.field.color = colors[3]
                    powerUps.tech.color = colors[4]
                    powerUps.gun.color = colors[5]
                    for (let i = 0; i < powerUp.length; i++) {
                        switch (powerUp[i].name) {
                            case "research":
                                powerUp[i].color = colors[0]
                                break;
                            case "heal":
                                powerUp[i].color = colors[1]
                                break;
                            case "ammo":
                                powerUp[i].color = colors[2]
                                break;
                            case "field":
                                powerUp[i].color = colors[3]
                                break;
                            case "tech":
                                powerUp[i].color = colors[4]
                                break;
                            case "gun":
                                powerUp[i].color = colors[5]
                                break;
                        }
                    }
                }
            },
            {
                name: "emergency broadcasting",
                description: "emit 2 sound sine waveforms at 853 Hz and 960 Hz<br><em>lower your volume</em>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isJunk: true,
                isNonRefundable: true,
                allowed() {
                    return true
                },
                requires: "",
                effect: () => {
                    //setup audio context
                    function tone(frequency) {
                        const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
                        const oscillator1 = audioCtx.createOscillator();
                        const gainNode1 = audioCtx.createGain();
                        gainNode1.gain.value = 0.5; //controls volume
                        oscillator1.connect(gainNode1);
                        gainNode1.connect(audioCtx.destination);
                        oscillator1.type = "sine"; // 'sine' 'square', 'sawtooth', 'triangle' and 'custom'
                        oscillator1.frequency.value = frequency; // value in hertz
                        oscillator1.start();
                        return audioCtx
                    }
                    // let sound = tone(1050)

                    function EBS() {
                        const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

                        const oscillator1 = audioCtx.createOscillator();
                        const gainNode1 = audioCtx.createGain();
                        gainNode1.gain.value = 0.3; //controls volume
                        oscillator1.connect(gainNode1);
                        gainNode1.connect(audioCtx.destination);
                        oscillator1.type = "sine"; // 'sine' 'square', 'sawtooth', 'triangle' and 'custom'
                        oscillator1.frequency.value = 853; // value in hertz
                        oscillator1.start();

                        const oscillator2 = audioCtx.createOscillator();
                        const gainNode2 = audioCtx.createGain();
                        gainNode2.gain.value = 0.3; //controls volume
                        oscillator2.connect(gainNode2);
                        gainNode2.connect(audioCtx.destination);
                        oscillator2.type = "sine"; // 'sine' 'square', 'sawtooth', 'triangle' and 'custom'
                        oscillator2.frequency.value = 960; // value in hertz
                        oscillator2.start();
                        return audioCtx
                    }
                    let sound = EBS()

                    delay = 1000
                    setTimeout(() => {
                        sound.suspend()
                        powerUps.spawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "heal");
                        setTimeout(() => {
                            sound.resume()
                            setTimeout(() => {
                                sound.suspend()
                                powerUps.spawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "heal");
                                setTimeout(() => {
                                    sound.resume()
                                    setTimeout(() => {
                                        sound.suspend()
                                        powerUps.spawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "heal");
                                        setTimeout(() => {
                                            sound.resume()
                                            setTimeout(() => {
                                                sound.suspend()
                                                powerUps.spawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "heal");
                                                setTimeout(() => {
                                                    sound.resume()
                                                    setTimeout(() => {
                                                        sound.suspend()
                                                        powerUps.spawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "heal");
                                                        setTimeout(() => {
                                                            sound.resume()
                                                            setTimeout(() => {
                                                                sound.suspend()
                                                                sound.close()
                                                                powerUps.spawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "heal");
                                                            }, delay);
                                                        }, delay);
                                                    }, delay);
                                                }, delay);
                                            }, delay);
                                        }, delay);
                                    }, delay);
                                }, delay);
                            }, delay);
                        }, delay);
                    }, delay);
                },
                remove() {}
            },
            {
                name: "automatic",
                description: "you can't fire when moving<br>always <strong>fire</strong> when at <strong>rest</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !tech.isFireMoveLock
                },
                requires: "not Higgs mechanism",
                effect: () => {
                    tech.isAlwaysFire = true;
                    b.setFireMethod();
                },
                remove() {
                    if (tech.isAlwaysFire) {
                        tech.isAlwaysFire = false
                        b.setFireMethod();
                    }
                }
            },
            {
                name: "hidden variable",
                description: `spawn ${powerUps.orb.heal(15)}<br>but hide your <strong class='color-h'>health</strong> bar`,
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !tech.isEnergyHealth
                },
                requires: "not mass-energy",
                effect() {
                    document.getElementById("health").style.display = "none"
                    document.getElementById("health-bg").style.display = "none"
                    for (let i = 0; i < 15; i++) powerUps.spawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "heal");
                },
                remove() {}
            },
            {
                name: "not a bug",
                description: "initiate a totally safe game crash for 5 seconds",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    const savedfunction = simulation.drawCircle
                    simulation.drawCircle = () => {
                        const a = mob[Infinity].position //crashed the game in a visually interesting way, because of the ctx.translate command is never reverted in the main game loop
                    }
                    setTimeout(() => {
                        simulation.drawCircle = savedfunction
                        canvas.width = canvas.width //clears the canvas // works on chrome at least
                    }, 5000);

                    // for (;;) {} //freezes the tab
                },
                remove() {}
            },
            {
                name: "posture",
                description: "stand a bit taller",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "",
                effect() {
                    m.yOffWhen.stand = 70
                },
                remove() {
                    m.yOffWhen.stand = 49
                }
            },
            {
                name: "rhythm",
                description: "you oscillate up and down",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isJunk: true,
                isNonRefundable: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "",
                effect() {
                    setInterval(() => {
                        m.yOffWhen.stand = 53 + 28 * Math.sin(simulation.cycle * 0.2)
                        if (m.onGround && !m.crouch) m.yOffGoal = m.yOffWhen.stand
                    }, 100);
                },
                remove() {}
            },
            {
                name: "spinor",
                description: "the direction you aim is determined by your position",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isNonRefundable: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "",
                effect() {
                    m.look = function() {
                        //always on mouse look
                        m.angle = (((m.pos.x + m.pos.y) / 100 + Math.PI) % Math.PI * 2) - Math.PI
                        //smoothed mouse look translations
                        const scale = 0.8;
                        m.transSmoothX = canvas.width2 - m.pos.x - (simulation.mouse.x - canvas.width2) * scale;
                        m.transSmoothY = canvas.height2 - m.pos.y - (simulation.mouse.y - canvas.height2) * scale;

                        m.transX += (m.transSmoothX - m.transX) * 0.07;
                        m.transY += (m.transSmoothY - m.transY) * 0.07;
                    }
                },
                remove() {
                    if (this.count) m.look = m.lookDefault
                }
            },
            {
                name: "decomposers",
                description: "after they die <strong>mobs</strong> leave behind <strong>spawns</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isNonRefundable: true,
                isJunk: true,
                allowed() {
                    return tech.deathSpawns === 0
                },
                requires: "",
                effect() {
                    tech.deathSpawns = 0.2
                },
                remove() {
                    tech.deathSpawns = 0
                }
            },
            {
                name: "panopticon",
                description: "<strong>mobs</strong> can always see you",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isNonRefundable: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    setInterval(() => {
                        for (let i = 0; i < mob.length; i++) {
                            if (!mob[i].shield && mob[i].isDropPowerUp) {
                                mob[i].locatePlayer()
                                mob[i].seePlayer.yes = true;
                            }
                        }
                    }, 1000); //every 1 seconds
                },
                remove() {}
            },
            {
                name: "inverted mouse",
                description: "your mouse is scrambled<br>it's fine, just rotate it 90 degrees",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isNonRefundable: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "not ship",
                effect() {
                    document.body.addEventListener("mousemove", (e) => {
                        const ratio = window.innerWidth / window.innerHeight
                        simulation.mouse.x = e.clientY * ratio
                        simulation.mouse.y = e.clientX / ratio;
                    });
                },
                remove() {
                    // m.look = m.lookDefault
                }
            },
            {
                name: "Fourier analysis",
                description: "your aiming is now controlled by this equation:<br>2sin(0.0133t) + sin(0.013t) + 0.5sin(0.031t)+ 0.33sin(0.03t)",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "not ship",
                effect() {
                    m.look = () => {
                        m.angle = 2 * Math.sin(m.cycle * 0.0133) + Math.sin(m.cycle * 0.013) + 0.5 * Math.sin(m.cycle * 0.031) + 0.33 * Math.sin(m.cycle * 0.03)
                        const scale = 0.8;
                        simulation.mouse.y
                        m.transSmoothX = canvas.width2 - m.pos.x - (simulation.mouse.x - canvas.width2) * scale;
                        m.transSmoothY = canvas.height2 - m.pos.y - (simulation.mouse.y - canvas.height2) * scale;
                        m.transX += (m.transSmoothX - m.transX) * 0.07;
                        m.transY += (m.transSmoothY - m.transY) * 0.07;
                    }
                },
                remove() {
                    if (this.count) m.look = m.lookDefault
                }
            },
            {
                name: "disintegrated armament",
                description: "spawn a <strong class='color-g'>gun</strong><br><strong>remove</strong> your active <strong class='color-g'>gun</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return b.inventory.length > 0
                },
                requires: "at least 1 gun",
                effect() {
                    if (b.inventory.length > 0) b.removeGun(b.guns[b.activeGun].name)
                    simulation.makeGunHUD()
                    powerUps.spawn(m.pos.x + 60 * (Math.random() - 0.5), m.pos.y + 60 * (Math.random() - 0.5), "gun");
                },
                remove() {}
            },
            {
                name: "probability",
                description: "increase the <strong class='flicker'>frequency</strong><br>of one random <strong class='color-m'>tech</strong> by <strong>100</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    let options = []; //find what tech I could get
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (
                            tech.tech[i].count < tech.tech[i].maxCount &&
                            tech.tech[i].allowed() &&
                            !tech.tech[i].isJunk &&
                            !tech.tech.isLore
                        ) {
                            options.push(i);
                        }
                    }
                    if (options.length) {
                        const index = options[Math.floor(Math.random() * options.length)]
                        tech.tech[index].frequency = 100
                    }
                },
                remove() {}
            },
            {
                name: "encryption",
                description: "secure <strong class='color-m'>tech</strong> information",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    String.prototype.shuffle = function() {
                        var a = this.split(""),
                            n = a.length;

                        for (var i = n - 1; i > 0; i--) {
                            var j = Math.floor(Math.random() * (i + 1));
                            var tmp = a[i];
                            a[i] = a[j];
                            a[j] = tmp;
                        }
                        return a.join("");
                    }

                    for (let i = 0, len = tech.tech.length; i < len; i++) tech.tech[i].name = tech.tech[i].name.shuffle()
                },
                remove() {}
            },
            {
                name: "transparency",
                description: "become invisible to yourself<br><em>mobs can still see you</em>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    m.draw = () => {}
                },
                remove() {}
            },
            {
                name: "quantum leap",
                description: "become an <strong class='alt'>alternate</strong> version of yourself<br>every <strong>20</strong> seconds",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    setInterval(() => {
                        m.switchWorlds()
                        simulation.trails()
                    }, 20000); //every 30 seconds
                },
                remove() {}
            },
            {
                name: "score",
                description: "Add a score to n-gon!",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    setInterval(() => {
                        let score = Math.ceil(1000 * Math.random() * Math.random() * Math.random() * Math.random() * Math.random())
                        simulation.makeTextLog(`simulation.score <span class='color-symbol'>=</span> ${score.toFixed(0)}`);
                    }, 1000); //every 10 seconds
                },
                remove() {}
            },
            {
                name: "pop-ups",
                description: "sign up to learn endless easy ways to win n-gon<br>that Landgreen doesn't want you to know!!!1!!",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    setInterval(() => {
                        alert(`The best combo is ${tech.tech[Math.floor(Math.random() * tech.tech.length)].name} with ${tech.tech[Math.floor(Math.random() * tech.tech.length)].name}!`);
                    }, 30000); //every 30 seconds
                },
                remove() {}
            },
            {
                name: "music",
                description: "add music to n-gon",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    window.open('https://www.youtube.com/results?search_query=music', '_blank')
                },
                remove() {}
            },
            {
                name: "performance",
                description: "display performance stats to n-gon",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    (function() {
                        var script = document.createElement('script');
                        script.onload = function() {
                            var stats = new Stats();
                            document.body.appendChild(stats.dom);
                            requestAnimationFrame(function loop() {
                                stats.update();
                                requestAnimationFrame(loop)
                            });
                        };
                        script.src = 'https://unpkg.com/stats.js@0.17.0/build/stats.min.js';
                        document.head.appendChild(script);
                    })()
                    //move health to the right
                    document.getElementById("health").style.left = "86px"
                    document.getElementById("health-bg").style.left = "86px"
                },
                remove() {}
            },
            {
                name: "repartitioning",
                description: "set the <strong class='flicker'>frequency</strong> of finding normal <strong class='color-m'>tech</strong> to <strong>0</strong><br>spawn 5 <strong class='color-m'>tech</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0, len = tech.tech.length; i < len; i++) {
                        if (tech.tech[i].isJunk) {
                            tech.tech[i].frequency = 2
                        } else {
                            tech.tech[i].frequency = 0
                        }
                    }
                    for (let i = 0; i < 5; i++) powerUps.spawn(m.pos.x, m.pos.y, "tech");
                },
                remove() {}
            },
            {
                name: "defragment",
                description: "set the <strong class='flicker'>frequency</strong> of finding <strong class='color-j'>JUNK</strong> <strong class='color-m'>tech</strong> to zero",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = tech.tech.length - 1; i > 0; i--) {
                        if (tech.tech[i].isJunk) tech.tech[i].frequency = 0
                    }
                },
                remove() {}
            },
            {
                name: "ship",
                description: "fly around with no legs<br>reduce combat <strong>difficulty</strong> by <strong>1 level</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode && m.fieldUpgrades[m.fieldMode].name !== "negative mass field"
                },
                requires: "",
                effect() {
                    m.shipMode()
                    level.difficultyDecrease(simulation.difficultyMode)
                },
                remove() {}
            },
            // {
            //     name: "lubrication",
            //     description: "reduce block density and friction for this level",
            //     maxCount: 9,
            //     count: 0,
            //     frequency: 0,
            //     isNonRefundable: true,
            //     isExperimentHide: true,
            //     isJunk: true,
            //     allowed() {
            //         return true
            //     },
            //     requires: "",
            //     effect() {
            //         for (let i = 0; i < body.length; i++) {
            //             Matter.Body.setDensity(body[i], 0.0001) // 0.001 is normal
            //             body[i].friction = 0.01
            //         }
            //     },
            //     remove() {}
            // },
            {
                name: "pitch",
                description: "oscillate the pitch of your world",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    setInterval(() => { if (!simulation.paused) ctx.rotate(0.001 * Math.sin(simulation.cycle * 0.01)) }, 16);
                },
                remove() {}
            },
            {
                name: "umbra",
                description: "produce a blue glow around everything<br>and probably some simulation lag",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    ctx.shadowColor = '#06f';
                    ctx.shadowBlur = 25;
                },
                remove() {}
            },
            {
                name: "lighter",
                description: `ctx.globalCompositeOperation = "lighter"`,
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return m.fieldUpgrades[m.fieldMode].name !== "negative mass field"
                },
                requires: "",
                effect() {
                    ctx.globalCompositeOperation = "lighter";
                },
                remove() {}
            },
            {
                name: "rewind",
                description: "every 5 seconds <strong class='color-rewind'>rewind</strong> <strong>2</strong> seconds<br>lasts 120 seconds",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0; i < 24; i++) {
                        setTimeout(() => { m.rewind(120) }, i * 5000);
                    }
                },
                remove() {}
            },
            {
                name: "energy to mass conversion",
                description: "convert your <strong class='color-f'>energy</strong> into <strong class='color-block'>blocks</strong>",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0, len = 40; i < len; i++) {
                        setTimeout(() => {
                            m.energy -= 1 / len
                            const index = body.length
                            where = Vector.add(m.pos, { x: 400 * (Math.random() - 0.5), y: 400 * (Math.random() - 0.5) })
                            spawn.bodyRect(where.x, where.y, Math.floor(15 + 100 * Math.random()), Math.floor(15 + 100 * Math.random()));
                            body[index].collisionFilter.category = cat.body;
                            body[index].collisionFilter.mask = cat.player | cat.map | cat.body | cat.bullet | cat.mob | cat.mobBullet
                            body[index].classType = "body";
                            Composite.add(engine.world, body[index]); //add to world
                        }, i * 100);
                    }

                },
                remove() {}
            },
            {
                name: "level.nextLevel()",
                description: "advance to the next level",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    level.nextLevel();
                },
                remove() {}
            },
            {
                name: "expert system",
                description: "spawn a <strong class='color-m'>tech</strong> power up<br><strong>+64</strong> <strong class='color-j'>JUNK</strong> to the potential <strong class='color-m'>tech</strong> pool",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    powerUps.spawn(m.pos.x, m.pos.y, "tech");
                    tech.addJunkTechToPool(64)
                },
                remove() {}
            },
            {
                name: "energy investment",
                description: "every 10 seconds drain your <strong class='color-f'>energy</strong><br>return it doubled 10 seconds later<br>lasts 180 seconds",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0; i < 18; i++) {
                        setTimeout(() => { //drain energy
                            const energy = m.energy
                            m.energy = 0
                            setTimeout(() => { //return energy
                                m.energy += 2 * energy
                            }, 5000);
                        }, i * 10000);
                    }
                },
                remove() {}
            },
            {
                name: "missile Launching System",
                description: "fire missiles for the next 60 seconds",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0; i < 60; i++) {
                        setTimeout(() => {
                            const where = {
                                x: m.pos.x,
                                y: m.pos.y - 40
                            }
                            b.missile(where, -Math.PI / 2 + 0.2 * (Math.random() - 0.5) * Math.sqrt(tech.missileCount), -2)
                        }, i * 1000);
                    }
                },
                remove() {}
            },
            {
                name: "grenade production",
                description: "drop grenades for the next 120 seconds",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0; i < 120; i++) {
                        setTimeout(() => {
                            b.grenade(Vector.add(m.pos, { x: 10 * (Math.random() - 0.5), y: 10 * (Math.random() - 0.5) }), -Math.PI / 2) //fire different angles for each grenade
                            const who = bullet[bullet.length - 1]
                            Matter.Body.setVelocity(who, {
                                x: who.velocity.x * 0.1,
                                y: who.velocity.y * 0.1
                            });
                        }, i * 1000);
                    }
                },
                remove() {}
            },
            // {
            //     name: "inverted input",
            //     description: "left input becomes right and up input becomes down",
            //     maxCount: 9,
            //     count: 0,
            //     frequency: 0,
            //     isNonRefundable: true,
            //     isExperimentHide: true,
            //     isJunk: true,
            //     allowed() {
            //         return true
            //     },
            //     requires: "",
            //     effect() {
            //         const left = input.key.left
            //         input.key.left = input.key.right
            //         input.key.right = left

            //         const up = input.key.up
            //         input.key.up = input.key.down
            //         input.key.down = up
            //     },
            //     remove() {}
            // },
            {
                name: "Sleipnir",
                description: "grow more legs",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "",
                effect() {
                    m.draw = function() {
                        ctx.fillStyle = m.fillColor;
                        m.walk_cycle += m.flipLegs * m.Vx;

                        //draw body
                        ctx.save();
                        ctx.globalAlpha = (m.immuneCycle < m.cycle) ? 1 : 0.5
                        ctx.translate(m.pos.x, m.pos.y);
                        for (let i = 0; i < 16; i++) {
                            m.calcLeg(Math.PI * i / 8, -3 * i / 16)
                            m.drawLeg("#444")
                        }
                        ctx.rotate(m.angle);

                        ctx.beginPath();
                        ctx.arc(0, 0, 30, 0, 2 * Math.PI);
                        ctx.fillStyle = this.bodyGradient
                        ctx.fill();
                        ctx.arc(15, 0, 4, 0, 2 * Math.PI);
                        ctx.strokeStyle = "#333";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        // ctx.beginPath();
                        // ctx.arc(15, 0, 3, 0, 2 * Math.PI);
                        // ctx.fillStyle = '#0cf';
                        // ctx.fill()
                        ctx.restore();
                        m.yOff = m.yOff * 0.85 + m.yOffGoal * 0.15; //smoothly move leg height towards height goal
                    }
                },
                remove() {}
            },
            {
                name: "diegesis",
                description: "indicate gun fire <strong><em>delay</em></strong><br>through a rotation of your head",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "",
                effect() {
                    m.draw = function() {
                        ctx.fillStyle = m.fillColor;
                        m.walk_cycle += m.flipLegs * m.Vx;

                        ctx.save();
                        ctx.globalAlpha = (m.immuneCycle < m.cycle) ? 1 : 0.5
                        ctx.translate(m.pos.x, m.pos.y);
                        m.calcLeg(Math.PI, -3);
                        m.drawLeg("#4a4a4a");
                        m.calcLeg(0, 0);
                        m.drawLeg("#333");
                        ctx.rotate(m.angle - (m.fireCDcycle != Infinity ? m.flipLegs * 0.25 * Math.pow(Math.max(m.fireCDcycle - m.cycle, 0), 0.5) : 0));

                        ctx.beginPath();
                        ctx.arc(0, 0, 30, 0, 2 * Math.PI);
                        ctx.fillStyle = this.bodyGradient
                        ctx.fill();
                        ctx.arc(15, 0, 4, 0, 2 * Math.PI);
                        ctx.strokeStyle = "#333";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.restore();
                        m.yOff = m.yOff * 0.85 + m.yOffGoal * 0.15; //smoothly move leg height towards height goal
                    }
                },
                remove() {}
            },
            {
                name: "pareidolia",
                description: "don't",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return !m.isShipMode
                },
                requires: "",
                effect() {
                    m.draw = function() {
                        ctx.fillStyle = m.fillColor;
                        m.walk_cycle += m.flipLegs * m.Vx;
                        ctx.save();
                        ctx.globalAlpha = (m.immuneCycle < m.cycle) ? 1 : 0.7
                        ctx.translate(m.pos.x, m.pos.y);
                        m.calcLeg(Math.PI, -3);
                        m.drawLeg("#4a4a4a");
                        m.calcLeg(0, 0);
                        m.drawLeg("#333");
                        ctx.rotate(m.angle);
                        ctx.beginPath();
                        ctx.arc(0, 0, 30, 0, 2 * Math.PI);
                        ctx.fillStyle = this.bodyGradient
                        ctx.fill();
                        ctx.strokeStyle = "#333";
                        ctx.lineWidth = 2;
                        if (!(m.angle > -Math.PI / 2 && m.angle < Math.PI / 2)) ctx.scale(1, -1); //here is the flip
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(2, -6, 7, 0, 2 * Math.PI);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(25, -6, 7, 0.25 * Math.PI, 1.6 * Math.PI);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(2, -10, 9, 1.25 * Math.PI, 1.75 * Math.PI);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(25, -10, 9, 1.25 * Math.PI, 1.4 * Math.PI);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(18, 13, 10, 0, 2 * Math.PI);
                        ctx.fillStyle = this.bodyGradient;
                        ctx.fill();
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(18, 13, 6, 0, 2 * Math.PI);
                        ctx.fillStyle = "#555";
                        ctx.fill();
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(3, -6, 3, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(26, -6, 3, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                        ctx.restore();
                        m.yOff = m.yOff * 0.85 + m.yOffGoal * 0.15;
                    }
                },
                remove() {}
            },
            {
                name: "prism",
                description: "you cycle through different <strong>colors</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    m.color = {
                        hue: 0,
                        sat: 100,
                        light: 50
                    }
                    setInterval(function() {
                        m.color.hue++
                        m.setFillColors()
                    }, 10);
                },
                remove() {}
            },
            {
                name: "assimilation",
                description: "all your <strong class='color-bot'>bots</strong> are converted to the <strong>same</strong> random model",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isBotTech: true,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return b.totalBots() > 2
                },
                requires: "at least 3 bots",
                effect() {
                    const total = b.totalBots();
                    tech.dynamoBotCount = 0;
                    tech.nailBotCount = 0;
                    tech.laserBotCount = 0;
                    tech.orbitBotCount = 0;
                    tech.foamBotCount = 0;
                    tech.boomBotCount = 0;
                    tech.plasmaBotCount = 0;
                    tech.missileBotCount = 0;
                    for (let i = 0; i < bullet.length; i++) {
                        if (bullet[i].botType) bullet[i].endCycle = 0
                    }

                    const bots = [
                        () => {
                            b.nailBot();
                            tech.nailBotCount++;
                        },
                        () => {
                            b.foamBot();
                            tech.foamBotCount++;
                        },
                        () => {
                            b.boomBot();
                            tech.boomBotCount++;
                        },
                        () => {
                            b.laserBot();
                            tech.laserBotCount++;
                        },
                        () => {
                            b.orbitBot();
                            tech.orbitBotCount++
                        },
                        () => {
                            b.dynamoBot();
                            tech.dynamoBotCount++
                        }
                    ]
                    const index = Math.floor(Math.random() * bots.length)
                    for (let i = 0; i < total; i++) bots[index]()
                },
                remove() {}
            },
            {
                name: "growth hacking",
                description: "increase combat <strong>difficulty</strong> by <strong>1 level</strong>",
                maxCount: 1,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    level.difficultyIncrease(simulation.difficultyMode)
                },
                remove() {}
            },
            {
                name: "stun",
                description: "<strong>stun</strong> all mobs for up to <strong>8</strong> seconds",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0; i < mob.length; i++) mobs.statusStun(mob[i], 480)
                },
                remove() {}
            },
            {
                name: "re-arm",
                description: "remove all your <strong class='color-g'>guns</strong>,<br>and <strong>spawn</strong> new ones",
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return b.inventory.length > 0
                },
                requires: "at least 1 gun",
                effect() {
                    for (let i = 0; i < b.inventory.length; i++) powerUps.spawn(m.pos.x + 60 * (Math.random() - 0.5), m.pos.y + 60 * (Math.random() - 0.5), "gun");

                    //removes guns and ammo  
                    b.inventory = [];
                    b.activeGun = null;
                    b.inventoryGun = 0;
                    for (let i = 0, len = b.guns.length; i < len; ++i) {
                        b.guns[i].have = false;
                        if (b.guns[i].ammo !== Infinity) b.guns[i].ammo = 0;
                    }
                    simulation.makeGunHUD(); //update gun HUD
                },
                remove() {}
            },
            {
                name: "re-research",
                description: `<strong>eject</strong> all your ${powerUps.orb.research(1)}`,
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return powerUps.research.count > 3
                },
                requires: "at least 4 research",
                effect() {
                    for (let i = 0; i < powerUps.research.count; i++) powerUps.directSpawn(m.pos.x + 160 * (Math.random() - 0.5), m.pos.y + 160 * (Math.random() - 0.5), "research");
                    powerUps.research.count = 0
                },
                remove() {}
            },
            {
                name: "quantum black hole",
                description: `use your <strong class='color-f'>energy</strong> and ${powerUps.orb.research(4)} to <strong>spawn</strong><br>inside the event horizon of a huge <strong>black hole</strong>`,
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return powerUps.research.count > 3
                },
                requires: "at least 4 research",
                effect() {
                    m.energy = 0
                    spawn.suckerBoss(m.pos.x, m.pos.y - 700)
                    powerUps.research.changeRerolls(-4)
                    simulation.makeTextLog(`<span class='color-var'>m</span>.<span class='color-r'>research</span> <span class='color-symbol'>--</span><br>${powerUps.research.count}`)
                },
                remove() {}
            },
            {
                name: "black hole cluster",
                description: `spawn ${powerUps.orb.research(2)}<br><strong>spawn</strong> 40 nearby <strong>black holes</strong>`,
                maxCount: 9,
                count: 0,
                frequency: 0,
                isNonRefundable: true,
                isExperimentHide: true,
                isJunk: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    for (let i = 0; i < 2; i++) powerUps.spawn(m.pos.x, m.pos.y, "research");
                    const unit = {
                        x: 1,
                        y: 0
                    }
                    for (let i = 0; i < 40; i++) {
                        const where = Vector.add(m.pos, Vector.mult(Vector.rotate(unit, Math.random() * 2 * Math.PI), 600 + 800 * Math.random()))
                        spawn.sucker(where.x, where.y)
                    }
                },
                remove() {}
            },
            //************************************************** 
            //************************************************** undefined / lore
            //************************************************** tech
            //************************************************** 
            {
                name: `undefined`,
                // description: `${lore.techCount+1}/${lore.techGoal}<br><em>add copies of <strong class="lore-text">this</strong> to the potential <strong class='color-m'>tech</strong> pool</em>`,
                description: `<strong class="lore-text">this</strong>`,
                maxCount: 1,
                count: 0,
                frequency: 3,
                frequencyDefault: 3,
                isLore: true,
                // isNonRefundable: true,
                isExperimentHide: true,
                allowed() {
                    return true
                },
                requires: "",
                effect() {
                    setTimeout(() => { //a short delay, I can't remember why
                        lore.techCount++
                        if (lore.techCount === lore.techGoal) {
                            // tech.removeLoreTechFromPool();
                            this.frequency = 0;
                            this.description = `<strong class="lore-text">null</strong> is open at level.final()`
                        } else {
                            this.frequency += lore.techGoal
                            // for (let i = 0; i < tech.tech.length; i++) { //set name for all unchosen copies of this tech
                            //     if (tech.tech[i].isLore && tech.tech[i].count === 0) tech.tech[i].description = `${lore.techCount+1}/${lore.techGoal}<br><em>add copies of <strong class="lore-text">this</strong> to the potential <strong class='color-m'>tech</strong> pool</em>`
                            // }
                            // for (let i = 0, len = 10; i < len; i++) tech.addLoreTechToPool()
                            this.description = `<em>uncaught error:</em><br><strong>${Math.max(0,lore.techGoal-lore.techCount)}</strong> more required for access to <strong class="lore-text">null</strong>`
                        }
                    }, 1);
                },
                remove() {
                    lore.techCount = 0;
                    this.maxCount = lore.techGoal;
                    this.description = `<strong class="lore-text">this</strong>`
                }
            }
        ],
        // addLoreTechToPool() { //adds lore tech to tech pool
        //     if (!simulation.isCheating) {
        //         tech.tech.push({
        //             name: `undefined`,
        //             description: `${lore.techCount+1}/${lore.techGoal}<br><em>add copies of <strong class="lore-text">this</strong> to the potential <strong class='color-m'>tech</strong> pool</em>`,
        //             maxCount: 1,
        //             count: 0,
        //             frequency: 2,
        //             isLore: true,
        //             isNonRefundable: true,
        //             isExperimentHide: true,
        //             allowed() {
        //                 return true
        //             },
        //             requires: "",
        //             effect() {
        //                 setTimeout(() => { //a short delay, I can't remember why
        //                     lore.techCount++
        //                     if (lore.techCount > lore.techGoal - 1) {
        //                         // tech.removeLoreTechFromPool();
        //                         for (let i = tech.tech.length - 1; i > 0; i--) {
        //                             if (tech.tech[i].isLore && tech.tech[i].count === 0) tech.tech.splice(i, 1)
        //                         }
        //                     } else {
        //                         for (let i = 0; i < tech.tech.length; i++) { //set name for all unchosen copies of this tech
        //                             if (tech.tech[i].isLore && tech.tech[i].count === 0) tech.tech[i].description = `${lore.techCount+1}/${lore.techGoal}<br><em>add copies of <strong class="lore-text">this</strong> to the potential <strong class='color-m'>tech</strong> pool</em>`
        //                         }
        //                         for (let i = 0, len = 10; i < len; i++) tech.addLoreTechToPool()
        //                     }
        //                 }, 1);
        //             },
        //             remove() {}
        //         })
        //     }
        // },
        // junk: [

        // ],
        //variables use for gun tech upgrades
        fireRate: null,
        bulletSize: null,
        energySiphon: null,
        healthDrain: null,
        isCrouchAmmo: null,
        isBulletsLastLonger: null,
        isImmortal: null,
        sporesOnDeath: null,
        isImmuneExplosion: null,
        isExplodeMob: null,
        isDroneOnDamage: null,
        isAcidDmg: null,
        isAnnihilation: null,
        largerHeals: null,
        squirrelFx: null,
        isCrit: null,
        isLowHealthDmg: null,
        isFarAwayDmg: null,
        isEntanglement: null,
        isMassEnergy: null,
        isExtraChoice: null,
        laserBotCount: null,
        dynamoBotCount: null,
        nailBotCount: null,
        foamBotCount: null,
        boomBotCount: null,
        plasmaBotCount: null,
        missileBotCount: null,
        orbitBotCount: null,
        collisionImmuneCycles: null,
        blockDmg: null,
        isPiezo: null,
        isFastDrones: null,
        isFastSpores: null,
        oneSuperBall: null,
        laserReflections: null,
        laserDamage: null,
        laserFieldDrain: null,
        isAmmoFromHealth: null,
        mobSpawnWithHealth: null,
        isEnergyRecovery: null,
        isHealthRecovery: null,
        isEnergyLoss: null,
        isDeathAvoid: null,
        isDeathAvoidedThisLevel: null,
        isSporeField: null,
        isMissileField: null,
        isIceField: null,
        isPlasmaRange: null,
        isFreezeMobs: null,
        isIceCrystals: null,
        throwChargeRate: null,
        isBlockStun: null,
        isStunField: null,
        isHarmDamage: null,
        energyRegen: null,
        isVacuumBomb: null,
        renormalization: null,
        fragments: null,
        isEnergyDamage: null,
        botSpawner: null,
        isBotSpawnerReset: null,
        isSporeFollow: null,
        isNailRadiation: null,
        isEnergyHealth: null,
        isExplosionStun: null,
        restDamage: null,
        isRPG: null,
        missileCount: null,
        isDeterminism: null,
        isSuperDeterminism: null,
        isHarmReduce: null,
        nailsDeathMob: null,
        isSlowFPS: null,
        isNeutronStun: null,
        isAnsatz: null,
        isDamageFromBulletCount: null,
        isLaserDiode: null,
        isNailShot: null,
        slowFire: null,
        fastTime: null,
        squirrelJump: null,
        isFastRadiation: null,
        isExtraMaxEnergy: null,
        isAmmoForGun: null,
        isRapidPulse: null,
        isPulseAim: null,
        isSporeFreeze: null,
        isShotgunRecoil: null,
        isHealLowHealth: null,
        isAoESlow: null,
        isHarmArmor: null,
        isTurret: null,
        isRerollDamage: null,
        isHarmFreeze: null,
        isBotArmor: null,
        isRerollHaste: null,
        researchHaste: null,
        isMineDrop: null,
        isRerollBots: null,
        isNailBotUpgrade: null,
        isFoamBotUpgrade: null,
        isLaserBotUpgrade: null,
        isBoomBotUpgrade: null,
        isOrbitBotUpgrade: null,
        isDroneGrab: null,
        isOneGun: null,
        isDamageForGuns: null,
        isGunCycle: null,
        isFastFoam: null,
        isSporeGrowth: null,
        isStimulatedEmission: null,
        nailGun: null,
        nailInstantFireRate: null,
        isCapacitor: null,
        isEnergyNoAmmo: null,
        isFreezeHarmImmune: null,
        isSmallExplosion: null,
        isExplosionHarm: null,
        extraMaxHealth: null,
        // bonusHealth: null,
        isIntangible: null,
        isCloakStun: null,
        bonusEnergy: null,
        healGiveMaxEnergy: null,
        healMaxEnergyBonus: 0, //not null
        aimDamage: null,
        isNoFireDefense: null,
        isNoFireDamage: null,
        duplicateChance: null,
        beamSplitter: null,
        iceEnergy: null,
        isPerfectBrake: null,
        explosiveRadius: null,
        isWormholeEnergy: null,
        isWormholeDamage: null,
        isNailCrit: null,
        isFlechetteExplode: null,
        isWormholeSpores: null,
        isWormBullets: null,
        isWideLaser: null,
        wideLaser: null,
        isPulseLaser: null,
        isRadioactive: null,
        isRailEnergyGain: null,
        isMineSentry: null,
        isIncendiary: null,
        overfillDrain: null,
        isNeutronSlow: null,
        isRailAreaDamage: null,
        historyLaser: null,
        isSpeedHarm: null,
        isSpeedDamage: null,
        isTimeSkip: null,
        isCancelDuplication: null,
        cancelCount: null,
        isCancelRerolls: null,
        isBotDamage: null,
        isBanish: null,
        isMaxEnergyTech: null,
        isLowEnergyDamage: null,
        isRewindBot: null,
        isRewindGrenade: null,
        isExtruder: null,
        isEndLevelPowerUp: null,
        isRewindGun: null,
        missileSize: null,
        isLaserMine: null,
        isAmmoFoamSize: null,
        isIceIX: null,
        isDupDamage: null,
        isFireRateForGuns: null,
        cyclicImmunity: null,
        isTechDamage: null,
        isRestHarm: null,
        isFireMoveLock: null,
        isRivets: null,
        isNeedles: null,
        isExplodeRadio: null,
        isGunSwitchField: null,
        isNeedleShieldPierce: null,
        isDuplicateBoss: null,
        is100Duplicate: null,
        isDynamoBotUpgrade: null,
        isBlockPowerUps: null,
        isBlockHarm: null,
        foamFutureFire: null,
        isDamageAfterKill: null,
        isHarmReduceAfterKill: null,
        isSwitchReality: null,
        isResearchReality: null,
        isAnthropicDamage: null,
        isFlipFlop: null,
        isFlipFlopHarm: null,
        isFlipFlopOn: null,
        isFlipFlopLevelReset: null,
        isFlipFlopDamage: null,
        isFlipFlopEnergy: null,
        isRelay: null,
        relayIce: null,
        isMetaAnalysis: null,
        isFoamAttract: null,
        droneCycleReduction: null,
        droneEnergyReduction: null,
        isNoHeals: null,
        isAlwaysFire: null,
        isDroneRespawn: null,
        deathSpawns: null,
        isMobBlockFling: null,
        blockingIce: null,
        isPhaseVelocity: null,
        waveBeamSpeed: null,
        wavePacketAmplitude: null,
        isCollisionRealitySwitch: null,
        iceIXOnDeath: null,
        wimpCount: null,
        isAddBlockMass: null,
        isMACHO: null,
        isHarmMACHO: null,
        isSneakAttack: null,
        isFallingDamage: null,
        harmonics: null,
        isStandingWaveExpand: null,
        isTokamak: null,
        superBallDelay: null,
        isBlockExplode: null,
        isOverHeal: null,
        isDroneRadioactive: null,
        droneRadioDamage: null,
        isDroneTeleport: null,
        isDroneFastLook: null,
        isBulletTeleport: null,
        isResearchBoss: null,
        isJunkResearch: null,
        junkResearchNumber: null,
        laserColor: null,
        laserColorAlpha: null,
        isLongitudinal: null,
        is360Longitudinal: null,
        isShotgunReversed: null,
        wormDuplicate: null,
        isCloakingDamage: null,
        harmonicEnergy: null,
        isFieldHarmReduction: null,
        isFastTime: null,
        isAnthropicTech: null,
        isSporeWorm: null,
        isWormShot: null,
        isFoamShot: null,
        isIceShot: null,
        isNeedleShot: null,
        isBlockRestitution: null,
        isZeno: null,
        isFieldFree: null,
        wormSurviveDmg: null,
        isExtraGunField: null,
        isBigField: null,
        isMineStun: null,
        isSmartRadius: null,
        isFilament: null,
        // isSpear: null,
        isLargeHarpoon: null,
        extraHarpoons: null,
        ammoCap: null,
        regularization: null,
        isHarpoonPowerUp: null,
        harpoonDensity: null
    }