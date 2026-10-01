# Writing Audit: narration, plot, character voices

Audit date: 2026-10-01. Written from the seat of a game writer reading the whole script cold.
Nothing in the game was changed. Every rewrite below is a proposal.

**What was read.** Every player-facing string: the intro and outro screens, the four zone transitions, all 50 level intro scenes, every puzzle header, description and hint, all portrait-click dialogue, the Level 10 inmates, the Level 18 parrot, the Level 20 gallery (items, observations, Butler commentary), the Level 21 questionnaire, the Level 30 tarot reading, the Level 45 line-up, the Level 49 murder mystery (three dialogue trees, reports, six books), the Level 50 hell tour, and UI strings (menus, feedback, hints panel, share text).

**Measured against.** `docs/NARRATIVE_DESIGN.md` (§1 dialogue rules, §1b prose rules, §2 voice specs, §3 plot) and `.continue/rules/04_dialogues-and-characters.md`. Lines the bible marks as deliberate (parrot chaos, pills and crash foreshadowing, Silas's ellipses, the Mortician's fragments) are treated as canon, not as errors.

**A note on "stewards".** I read this as the five zone hosts: Skeleton Guard, Butler, Fortune Teller, Sphinx, Devil.

---

## The short version

1. **The game has two narrators, and one is much better than the other.** The object-description narrator (Level 1 cell, Level 20 gallery) is dry, specific and funny. The transition and ending narrator is generic gothic. Rewrite the second in the voice of the first.
2. **The twist is spent by Level 30.** The forest transition shows the headlights, the brakes, the bottle and the second victim. The finale then spends thirteen paragraphs revealing what the player already knows.
3. **The Devil is four different characters.** His best material, the hell tour in `components/devil-dialogue.tsx`, is unreachable. The version players actually see is a flat catalogue in `components/game-screen.tsx`.
4. **Level 45 breaks every returning voice.** The Fortune Teller speaks fluent English, the Sphinx drops her archaic register, the Butler recites an encyclopedia, and the dialogue has 18 ellipses.
5. **Hell has no personal foreshadowing.** Levels 41 to 49 never touch the player's case. The zone that should tighten the noose is the only one that goes quiet.
6. **Stage directions repeat.** "Presents you with" appears about 30 times across level intros and puzzle headers.
7. **Puzzle headers repeat the intro scene in a worse voice.** The Skeleton's intro lines reappear above the puzzle with the dialect removed. The Fortune Teller's reappear in fluent English.
8. **The strongest writing in the game is already there.** The Skeleton, the inmates, the Fortune Teller's portrait lines and tarot reading, the Level 49 trio, and the last third of the "Neither" ending need almost nothing.

### Ship-blocking text leaks

| Where | Problem |
|---|---|
| `components/splash-screen.tsx:144` | How to Play tells every player: "For testing, use the secret key: TIENGVIET". |
| `components/final-level-puzzle.tsx:386` | The last hell floor prints "For testing: The solution is ..." on screen. |
| `data/puzzles-5.ts` Level 48 hints | "Each marble represents a different sin." The level is a code-breaker with no sin mapping. Hints 1 and 4 describe a puzzle that no longer exists. |
| `data/puzzles-5.ts` Level 49 hints | "The killer's name is related to a poisonous plant." The autopsy says there was no poison. The hints point away from the real chain of evidence. |
| `components/murder-mystery/library-view.tsx` | Unused "Librarian Priya" greeting ("Namaste... haan?"). It contradicts the live Librarian and is an accent caricature. Delete the file so it cannot resurface. |

---

## 1. Narration style

### 1.1 Two narrators

**The cell narrator** writes like this:

> "A window—if you're being generous. Gnarled bars grin down at you, chewing on the sunlight before you ever see it."

> "A face peers from the polished dimness. It is yours, mostly."

> "You consider lying down. You decide standing is safer."

> "A suit of plate armor, stood at permanent attention beside the stairs. The visor is shut. Nothing about it suggests it's always been that way."

Short sentences. A concrete object. A dry joke that leaves a little dread behind it. It also gives the player a personality without ever describing them: squeamish, wry, slightly embarrassed to be here.

**The transition narrator** writes like this:

> "Finally, you emerge into a strange twilight. In the distance, perched atop a hill, stands a grand mansion. Its windows glow with an eerie light, beckoning you forward."

> "The path leads you deep into a dense, mist-shrouded forest unlike any you've seen before. Strange lights flicker between the trunks, and whispers seem to follow your every step."

> "...a profound silence falls over the hellish landscape."

Strange, eerie, mist-shrouded, whispers, profound. Any dark fantasy game could own these sentences. This is the voice the player meets at the five most important story moments.

**Recommendation.** Make the cell narrator the house voice. Three rules cover it: name the object, keep the joke, never label the feeling.

| Where | Now | Proposed |
|---|---|---|
| Intro, paragraph 2 | "Your head throbs with a dull ache, and your memory is a fog of disconnected images. How did you get here? What crime could you have possibly committed?" | "Your head hurts in a way that suggests you earned it. You remember nothing. The cell seems to think that is your problem." |
| Prison to Mansion | "Finally, you emerge into a strange twilight. In the distance, perched atop a hill, stands a grand mansion. Its windows glow with an eerie light, beckoning you forward. With nowhere else to go, you begin the trek toward the imposing structure." | "Outside it is neither night nor day. On the hill there is a house with every window lit, the way a house is lit when someone is waiting up. You have nowhere else to be." |
| Mansion to Forest | "The path leads you deep into a dense, mist-shrouded forest unlike any you've seen before. Strange lights flicker between the trunks, and whispers seem to follow your every step." | "The path gives up after a mile. The forest does not. Between the trunks, small lights keep pace with you, and stop when you stop." |
| Desert to Hell | "The air grows hotter around you, yet you feel no fear—only a strange sense of inevitability." | "The air grows hotter. You notice you are not afraid, and wonder when that stopped." |

### 1.2 The bible's own bans, as they stand in the script

`NARRATIVE_DESIGN.md` §1b bans a list of words in narration. Current counts across narration, intros, hints, endings and Level 45:

| Word or pattern | Count | Worst offenders |
|---|---|---|
| "presents you with" | 30 | 12 in level intros, 18 in puzzle headers, mostly zones 3 to 5 |
| "ancient" | 33 | Desert intros, hints, Level 45 |
| "journey" | 25 | Level 45 (8), outro, transitions, tarot end screen |
| "whisper" | 12 | "she whispers" seven times across zone 3 intros and descriptions |
| "mysterious" | 7 | "mysterious map", "five mysterious chests", "mysterious patterns" |
| Em dashes in narration | 11 in the outro alone | "Not forgotten—never that—but no longer a chain" |
| "profound", "cacophony", "intricate", "navigate", "serves as" | 1 to 4 each | Outro, scarab pedestals, crystal compendium |

One simile is used twice for two characters. The intro gives the Skeleton a "voice like dry leaves scrapin' against stone". The forest transition gives the Fortune Teller a "voice like dry leaves rustling in a Transylvanian wind". Keep it for the Skeleton.

### 1.3 Level intro scenes

Zones 1 and 2 open on a line of dialogue and a gesture. Zones 3 to 5 fall back on a template: "The X presents you with Y." Twelve intros use it. Three Sphinx intros (33, 37, 39) have her say nothing at all, which reads as unwritten once it happens three times.

| Level | Now | Proposed |
|---|---|---|
| 24 | "The gypsy woman presents you with fragments of a crystal mosaic." | "She tips a cloth bag onto the table. It was a mosaic once." |
| 36 | "The Sphinx presents you with a challenge of construction." | "Cut stone waits in the sand. The Sphinx looks at the blocks, then at you." |
| 41 | "The Devil presents you with a mysterious map of Central Asia." | "The Devil unrolls a map of Central Asia across a table that was not there a moment ago." |
| 35 | Narration placed inside the Sphinx's quotation marks: "The sands shift to reveal a pattern of symbols..." | Move it out of the quotes. The level is flagged as a placeholder in the Kanban anyway. |

### 1.4 Headers duplicate the intro, in a different voice

`puzzle-content.tsx` still prints `puzzle.question` and `puzzle.description` above the puzzle after the intro scene has played. The two disagree.

| Level | Intro scene (good) | Header or description (still rendering) |
|---|---|---|
| 8 | "Ya think these puzzles are easy? Hah-hah-hah." | "You think these puzzles are easy? Ha! I present you: the magic box." |
| 7 | "Mphf. I can't let ya go." | "Mphf. I can't let you go. You won't solve this one!" |
| 22 | "Grounds never lie. People lie. Grounds only gossip." | "'The grounds never lie,' she whispers." |
| 23 | "I see faraway land. Very old zodiac." | "'I see a distant culture, an ancient zodiac cycle,' the gypsy whispers. 'Tell me the year and animal I'm seeing.'" |
| 26 | "Stars are talking tonight. Inside wagon I cannot hear them." | "'The stars have much to tell us tonight,' she whispers." |

**Recommendation.** Headers become short neutral titles ("The Magic Box", "Three Cups"). Descriptions that restate the intro are deleted.

### 1.5 Elevator, hints, UI

- **Elevator messages.** Two separate pools exist (`dialogue-utils.ts` and `final-level-puzzle.tsx`). All 23 lines end in an ellipsis and none names anything: "The elevator doors part to reveal the horrors that await..." One pool, no ellipses, written like the cell: "The floor indicator has more numbers than the building has floors."
- **Hints.** Functional and mostly well staged. The copy errors are listed in section 4.
- **Feedback strings.** "Correct! Well done." and "That's not quite right. Try again." are the only lines in the game written by nobody. The Kanban already proposes mentor-voiced feedback. I agree. Samples, for sign-off: Skeleton "Wrong. Hah-hah-hah." Butler "Regrettably, no." Fortune Teller "No. Cards say try again. Cards are polite today." Sphinx "That is not the answer." Devil "WRONG. How delightful."
- **Zone 5 has three names.** "Underworld" in the status bar, "the Afterlife" in the transition, "Hell" everywhere else.
- **Post-ending captions.** After the Heaven ending, which leaves the player in Limbo forever, the caption reads "Your journey continues in a different form..." It contradicts the ending it follows.

---

## 2. The plot

### 2.1 What works

- **The premise is strong and specific.** A good person, one bad night, alcohol on prescription antidepressants, a pedestrian. The game is honest that goodness does not cancel it.
- **The foreshadowing is planted with care.** "That noggin o' yers knows what ya did." Ronan's "Who did *you* kill?" The parrot's car accident and happy pills. "Why you sit like you still wear seatbelt?" The Hanged Man who presses the pedal. "Nobody here is expecting you home."
- **The Level 20 payoff is the best structural beat in the game.** The player assembles a Latin sentence from seven paintings, types it, and the Butler screams it back as his face comes off. The puzzle answer is the plot.
- **Two answers are story.** At Level 1 and Level 20 the words the player types are themselves plot beats. It is the one kind of story delivery a player cannot skip.
- **The endings judge the answer, not the score.** Whichever fate the player assigns to a stranger is the fate they get.
- **The last third of "Neither" is the best prose in the script.** "Years from now, a stranger will wonder why you always hand someone else the car keys." "Somewhere, a newborn takes its first breath and starts to cry."

### 2.2 Where it breaks

**The reveal is finished thirty levels early.** At the end of the Forest the Fortune Teller says "Metal screaming against metal... Blood on your hands that wasn't yours alone," and the narration adds headlights, brakes and a rolling bottle. Car, rain, drink and a second victim are all on the table. The Sphinx then confirms a judgment for "lives altered by thy hand". When the Devil describes an anonymous soul who drove drunk and says "The soul I described was yours," nobody is surprised.

**Hell goes silent on the player.** The Skeleton, Butler, Fortune Teller and Sphinx each needle the player about what they did. The Devil, who holds the ledger, never does. For nine levels he jokes about maps and casinos.

**The Devil is angry in the Heaven ending, and he should be thrilled.** "How DARE you presume to such magnanimity" makes him a moralist. His spec says he "derives immense satisfaction from human hypocrisy". A soul asking to be let off is the best thing that has happened to him all day. The line "Your judgment traps my claim upon your soul" is also hard to parse.

**The Hell ending explains the game to the player.** "This entire journey—the prison, the mansion, the forest, the desert, and finally this hellish domain—it was all a trial for your soul." The scene has already shown it.

**The Neither ending has a garbled Devil line.** "Your journey served its purpose. You, insignificant human. Are you truly attached to this life?" It is unclear which life, and the insult contradicts the respect he shows two lines later. He also says he will see the player again three times in four paragraphs.

**Story lives almost entirely at zone borders.** Inside a zone, the unmissable beats are the Level 1 and Level 20 answers, the Level 30 tarot reading and one line in the Level 31 intro. Everything else is an optional portrait click, a line deep in a rotation, or a random idle squawk. A player who never clicks a portrait gets long runs of pure puzzle framing: Levels 2 to 9, 11 to 19, 22 to 29, 32 to 39 and 41 to 49.

**The mansion's Master is a loose thread.** The Butler invokes him constantly. He never appears and is never identified.

**Level 49 floats free.** The murder mystery is funny and well built, and it has no line to the player's story. The Devil's framing ("face death, in a sort of murder mystery game") is the weakest intro in his zone.

### 2.3 Recommendations

These are story proposals. Each needs your sign-off before anyone writes to it.

1. **Ration the reveal.** Decide what each zone gives away and hold the rest.

   | Zone | The player learns | Hold back |
   |---|---|---|
   | Prison | I did something. | Everything else. |
   | Mansion | I was driving. I am dead. | Drink, pills, the victim. |
   | Forest | I had been drinking. Something broke all at once. | The second person. Cut "wasn't yours alone" and the narrated bottle. |
   | Desert | Someone else's life was in it. "Lives altered by thy hand." | Who. |
   | Hell | Who it was, and what I think I deserve. | |

2. **Give the finale something new to reveal.** The planned wife and daughter plotline is the natural candidate, and nothing of it is in the script yet. The crash facts are spent by Level 30. Who was waiting at home, or who was on the road, is not. "Nobody here is expecting you home" and "I suspect you no longer remember them" are already pointing at a family. Parent and spouse words that refer to the player will need gender tokens.

3. **Drop the anonymous-soul pretence, or let the Devil play it as an obvious game.** "A hypothetical. Purely." The player knows. The Devil knows the player knows. That is funnier and it saves six paragraphs.

4. **Make the Devil delighted in the Heaven ending.**

   | Now | Proposed |
   |---|---|
   | "How DARE you presume to such magnanimity. Forgiveness that is not yours to give." | "Heaven. Oh, I was HOPING you would say that. Forgiveness is the easiest thing in the world to hand out when it is not yours to give." |

5. **Let the Devil tease the ledger through zone 5.** One line per level is enough. Examples in his section below.

6. **One mandatory memory beat mid-zone.** A single sentence of narration in the intro scenes for Levels 5, 15, 25, 35 and 45. A line of text only, no new mechanic. Example for Level 5: "The gear turns under your hand like a steering wheel. You let go of it faster than you meant to." Cheaper still: several answers already rhyme with the story (Levels 8, 22, 29 and 33 read that way to me). Choosing answers that carry a memory is story the player has to type.

7. **Name the Master.** The Butler calls the mansion "our humble establishment". The Devil calls Hell "my humble abode". If the Master is the Devil, one line in Level 45 pays off twenty levels of "the Master would be most displeased".

8. **Tie Level 49 to the player.** The victim called for help himself and died before it arrived. A sharper intro from the Devil could make the player notice that nobody at this scene cares who the dead man was.

---

## 3. Character voices

### Summary

| Character | Verdict | Where it breaks | Size of fix |
|---|---|---|---|
| Skeleton Guard | Strong | Level 1 item lines, Level 8 "Hehe", Level 45, undialected headers | Small |
| The four inmates | Strong | Nothing structural | Tiny |
| Butler | Strong in portrait lines | Level 20 examining lines, Level 45 | Medium |
| Count Papagalul | On spec | Two nits | Tiny |
| Fortune Teller | Strong in portrait lines, tarot, questionnaire comments | Questionnaire open and close, tarot end screen, Level 45, crystal compendium | Medium |
| Sphinx | Recovering | Intros, Level 45, mural captions | Medium |
| Devil | Split four ways | Portrait lines, live hell tour, endings | Large |
| Policewoman | Strong | One tense slip | Tiny |
| Mortician | Strong | Trailing pauses, autopsy report register | Small |
| Librarian | Strong | Dead "Priya" file | Tiny |
| The player | Implicit, uneven | Level 45 options, transition narration | Small |

### 3.1 Skeleton Guard

**Verdict: the most finished voice in the game.** Dialect, contempt, the two running gags and the Level 10 slips are all in place. "Change HOPE to NOPE in one move. Congrats, yer doomed." "Numbers don't lie. Neither do I. Much." "I'd give ya a hand, but I already ate it."

**Breaks.**

| Where | Now | Problem | Proposed |
|---|---|---|---|
| `prison-cell-puzzle.tsx:860` | "HEY! I WAS HOLDING THAT! ...whatever, not like I can smoke anyways. I have no lungs." | No dialect, ellipsis, and the joke is on himself. | "Oi! I was smokin' that! Tsk. Keep it. Ya look like ya need it more than I do." |
| `prison-cell-puzzle.tsx:385` | "Giving back your stolen goods already? Tsk. I was starting to think you had a spine." | No dialect. | "Givin' it back already? Tsk. And here I thought ya had a spine." |
| `prison-cell-puzzle.tsx:390` | "Thank you, I am not thirsty." | Polite. This is the Butler. | "Keep yer drink. Goes straight through me." |
| `prison-cell-puzzle.tsx:395` | "Planning a theatrical exit? Hang in there. Ha! Get it?" | "Ha!" and an explained joke. | "Plannin' a dramatic exit? Hang in there. Hah-hah-hah." |
| `game-screen.tsx:574` | "Are you a fan of rebuses? Hehe" | "Hehe" is Silas's tic. | "A rebus. Say what ya see, out loud. Go on, I could use a laugh." |
| Intro screen | "Fail, and... Hah-hah-hah!" | Ellipsis in the first line he ever speaks. | "Fail, and I get a new chew toy. Hah-hah-hah!" |
| Level 45 | "Ha! Yer'll never figure it out." | "Yer" means "your". | "Hah-hah-hah. Ya'll never figure it out." |
| Level 45 | "Women don't create great art, everyone knows that." | He is lying on purpose, which is right. This lie is a cheap one. | "A woman? Nah. Yer lookin' for a man. Big beard. Russian. Trust me." |
| Level 2 bone lines | "Yer as colour-blind as ya are slow." | British spelling belongs to the Butler. | "color-blind" |

His Level 45 answers to "Why do you hate me so much?" explain him: "It's just my job to keep souls trapped and miserable." He is better when he refuses to explain. Keep the third answer ("I just enjoy messin' with people. Eternity gets borin'.") and cut the other two.

### 3.2 The four inmates

**Verdict: clean.** Each has one speech rule and keeps it. Caine's "Lyra's gorgeous. Lies like a rug, though." Ronan's whispered "Don't tell him I said that." Lyra's "He *could* be the culprit. He isn't." Silas's skin line. The logic holds: only Lyra is truthful, and the victim's gender stays unknowable because Caine and Ronan contradict each other.

**Notes.**
- Lyra says "The culprit is in this room." The guard is not shown in the inmate grid. "In this block" is safer.
- Silas's "There was no murder... you're being fooled" is echoed forty levels later by the Policewoman's "There was no murder." Worth keeping as a deliberate rhyme.
- Ronan's "Who did *you* kill?" is the best foreshadowing line in zone 1. It is fifth in his rotation, so many players will never reach it. Move it to second.

### 3.3 The Butler

**Verdict: excellent when he follows his own move, weak where he recites.** The setup-then-jab lines are the funniest in the game: the arsenic wallpaper, the Tyrian purple, "Yours, I suspect, extends little beyond the fries," "I shall simply watch them," "Nobody here is expecting you home."

**Break 1: the Level 20 examining lines.** All 32 share one sentence shape, a fact followed by "to" and a purpose, with no humble opener and no turn toward the guest.

> "Pope Gregory established the definitive order of the seven deadly sins with pride at the very forefront to ensure a remarkably tidy piece of moral accounting."
> "The sheer apathy in the gaze of Mammon captures the essence of modern capitalism with flawless precision."

Three specific problems inside that set:
- "Giotto forced Western painting into three-dimensional realism specifically to capture the agonizing grip of true greed." The fresco is Envy. This names the wrong sin in a puzzle about matching art to sins.
- "The master chose to leave the natural cracks... to demonstrate a rather questionable sense of interior design." He never sneers at the Master.
- "With pride at the very forefront." The tablet in the same room opens with VANAGLORIA.

| Now | Proposed |
|---|---|
| "Giotto forced Western painting into three-dimensional realism specifically to capture the agonizing grip of true greed." | "Giotto gave Envy a serpent that leaves her own mouth and turns back to bite her eyes. A warning against speaking ill of others, kind guest. I, of course, would never." |
| "The master chose to leave the natural cracks in this alabaster sculpture of Pope Gregory completely exposed to demonstrate a rather questionable sense of interior design." | "The Master left the cracks in the alabaster exactly as he found them. He held that a flaw honestly shown is worth more than a repair. I have tried to extend the same courtesy to you." |
| "The sheer apathy in the gaze of Mammon captures the essence of modern capitalism with flawless precision." | "Watts gave Mammon the ears of an ass and put two young people beneath his hands. He crushes them without once looking down. One so rarely does." |

**Break 2: Level 45.** He becomes a reference librarian: "this poet was born in Florence circa 1265. His work revolutionized literature by using the vernacular rather than Latin." There are six ellipses and no jabs. The clues can stay. Each needs his opener and his turn. For example: "I would not presume to name him, {{sir|madam|guest}}. A Florentine, exiled, who wrote his enemies into Hell by name. One admires the thoroughness."

**Small.** In the first transition, "His eyes never blinking as he studies you with cold precision" is a sentence fragment. The Mansion to Forest transition opens on a paragraph that is only `"..."`. In text it reads as a bug. A line of narration does the job: "The butler opens his mouth. For a moment, nothing comes out."

### 3.4 Count Papagalul

**Verdict: on spec.** The spec asks for an unhinged, contradictory, screaming bird and that is what is on the page. The solution chain (ask, ask again, one more time) is a good joke with a good payoff. "POLLY WANTS A CRACKER! POLLY WANTS A LAWYER!" and "THEY CALL YOUR AI A STOCHASTIC PARROT! I'M SUING!" are the high points.

**Nits.**
- The zero-tolerance pattern matches the word "racism" itself. A player who types "I hate racism" is called racist filth.
- Half the generic pools (insults, compliments, questions) read like any insult bot: "DID YOUR TINY BRAIN HURT THINKING OF THAT?" His best lines are the ones only a dead Transylvanian pirate parrot could say. When trimming, trim the generic ones.

### 3.5 The Fortune Teller

**Verdict: the portrait lines, the tarot reading and the questionnaire comments are superb. Everything written before the voice pass still sounds like a greeting card.**

High points: "Cards tell me you come Tuesday. Is Thursday. Cards are never wrong, so you are late." "Like my first husband. Now he listens. He has no choice." "Capitalism takes your money, then sells you candle to feel better. I sell candles too. You want one?" "See little dog at his feet? Dog knows. Listen to dog."

**Breaks, with before and after.**

| Where | Now | Proposed |
|---|---|---|
| Questionnaire opening | "Welcome, seeker. The cards have been whispering your name. Before I read your fortune, I must understand your essence. Answer truthfully, for the cards see through all deception." | "Sit, sit. Before I read you, I must know what you are made of. Five questions. Answer true. Cards see through lies, and I charge extra for them." |
| Questionnaire closing | "I have seen enough. The spirits have revealed much about you. Now, what vision comes to your mind? What do you see in the mists between us?" | "~Dosta~. I have seen enough. Now you look. Letters are there, some still hiding. What words you see, ~bre~?" |
| Tarot end screen | "The cards have revealed your path. Now you must decipher their message to continue your journey." | "Cards said what they said. Now is your turn. Read them like I read you. Slowly, and with suspicion." |
| Level 45, "Are you single?" | "Do not mistake me for some tavern wench to be wooed with cheap flattery. Your attempts at manipulation will not help you here. Focus on your task, or remain trapped forever." | "Single? I have second husband. Very faithful. He knows what happened to first one. Ask your real question." |
| Level 45, lost soul | "Ah yes, let me check on my crystal sphere. I see a figure, a woman... she appears in a white dress, surrounded by light. Angels attend her. She guides a man through realms of light." | "Wait, I look in ball. A woman. White dress, very clean, too much light around her. Angels carry her bags. She walks a man through heaven like he is tourist." |
| Level 45, guard and Russia | "The bones form a pattern pointing south, not east. The bear of Russia is nowhere in these signs. The skeleton speaks with a forked tongue." | "Russia? Bones point south. Bones are not tourists, they don't get lost. Skeleton lies to you, ~bre~. Is his only hobby." |

All 20 of her Level 45 answers need the same treatment. None uses her grammar.

**The crystal compendium (Level 28)** is new-age catalogue copy: "It grants wisdom to those who seek it, allowing them to navigate the mysteries of the cosmos with clarity and purpose." It lives in her wagon. It should either be hers or be a dry almanac.

**The Level 29 portrait line is still `"..."`.** Already logged in `TEXT_AUDIT.md`. A stage direction fits: "*She taps two fingers on her lips, then points at her hands.*"

**Naming.** Narration calls her "the gypsy woman" 18 times, with mixed capitalisation. On-screen labels call her "Fortune Teller". Many Romani readers hear "gypsy" as a slur, and it will be read that way in store reviews. In narration, "the fortune teller" costs nothing. When she says it about herself ("Everybody lies to Gypsy"), it is her word to use. This is your call.

### 3.6 The Sphinx

**Verdict: the portrait lines now work.** The uncommitted pass fixed the generic set. "The dark hides nothing from those who carry fire. For a while." "The great may carry the small. Never the reverse." "These walls show the road of the dead through the underworld. Does it look familiar?" She implies and stops. That is the character.

**Breaks.**
- **Intros.** Six open with "presents you with". Three have her silent.
- **Level 40 mural captions.** Two sets exist. The portrait-click set is in voice: "Anubis, god of mummification. He has weighed many hearts. He will weigh more." The on-screen caption set in `pyramid-puzzle.tsx` is a museum placard: "The goddess Isis gazes down from the wall, her presence powerful and serene." Use the first set for both.
- **Level 32 pedestals.** "A majestic pedestal adorned with a golden lion, symbolizing wealth and power. The base is decorated with intricate patterns reminiscent of West African art." Placard tone, banned words.
- **Level 38 portrait lines.** "Codes and ciphers protected the secrets of temples." A fact with nothing behind it.
- **Level 45.** No archaic pronouns, two "not X, but Y" constructions in one answer, and "unlock the path forward" exposes the answer format.

| Now | Proposed |
|---|---|
| "I am the keeper of riddles and secrets." | "Thou knowest me. I asked, and thou didst answer." |
| "The one who walks between worlds is not lost, but seeking. The one who guides is not found, but waiting. Look for the one who inspired the journey, not the one who made it." | "One walked through the three kingdoms of the dead and wrote down what he saw. Another walked ahead of him and lit the way. Thou seekest the second." |
| "As mortals are known by two names, so must you speak both to unlock the path forward. Half a name holds half the power." | "The dead are called by their whole names, seeker, or they do not turn. Give both of hers." |

- **Transition.** "Eyes boring into yours like twin suns" is stock. "This one is not thy judge" switches her to third person for one line.

### 3.7 The Devil

**Verdict: the largest gap between the spec and the page.** The spec describes a theatrical judge who savours hypocrisy and stresses single words in capitals. On the page he is four people.

| Register | Where | Sample | Fits the spec |
|---|---|---|---|
| Stand-up comic | Portrait lines, Levels 41 to 50 | "Losing your marbles on this one?" "Fear and Loathing, always." | Partly |
| Museum guide | Live hell tour, `game-screen.tsx` lines 400 to 509 | "The screaming here reaches decibel levels that would rupture mortal eardrums." | No |
| Moral ironist | `devil-dialogue.tsx` | "He spent thirty years insisting his mistakes were accidents. Down here, nothing is." | Yes, exactly |
| Stage villain | Outro | "'I could not agree more,' he growls, the ground trembling beneath your feet." | Mostly |

**The key finding.** `devil-dialogue.tsx` is imported by `game-screen.tsx`, and nothing ever sets it visible. Its sixteen floor speeches are the best Devil writing in the project. Each floor pairs a punishment with the excuse the sinner used in life: "She used to pride herself on never letting anything get under her skin. Now nothing can get out." The player never sees them. What the player does see on each floor is the 64-line catalogue in `game-screen.tsx`: "Bones become powder. Organs become paste." "This realm is colder than before."

**Recommendation.** Ship the `devil-dialogue.tsx` text as the floor dialogue and retire the catalogue. That file is also the register to copy everywhere else: a specific person, their excuse, the punishment that answers it.

**Portrait lines.** Keep the ones with a turn: "Especially when I did it." "The Butler did it, of course." "They never quite capture the smell." Replace the flat ones.

| Level | Now | Proposed |
|---|---|---|
| 41 | "Maps are so futile, every lost soul ends up here eventually." | "Every map is a list of places people tried to be instead of here. They all arrive EVENTUALLY." |
| 47 | "I am quite proud of this machine of mine." | "He used to say he did his best thinking under pressure. I am simply supplying the PRESSURE." |
| 50 | "Welcome to MY realm..." | "One floor left. Mind the step. It is a LONG one." |

**Ledger teases for zone 5** (new lines, for sign-off):
- Level 41: "I keep one entry in my ledger that I cannot close. Remind me to show you."
- Level 46: "I adore people who bet everything on getting home safe."
- Level 49: "A dead man nobody looked at properly. You would know NOTHING about that."

**Rule violations in his dialogue.** Em dashes at Levels 43 and 45. Ellipses in the transition ("my... hospitality", "Fail, and well...") and in Level 45 ("But you can call me... Sir."). "I'm not helping you; I'm testing you" is the banned contrast.

**Outro.** The narration does his acting for him: purrs, booms, growls, "voice drops an octave", "with theatrical flair", "with mock sympathy". His lines carry it without the adverbs. Cut the attributions and the scene gets shorter and better.

### 3.8 The Policewoman

**Verdict: clean and funny.** "Slightly too dead for my taste, I like 'em still warm." "They're evidence... of deliciousness!" "I would assume so. I didn't bother to ask him, though." Her "there was no murder" refrain holds through every branch.

One slip: "Managed to rescue it before it goes to waste" should be "went", and the line has no full stop.

### 3.9 The Mortician

**Verdict: the best-defined of the Level 49 three.** "It's dead. Obviously." "Anemia." "No." "Your face is a contender. But I've seen worse." The friendship route, where the player wears him down with "unconditional love and friendship", is the funniest exchange in zone 5.

**Notes.**
- Three trailing pauses soften a voice built on bluntness: "How... unusual." "A rather... pale affair." "I prefer my relationships... one-sided." The fragments are his voice. The pauses are filler. Keep one.
- The autopsy report is written by a different man. He speaks in single words. The report chats: "lucky bastard died in his prime", "Bro did not know how to party". Either the report goes terse with one dry joke per page, or someone else signs it.
- "Turned into a human-level lamp" does not parse.
- The report names the victim "Dohn Joe" at 168 cm. The ID says Declan Tremblay, 180 cm. If the mismatch is the joke, a line should point at it. If it is an oversight, it is a red herring in a deduction puzzle.
- Page 1 has a stray bracket after "forest path". Page 3 states the height twice.

### 3.10 The Librarian

**Verdict: on spec.** "Shhhhhhhhh!!!" "This is a library!" "I think this is appropriate for your mental age." Every recommendation is an insult shaped like a service. She shares a running joke with the Policewoman: both are owed money by the Devil.

**Books.** The six books each hold a consistent register of their own, which is right for found documents. The serial killer manual is the sharpest. Every one of its pages ends without a full stop. "His Mother" and "greenlight" need fixing.

**Dead file.** See the leaks table: `library-view.tsx`.

### 3.11 The player

**Verdict: the player has a voice. Nobody wrote it down.** It appears in three places.

- **The cell narrator** makes them squeamish and wry: "It is a dreadful habit, but you decide to hold on to your only cigarette for now."
- **Level 49 dialogue options** make them guileless and relentlessly friendly: "I'll be your friend!" "I am not leaving until you accept my unconditional love and friendship." "Huh... hello, Psycho."
- **Level 45 options** have flashes of the same person: "Are you single?" "Are you supposed to be a cat?" "Please?"

Together these describe a nice, slightly clumsy person who assumes everyone can be won over. That is the character the plot needs. The Devil describes them as "kind to strangers... loved by friends and family". The comedy and the tragedy come from the same trait.

**Breaks.**
- Most Level 45 options are database queries: "Tell me about this poet." "What city is important?" "What time period is important?" In the Level 49 voice: "Sorry, which poet?" "Is there a city I should know about?"
- Transition narration makes the player a camera. "You feel a chill." "You feel no fear—only a strange sense of inevitability." The cell narrator would give them a reaction.
- The player's only spoken line in narration is "I..." in the Sphinx scene.

**Recommendation.** Add a short player entry to `NARRATIVE_DESIGN.md` §2: friendly to a fault, squeamish, polite to monsters, never heroic, never aware they are dead until the game says so.

### 3.12 Minor voices

- **Shackles.** Narrated, charming. "Shackles sniffs the bone disapprovingly, then tosses it aside. Try again!" The last two words are interface text leaking into the fiction.
- **The brain in the lamp (Level 47).** Screams that escalate in three tiers as the player progresses. It works. The ellipses are earned here.

---

## 4. Copy errors

| File | Text | Fix |
|---|---|---|
| `puzzles-1.ts` L4 | "a ominous message" | "an ominous message" |
| `puzzles-1.ts` L8 hint | "Solution is a two words, not three." | "The answer is two words." |
| `puzzles-1.ts` L1 hint | "Things you see on mirror are reflected..." | "Things seen in a mirror are reversed. So is this message." |
| `puzzles-3.ts` L24 hint | "The mosaic seem to represent" | "seems" |
| `puzzles-5.ts` L42 hint | "which horsemen moves first" | "which horseman" |
| `puzzles-5.ts` L47 hints | "the lightbulb become", "a combinations", missing full stop | Fix all three |
| `puzzles-2.ts` L13 hint | Em dash | Two sentences |
| `puzzles-2.ts` L16 hint 4 | No full stop, bare formula | Finish the sentence |
| `prison-cell-puzzle.tsx:290` | "rats and vermins" | "rats and worse" |
| `data/transitions.ts` | "His eyes never blinking as he studies you with cold precision." | "His eyes do not blink as he studies you." |
| `familiar-faces-puzzle.tsx` | "bones clickin' against each other" in a stage direction | Narration does not use his dialect |
| `evidence-data.ts` | Stray bracket, repeated height, "human-level lamp" | See 3.9 |
| `data/books/serial-killers.ts` | No final full stop on any page | Add |
| `outro-screen.tsx` | "Your journey continues in a different form..." after the Limbo ending | Match the ending |

---

## 5. Suggested order of work

**First, an afternoon.** Remove the two test strings. Fix the Level 48 and 49 hints. Delete `library-view.tsx`. Fix the copy errors in section 4. Fix the Skeleton's Level 1 and Level 8 lines.

**Second, the highest return per hour.** Put the `devil-dialogue.tsx` speeches on the hell floors. Replace puzzle headers with short titles and delete duplicated descriptions.

**Third, rewrites that need your sign-off on direction.** The four transitions and the three endings in the cell narrator's voice. The reveal schedule in 2.3. The Heaven ending's Devil. Level 45 for all four hosts. The Butler's 32 gallery lines.

**Fourth, polish.** Fortune Teller leftovers (questionnaire frame, tarot end, compendium). Sphinx intros and captions. Devil portrait lines and ledger teases. Elevator messages. Mentor-voiced feedback.

**Decisions only you can make.**
1. What the family plotline is, and whether it becomes the finale's new reveal.
2. Whether the Master is the Devil.
3. Whether narration keeps "the gypsy woman".
4. ~~Whether the "Dohn Joe" and Declan Tremblay mismatch is a joke or an error.~~ Resolved: neither. The creature makes its victims shorter; the height gap is the clue.
5. Whether the parrot's political pools ship on Steam as they are.
