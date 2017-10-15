whether it is possible to use the back button ought to be phase-dependent; no going back and re-running certain actions.

to attack a territory,
account for normal moves, amphib, blitz, & possible carrier landing
plus strategic bombing.

there's not a clear line between units already there, and units being moved in - specifically, ships can be moved during combat phase to join existing pieces of same type.

-[] repair
-[x] research
  -[]save to firebase
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
   -[x] amphib assault
   -[] commit to shore bombardment
   -[] sub movement
   -[] convoy attack
   -[x] straits
   -[x] prevent amphib battle until naval battle concludes
 -[x] enter undefended territory
[] combat
  -[x] dogfight
  -[x] strategic bomb
  -[] sub strike
  -[] combat modifiers (banzai, etc)
   -[x] artillery support
   -[] somehow no arty support on amphib - is that right?
  -[x] display die rolls, then combat board
  -[x] display combat board
  -[x] automate defensive casualties
  -[x] allow attacker to choose casualties
  -[x] advance from one round of combat to the next
  -[] allow retreat
  -[x] finish combat in one territory
    -[x] mark control of territory
    -[x] indicate units have moved
  -[x] finish all combat
[] land planes
  -[x] land
  -[] carrier
[] noncombat movement
  -[] identify units which have not moved
[x] place purchases
[x] advance to next turn

software issues
[x]game creation
[x]logging in
[]what do non-logged-in users see?
[]log


different types of combat (normal, amphib(?), strat bomb, shore bombard)
could be accounted for by placing a _mission_ prop on units in unitsFrom; when a unit gets committed to a type of combat, it gets a mission assigned

combat progression
1st battleboard: choices are 'roll for combat' or 'back'/'choose other territory'
* 'back'/'choose other' work the same, return user to picking territory
* 'roll for combat' is irreversible 
  * after 'roll for combat', next screen is choose casualties
  "the attacking units got x hits and the defenders got x hits; select x units to remove and press ok"
  the number you need to select is dynamic

2nd battleboard: choices are 'roll for combat', 'back' (to casualty selection), or 'retreat options'.

the problems are that I need to communicate landPlanes state to board state, and in a reversible way.

I have assembled information into state.landPlanes. some action is needed to gather that state and pass it to the board reducer. the resulting state must be reversible, meaning some other action could take the landed planes out of their territories and put them back. 

strategic bombing: 1st account for aa; then for dogfight; then for bomb itself

rules for harbor: enemy air attack only; harbor has automatic aa

prevent noncom movement of air unit to sea space unless carrier present

