import {F, LimitPerLine, O, Option, OptionLike, R, S, W} from '../options';

/// Given a set of item names, generates a variety of options for getting different interesting
/// subsets of them. The result is formatted into the "format" string, which is automatically
/// pluralized if necessary.
///
/// If the `count` option is provided, it's used in place of `format` for the "{0} of this type"
/// option. If the `plural` option is provided, it's used in place of `format` when multiple items
/// are requested.
function subset(
  singular: string,
  items: Array<OptionLike>,
  {count, plural}: {count?: string; plural?: string} = {}
): Option {
  return O(
    F(count ?? `${singular}s`, items.length === 3 ? O(1, 2) : R(items.length - 3, items.length)),
    F(plural ?? `${singular}s`, F('{0} and {0}', S(...items))),
    F(singular, S(...items))
  );
}

// Options that can only be achieved by finding specific items that could theoretically be anywhere.
// A critical mass of these squares is crucial for a good bingo board, because they ensure that *you
// don't know which line will bingo before you start*.
//
// While there are some exceptions, especially for certain randomizer settings, for the most part
// any option in this list can show up anywhere in the game. This variance means that all bingo
// squares are potentially relevant for most of the duration of the game, that players have to take
// multiple challenges seriously, and that any item could potentially produce a win.
const exploration = S(
  O(
    F('Find {0} Spiritfalls', O(3, 4)),
    F('Get both {0} Spiritfalls', O('offsensive', 'defensive'))
  ),
  S(
    F('Kill {0} Ashina General minibosses', O(2, 3)),
    F('Kill {0} Shichimen Warriors', O(2, 3)),
    F('Kill {0} Lone Shadow minibosses', O(2, 3, 4)),
    F('Kill {0} Drunkards, Gluttons, and/or Red Guards', O(2, 3, 4)),
    F('Kill both {0}', [
      'Centipedes',
      'Snake-Eyes',
      'Seven Ashina Spears',
      'Bulls',
      'Ogres',
      'Ashina Elites',
    ])
  )
    .only(3)
    .weight([400, 100, 50]),
  F('Defeat {0}', [
    'Demon of Hatred',
    'Father Owl',
    'Sword Saint',
    'Shura Isshin',
    'Divine Dragon',
    '2 Genichiros',
    O(
      F('{0} of memory bosses', ['a matched pair', 'two matched pairs']),
      F('both {0} or both {0} memory bosses', ['Owl', 'Isshin', 'Ape', 'Lady Butterfly', 'Monk'])
    ).weight(200),
  ]).weight([300, 100, 50]),
  // Unique items
  F('Find {0}', [
    'Hidden Tooth',
    'Ceremonial Tanto',
    'Five-Color Rice',
    "Jinza's Jizo Statue",
    'Nightjar Monocular',
    "Academic's Red Lump",
    'Taro Persimmon',
    'Dragon Tally Board',
    'Red and White Pinwheel',
    // This is much harder than the rest of the items because it requires finding three *specific*
    // items.
    W(50, 'Dancing Dragon Mask'),
  ]),
  // Ending items
  F('Find {0}', ['Frozen Tears', "Divine Dragon's Tears", 'Aromatic Flower']),
  F('Learn {0}', [
    S(
      // List high-tier skills as the individual skills to search for. In theory all skills could be
      // individual options since they're all equally likely to be easy or hard to obtain, but
      // exclusively listing the high-tier skills makes it feel extra exciting while still providing
      // plenty of variety.
      //
      // Weight 500 so each individual skill has the same likelihood as any other entry in this
      // list.
      F('the {0} skill', [
        'Ashina Cross',
        'the Devotion skill',
        'the Floating Passage skill',
        'the High Monk skill',
        'the Vault Over skill',
      ]).weight(500),
      // For skills with both high- and low-tier variants, ask players to either obtain both or just
      // the higher tier.
      O('both Force skills', 'the Living Force skill'),
      O('both Ichimonji skills', 'the Ichimonji: Double skill'),
      O('both Mortal Draw skills', 'the Empowered Mortal Draw skill'),
      O('both Virtuous Deed skills', 'the Most Virtuous Deed skill'),
      O('both Passage skills', 'the Spiral Cloud Passage skill'),
      O('both Shadow____ skills', 'the Shadowfall skill'),
      // Both variants of these skills are relatively low-tier.
      //
      // Weight 500 so each individual skill has the same likelihood as any other entry in this
      // list.
      F(
        'both {0} skills',
        S('Praying Strikes', 'Carp', 'Nightjar Slash', 'Suppress', "Emma's Medicine")
      ).weight(500)
    ).weight(200),
    // 5 total: two Shinobi's, two Sculptor's, and Beast's
    O(F('both {0} Karma skills', ["Shinobi's", "Sculptor's"]), F('{0} Karma skills', [3, 4])),
    // 4 total: Breath of Nature/Life: Light/Shadow
    O(
      F('both Breath of {0} skills', ['Nature', 'Life']),
      F('both Breath of ____: {0} skills', ['Light', 'Shadow']),
      F('{0} Breath skills', [3, 4])
    ),
    // 3 total: Combat Arts, Deflection, Prosthetic Tool
    subset('Mid-Air {0} skill', ['Combat Arts', 'Deflection', 'Prosthetic Tool'], {
      count: '{0} Mid-Air skills',
    }),
    // 3 total: Rank 1, 2, and 3
    subset('Shinobi Medicine Rank {0} skill', [1, 2, 3], {
      count: '{0} Shinobi Medicine skills',
    }),
  ])
    .only(3)
    .weight([300, 100, 50]),
  // Many of these upgrades don't directly require specific items other than the Mechanical Barrel,
  // which will often show up early if the player has any kind of standard item distribution
  // enabled. However, every upgrade does require the player to find the base weapon and since the
  // upgrade order is itself randomized it'll often be blocked on other prosthetics or special
  // upgrade materials as well.
  S(
    O(
      'Fit the Loaded Axe tool',
      'Upgrade to the Lazulite Axe',
      'Upgrade to the Sparking Axe',
      'Upgrade to the Spring-load Axe'
    ),
    O(
      'Fit the Loaded Shuriken tool',
      'Upgrade to the Phantom Kunai',
      'Upgrade to the Sen Throw',
      'Upgrade to the Gouging Top',
      'Upgrade to the Lazulite Shuriken',
      'Upgrade to the Spinning Shuriken'
    ),
    O(
      'Fit the Loaded Spear tool',
      'Upgrade to the Spiral Spear',
      'Upgrade to the Leaping Flame',
      'Upgrade to the Loaded Spear Thrust Type',
      'Upgrade to the Loaded Spear Cleave Type'
    ),
    O(
      'Fit the Loaded Umbrella tool',
      "Upgrade to the Phoenix's Lilac Umbrella",
      "Upgrade to the Suzaku's Lotus Umbrella",
      'Upgrade to the Loaded Umbrella - Magnet'
    ),
    O(
      'Fit the Flame Vent tool',
      "Upgrade to the Okinaga's Flame Vent",
      'Upgrade to the Lazulite Sacred Flame',
      'Upgrade to the Spring-load Flame Vent',
      'Upgrade to the Long Spark'
    ),
    O(
      'Fit the Shinobi Firecracker tool',
      'Upgrade to the Sprig-load Firecracker',
      'Upgrade to the Purple Fume Spark'
    ),
    O(
      'Fit the Sabimaru tool',
      'Upgrade to the Lazulite Sabimaru',
      'Upgrade to the Piercing Sabimaru',
      'Upgrade to the Improved Sabimaru'
    ),
    O(
      'Fit the Mist Raven tool',
      'Upgrade to the Aged Feather Mist Raven',
      'Upgrade to the Great Feather Mist Raven'
    ),
    O(
      'Fit the Divine Abduction tool',
      'Upgrade to the Golden Vortex',
      'Upgrade to the Double Divine Abduction'
    ),
    O('Fit the Finger Whistle tool', 'Upgrade to the Malcontent', 'Upgrade to the Mountain Echo')
  )
    .only(2)
    .weight([200, 50]),
  F('Find {0}', [
    subset('{0} Note', [
      "Dosaku's",
      'Fragrant Flower',
      'Promissory',
      "Tomoe's",
      "Rotting Prisoner's",
    ]),
    subset('{0} Memo', [
      'Flame Barrel',
      'Nightjar Beacon',
      'Sabimaru',
      'Three-Story Pagoda',
      'Valley Appartions',
    ]),
    subset('{0} Letter', ["Isshin's", 'Ornamental', "Surgeon's Stained"]),
    // Can't just write "both Texts" because it's confusing with skill texts and esoteric texts.
    F('both {0}s', ['Holy Chapter', 'Scrap', "Immortal Severance and Okami's Ancient Text"]),
    // Weight these relatively lower because they have less variety than the other options.
    W(50, ['Black Scroll', 'Rat Description']),
  ])
    .only(2)
    .weight([200, 100]),
  // Miscellaneous options, grouped together to keep them from having a ton of relative weight by
  // virtue of being on the same level as options that have a bunch of different sub-options.
  S(
    // Equivalent to finding White Pinwheel and Divine Abduction, plus beating Genichiro's
    // replacement and Monkeys.
    'Talk to Kotaro in the Halls of Illusion',
    // Equivalent to finding Red Carp Eyes and Dosaku's Note.
    'Kill red-eyed Doujun and his red-eyed creation',
    subset('Find {0} Ninjutsu', ['Puppeteer', 'Bloodsmoke', 'Bestowal']),
    'Kill a Shichimen Warrior with an Anti-Air Deathblow',
    'Give Water of the Palace to the Mibu priest',
    'Exchange Rice for Kuro for an item',
    'Give Great White Whisker to the Great Carp Attendant',
    'Give Sakura Droplet to Kuro',
    // Equivalent to getting one of two precious baits and making it to Fountainhead.
    "Collect the item from the Great Carp's corpse",
    'Exchange both Serpent Viscera with the Divine Child for an item',
    F('Open the {0} in Ashina Reservoir', ['gatehouse', 'secret passage']),
    subset('Find Mottled {0} Gourd', ['Purple', 'Green', 'Red'], {
      count: 'Find {0} Mottled Gourds',
    })
  )
);

// Options that can and will be achieved by progressing far enough into the game. While exploration
// options is that those could be triggered very early or could be triggered very late, a canny
// player will usually be able to guess before the game starts approximately when a progression
// option will be triggered.
//
// As a consequence, these are less valuable than exploration options in terms of informing player
// behavior. That doesn't mean they're valueless, though! They inform what the player focuses on
// (saving rather than spending sen/scales, killing minibosses they might otherwise skip, etc),
// encourage the player to go deep rather than go wide, and provide an appealing variant in what the
// bingo asks. They should, however, appear sparingly on the board as too many of these in the same
// line can make the optimal path too deterministic.
//
// The line between exploration and progression can be blurry. "Find X Spiritfalls" is exploration
// while "Finding X beverages" is progression just because of the relative density of those two
// categories. The crucial question is, how confident is the player about when they're likely to
// achieve the goal?
const progression = S(
  // Plot items required to unlock Fountainhead are considered progression because they *can't*
  // appear in the lategame.
  O(
    'Find Lotus of the Palace',
    'Find Shelter Stone',
    'Find Aromatic Branch',
    // Equivalent to finding the Mortal Blade
    'Kill Hanbei the Undying (for good)'
  ),
  // 10 total
  F('Collect {0} prayer necklaces', R(6, 9)),
  // 9 total
  F('Collect {0} gourd seeds', R(6, 8)),
  // 14 total
  F('Collect {0} memories', R(8, 13)),
  // 13 total: 9 sakes, 3 monkey boozes, 1 water of the palace
  F('Possess {0} beverages at one time', R(8, 12)),
  O(
    F('Possess at least {0} sen at one time', R(10000, 18000)),
    F('Buy out {0} and {0}', [
      "Crow's Bed Memorial Mob",
      'Battlefield Memorial Mob',
      'Blackhat Badger',
      'Anayama the Peddler',
      'Fujioka the Info Broker',
      'Dungeon Memorial Mob',
      'Shugendo Memorial Mob',
      'Toxic Memorial Mob',
      'Exiled Memorial Mob',
    ]).weight(300)
  ),
  O(
    // 35 total, 7 from Fountainhead carp, 7 from underwater carp
    F('Possess {0} carp scales at one time', R(14, 28)),
    'Buy all items from one Pot Noble'
  ),
  F('Accumulate {0} skill points ({1} if skills are items)', R(8, 12), R(16, 22)),
  F(
    'Kill the minibosses {0} and {0}',
    'on the Ashina Castle stairs',
    'in Temple Grounds',
    'by the Water Mill',
    'by the Moon-View Tower',
    'in the Serpent Shrine',
    'by the Hidden Forest campfire',
    'on the Ashina Castle ground floor',
    'outside Mibu Manor in Fountainhead',
    'on the Fountainhead tree',
    'by the Fountainhead waterfall',
    'by the Ashina Reservoir idol'
  )
    .only(2)
    .weight([200, 100]),
  O(
    F('Collect at least {0} {1}', R(40, 60), ['Scrap Iron', 'Scrap Magnetite']),
    F('Collect at least {0} {1}', R(30, 45), [
      'Adamantine Scrap',
      'Black Gunpowder',
      'Yellow Gunpowder',
    ]),
    F('Collect at least {0} {1}', R(15, 25), [
      'Fulminated Mercury',
      'Lump of Fat Wax',
      'Lump of Grave Wax',
    ])
  )
);

// Options that the player can do more or less on demand (at least after unlocking Ashina Castle and
// Hirata 1), but that take a non-trivial amount of time and effort to actually execute. In many
// cases these will be the last squares to be filled out after the rest of a line is complete, but
// the very best challenge options require the player to work on them (or actively decide not to)
// from the beginning of the run.
//
// Challenge options give the player agency over how they fill out the bingo board and produce
// exciting "last mile" moments where they player knows they have a bingo within their grasp but
// still need to nail the execution in order to count it. They should be the next most represented
// category after exploration options.
const challenge = S(
  // These are the most valuable challenges because they become *less* available as the player moves
  // through the game. The player is incentivized to complete thse challenges as they go, rather
  // than saving them until the rest of a row is filled out.
  S(
    // Weight the one-attempt options a little higher—since they can only be attempted once per
    // boss, they're more dynamic and exciting than other options.
    F('Kill {0} memory bosses in one attempt', [1, 2, 3]).weight(200),
    F('Kill {0} non-easy minibosses in one attempt', [4, 5, 6]).weight(200),
    F('Kill {0} memory bosses with Bell Demon', [1, 2, 3]),
    F('Kill {0} non-easy minibosses with Bell Demon', [4, 5, 6]),
    F('Kill {0} non-easy mini/bosses without taking damage from the boss', [3, 4, 5]),
    F(
      'Kill {0} non-easy mini/bosses without attacking except deathblows {1}',
      [3, 4, 5],
      ['', 'and combat arts']
    ),
    F('Kill {0} non-easy mini/bosses without blocking/deflecting', [3, 4, 5]),
    F('Kill {0} non-easy mini/bosses without touching the control stick or arrow keys', [2, 3, 4]),
    F('Kill the miniboss {0}', [
      'in Temple Grounds without using the rafters',
      'in the tutorial',
      F('{0} without killing the mobs', [
        'on the Ashina castle stairs',
        'by the Hidden Forest campfire',
        'in the Hirata Estate Main Hall',
        'before the Ashina Castle idol',
        'before the Underbridge Valley idol',
      ]).only(1),
    ]),
    'Kill both minibosses in Ashina Outskirts before moving past them'
  )
    .only(4)
    .weight([800, 300, 50, 25]),
  F('Kill all enemies {0}', [
    'in the Senpou Temple attic',
    "in Doujun's cave (except in cells)",
    'guarding Monkey Booze in Bodhisattva Valley',
    'in the Hidden Forest temple grove before clearing the mist',
  ])
    .only(2)
    .weight([100, 50]),
  // Since the randomizer default doesn't include headless in the pool with other minibosses, we
  // consider them challenge options rather than an exploration options.
  F('Kill {0} Headless', [1, 2, 3, 4, 5]),
  'Go from Bodhisattva Valley idol to Main Hall idol without resting',
  F('Get {0} deathblows without resting', R(15, 30)),
  F('Kill {0}', [
    "both mini/bosses in the Guardian Ape's Burrow",
    // While this is mandatory to open Hirata 2 and so may block completing the game, it's unlikely
    // that that will be required to complete a bingo except on high bias.
    'the memory bosses at the end of the first Hirata Estate',
    // This is usually *not* mandatory in randomizer, since all you need to open the path to
    // Fountainhead are Lotus of the Palace, Mortal Blade, Shelter Stone, and Aromatic Branch.
    'the memory boss on Ashina Castle after the first invasion',
  ])
);

// Prohibition options are marked by default, and can only become *un*-marked if the player violates
// some restriction on their behavior. They add spice to the bingo board, because they force the
// player to constantly think: is this square's position worth the price to follow this restriction?
// At what point is it better to abandon it to accelerate the other squares?
//
// We usually want one of these, but they become problematic in multiples as they can make
// individual lines *too* easy to achieve, so we limit them to three per board.
const prohibition = S(
  // This prohibition is particularly useful because it counterbalances the otherwise extremely
  // memory-heavy distribution of low-bias settings.
  F('Do not exceed {0} Attack Power', [4, 5, 6, 7, 8]).weight(300),
  F('Never use {0}', ['a combat art', 'either Mortal Draw']),
  'Never use a temporary buff item except Divine Confetti',
  'Never use a stealth kill on a mini/boss',
  'Never use a Mikiri Counter',
  O(
    'Never use a prosthetic tool in combat',
    F('{0} use bladed prosthetic tools in combat', ['Exclusively', 'Never']),
    F('{0} use fire prosthetic tools in combat', ['Exclusively', 'Never']),
    F('Exclusively use prosthetic tools that cost {0} spirit emblems in combat', [1, 2, 3])
  ),
  O(
    F('Do not exceed {0} gourd charges', [3, 4, 5]),
    F('Never use a healing consumable {0}', ['', 'except Pellets'])
  )
);

// Weight here totals to 25, and so represents the average number of squares each type is expected
// to take on a bingo board.
//
// We require between 15 and 20 exploration squares to ensure that the board is neither too
// deterministic nor too chaotic.
export const options = S([
  exploration.only(20).weight(17),
  new LimitPerLine(3, [
    challenge.weight(4),
    progression.weight(2.5),
    new LimitPerLine(1, prohibition).weight(1.5).only(3),
  ])
    .only(15)
    .weight(8),
]);
