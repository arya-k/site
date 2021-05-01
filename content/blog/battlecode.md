+++
title = "bc19 post-mortem: plzgoeasy"
date = 2019-02-02
description = "My thoughts on BattleCode 2019, competing as team plzgoeasy in MIT's annual competition."
+++

This year I did BattleCode with Alan Zheng and Ajith Kemisetti, two of my classmates at Thomas Jefferson HS for Science and Technology. Our bot, _plzgoeasy_, was moderately successful, placing 7th in the seeding tournament. So, in keeping with a [long tradition](http://www.anatid.net/2014/12/battlecode-links.html) of post-mortems, here are my thoughts on BattleCode 2019.

Our bot has been [open sourced](https://github.com/arya-k/bc19) if you'd like to take a look.

![Testing our code against the Devs' team](https://i.imgur.com/fqdGG0r.png)

## Battlecode: Crusades in Javascript!

This year, BattleCode was centered around a religious conquest of Mars. There were two ways to win: castle destruction, or unit health. If you want an in-depth overview of the game, check out the [specs](https://battlecode.org/dash/docs) - here I'll provide a brief overview.

#### The Units
<table>
  <tr>
    <td width="10%" align="center"><img src="https://i.imgur.com/inmT3Lc.png" width="60px"/></td>
    <td>Castles were the main base this year, capable of spawning all kinds of units except churches. They could receive 8-bit signals (<code>castle_talk</code> messages) from all troops for free, every turn.</td>
  </tr>
  <tr>
    <td align="center"><img src="https://i.imgur.com/AkKJ2jX.png" width="60px"/></td>
    <td>Pilgrims were both scouts and miners. Mined resources did not immediately enter the global store - they had to be deposited at a base (castle or church)</td>
  </tr>
  <tr>
    <td align="center"><img src="https://i.imgur.com/0JIExIO.png" width="60px"/></td>
    <td>Crusaders were like the knights of years past. They moved faster than other units, and had a reasonable amount of health</td>
  </tr>
  <tr>
    <td align="center"><img src="https://i.imgur.com/CwTf5V1.png" width="60px"/></td>
    <td>Prophets were long range units, who couldn&#39;t attack when units were within a certain range. Relatively expensive to move and to shoot.</td>
  </tr>
  <tr>
    <td align="center"><img src="https://i.imgur.com/lt1Q3uQ.png" width="60px"/></td>
    <td>Preachers were the tanks. Expensive to move, low visibility, high health and high damage in a splash radius.</td>
  </tr>
  <tr>
    <td align="center"><img src="https://i.imgur.com/ZdVtLAq.png" width="60px"/></td>
    <td>Churches could be spawned by pilgrims, and acted like castles, minus the <code>castle_talk</code> messages and the ability to shoot enemy troops.</td>
  </tr>
</table>

#### Limited Communication

The game this year was much simpler than last year in terms of the units themselves- no tech. tree, simpler unit interactions, etc. The devs added some complexity through a highly constrained communication system. Every turn, every robot could send `castle_talk` messages back to castles, with each message containing 8 bits of information. This was extremely limited - it would take two turns just to send a single coordinate. The other kind of message you could send was a 16 bit `signal` message, but that message was visible to everyone within the signal radius, and it cost fuel to send the message (originally proportional to r^2, but later simplified to be proportional to r).

#### Resources

This year there were two kinds of resources - karbonite, which was used to produce resources, and fuel, which was expended for every action and for spawning robots as well. Most teams were fuel constrained by the mid and endgame, so managing economy was extremely important. Resource deposits were spread in clusters throughout the map, so resource control also ended up being extremely important.

#### The Meta

This year, the game was not super well balanced. The dominating strategy was to build up a “lattice” of units, and just expand the lattice around your base, making sure to not run out of fuel. Almost every team tried to win exclusively with unit health. This was because it was almost always more expensive to attack than to defend - so if you couldn't horde your enemy with overwhelming numbers, it was almost never worth it to attack.

## Week 1: Crusader Spam

When we first saw the specs, we were determined to have a working implementation of a bot as quickly as possible. We didn't put a ton of though into a brilliant strategy. We figured that in the first week, it was way more important to develop the architecture that we would need later on in the competition - the communications system, pathfinding and basic code structure.

On a rainy day after school, the three of us sat in a cafe and planned out our code in detail. We settled on a 3-stage strategy, beginning with an _exploration_ mode, where we sent out pilgrims escorted by crusaders. This was an interesting strategy that was on some level later copied by other teams. It worked well because early on, no-one was defending their resource spots. Since our pilgrims were always accompanied by an aggressive unit, they almost always laid claim to the resource clusters we wanted them to. After we had built up resources, we switched to the _buildup_ phase, where each church would build crusaders designed to swarm and attack the enemy. Finally, in the _attack_ phase, we would send these crusaders out, to hopefully destroy the enemy.

* * *

There were some issues with our approach - for one, the castles didn't really defend themselves much. If an enemy attacked us during an exploration or buildup phase, we wouldn't defend ourselves. To fix this, we had a single castle spawn a preacher that immediately went to attack the enemy. We also had trouble with crusaders not knowing what to do after they'd successfully killed an enemy. Less than an hour before the submission deadline closed, I whipped together a BFS search that would keep track of visible squares, and keep exploring new regions of the map, in hopes of finding a new enemy castle.

To our surprise, our bot was extremely successful in the early rounds, placing 7th in the sprint tournament!

## Weeks 2 and 3: the rise of the lattice

The predominant strategy during the seeding tournament was an immediate rush of units, to kill the enemy castle before it had a chance to build defensive units. The devs tried to counter this meta by adding castle attacks, and reducing communication costs. This rapidly shifted the meta to the lattice:

![team smite demonstrating a lattice](https://i.imgur.com/zE9ZCkc.png)

Our team from here settled on a strategy - we would aggressively expand to as many resource clusters as possible, then simply lattice at our bases and churches, and try to win on unit health.

We began by refining many of our prior implementations. Continuously escorting was horrible for fuel efficiency, so once crusaders escorted pilgrims to clusters, they stayed at the clusters instead of running back and forth. We switched to sending just one pilgrim for each cluster, and had churches fill in the remainder of the pilgrims.

Our churches and castles now had an active defense - instead of just sitting around while enemies attacked us, they would build the unit that best countered the enemy. If they sent crusaders, we'd build preachers. If they sent prophets, we'd send crusaders.

We tested out hordes of units to reclaim lost clusters, but found that they rarely worked, and prevented us from building up lattices, so we gave them up. We also tried a couple interesting attack strategies, that unfortunately were too specific, and weren't really useful in most games.

One of these strategies was a directional lattice, that would point towards the enemy castle and advance towards it. We figured that lattices were essentially impregnable as long as you had the fuel to back it up. If the enemy was close enough, aiming the lattice straight at them might actually work successfully.

We also implemented a highly specific strategy - If the castles were sufficiently close, and the map was a single-castle map, we would send out a 3 preacher rush on round 2. This rush was devastating, and often closed games within the first 20 rounds.

Finally, with so many games coming down to unit health, we implemented two strategies for the high school final. Firstly, we spawned exclusively crusaders after round 750, and stockpiled them at the back of the map. This was because crusaders had the best resource cost:health ratio, so were the best unit to build to win on unit health.

Our final health strategy was a church spam on round 999. This was something we saw many top teams doing, so we decided to imitate them. This effectively spawned pilgrims which spawned churches which spawned pilgrims, in a loop, until we ran out of resources. The idea was to expend every last bit we had on the last turn to hopefully eke out an advantage.

## Final Thoughts

What separates BattleCode from many other programming competitions is it's inherently collaborative nature. We're just programming tiny robots on a screen to play a game, but the amount of thought, strategy, laughs and late nights that went into these bots are what make them special. From the 406 commits in just 3 weeks, to the nail-bitingly close tournament games, BattleCode was an experience I thoroughly enjoyed.

Until next year!