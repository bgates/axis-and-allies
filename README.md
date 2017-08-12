there are multiple state components:
-turn phase
-whose turn
-board status (unit placement and territory control)
-who is logged in
-power status (tech, cash, capital)

then there are props, like territories.json (name, OP, ipc, adjacent, dimensions, sea, seaport, airport)

much of what is displayed on the board is the same for every turn phase
but what happens when a territory is clicked is phase-dependent
the overlay is also phase-dependent

it's not just that what is _displayed_ is phase-dependent, but what _events_ can occur are too. conditional event dispatch.
the event to be dispatched from, say, a click on a territory, is phase-dependent. also, whether it is possible to use the back button ought to be phase-dependent; no going back and re-running certain actions.
I ought to be able to generate that much: the sequence of events to get through a turn.


now I get the first forward/back problem. when going from income to combat, currentPower has to get an amount, and when going back, that amount must be subtracted.

to attack a territory,
account for normal moves, amphib, blitz, & possible carrier landing
plus strategic bombing.

there's not a clear line between units already there, and units being moved in - specifically, ships can be moved during combat phase to join existing pieces of same type.

for load and move, each unit must be taken out of its origin territory and placed in destination; so must the transport
no, the cargo can't be placed in _destination_, it must be placed in _transport_. otherwise no way to know which land units move back when a given transport uncommits.

now instead of qty I keep track of ids for each unit. that way I can have per-unit data like cargo. when unit(s) move, their per-each data move with them.
ok, in a territory, there are transports. the transports obj has an array of ids. (if only one transport, the array has a single member.)

practice what I preach:
-[] repair
-[x] research
  -[]save to fb
  -[x]prevent back button from going too far
  -[x]if r&d spend, go back only to research results
[] rockets
[x] purchase
  -[] special units (naval air, marines)
[x] income
[] combat movement
 -[x] normal land
   -[] blitz
 -[x] normal air
   -[] account for aa
 -[x] strategic bombing/escort
 -[x] normal sea
   -[x] transport
   -[] amphib assault
   -[] commit to shore bombardment
   -[] sub movement
[] combat
  -[] dogfight
  -[] strategic bomb
  -[] sub strike
  -[] combat modifiers (banzai, etc)
  -[x] display die rolls, then combat board
  -[x] display combat board
  -[x] automate defensive casualties
  -[] allow attacker to choose casualties
  -[] advance from one round of combat to the next
  -[] allow retreat
  -[] finish combat in one territory
    -[] mark control of territory
    -[] indicate units have moved
  -[] finish all combat
[] land planes
  -[] carrier, land
[] noncombat movement
  -[] identify units which have not moved
[] place purchases
[] advance to next turn

software issues
[]game creation
[]logging in
[]what do non-logged-in users see?
[]log


different types of combat (normal, amphib(?), strat bomb, shore bombard)
could be accounted for by placing a _mission_ prop on units in unitsFrom; when a unit gets committed to a type of combat, it gets a mission assigned

roll for combat: player rolls, opponent rolls
also establishes that something irreversible has happened

after seeing the rolls, calculate/choose casualties
the casualty board will look just like the battle board, except that 
- the defender will have casualties depicted
- the attacker will be able to choose casualties
- that's about it

combat progression
1st battleboard: choices are 'roll for combat' or 'back'/'choose other territory'
* 'back'/'choose other' work the same, return user to picking territory
* 'roll for combat' is irreversible 
  * after 'roll for combat', next screen is choose casualties
  "the attacking units got x hits and the defenders got x hits; select x units to remove and press ok"
  the number you need to select is dynamic

2nd battleboard: choices are 'roll for combat', 'back' (to casualty selection), or 'retreat options'.

if eventually all defenders are destroyed, moving on from casualty selection flips territory ownership
