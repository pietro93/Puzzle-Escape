# 🔀 Level Design & Puzzle Compendium

This document details the mechanics, visual setup, player interactions, step-by-step solutions, and answers for all 50 levels in **Puzzle Escape**.

---

## 💀 Zone 1: Prison Cell (Levels 1–10)
- **Character Mentor:** Skeleton Guard
- **Aesthetic:** Damp, mossy medieval stone prison cell with iron bars and bone shards.

### Level 1: The Secret Message
- **What it Consists of:** A locked cell with a dirty mirror, a clogged sink, a vent, and a mocking guard.
- **How to Solve (Player Journey):**
  1. Pick up the **rag** located under the sink.
  2. Search the wall vent to find **rubbing alcohol** and pick it up.
  3. Speak with the Skeleton Guard and steal/obtain his **cigarette**.
  4. Combine the rubbing alcohol with the rag, then use the lit cigarette to set the rag on fire.
  5. Heat the metal bottom of the sink basin with the burning rag.
  6. Turn on the water tap to generate hot steam. The resulting condensation fogs the mirror, revealing the backward/reflected word: `RED RUM` or similar.
  7. Reflect/reverse the text back to read the correct answer.
- **Answer:** `MURDER`

### Level 2: Bone Counting
- **What it Consists of:** An arrangement of skeletal skulls and bones colored in various paint markers.
- **How to Solve (Player Journey):**
  1. Observe the colors of the skulls: Purple, Orange, White, and Black.
  2. Count each set of colored bones scattered in the cell.
  3. Map the counts of the colored bones to the skulls in their exact order: Purple (10), Orange (5), White (13), Black (7).
- **Answer:** `10 5 13 7` (or `105137`)

### Level 3: Lock & Key Math
- **What it Consists of:** A heavily secured heavy iron chest wrapped in 3 distinct locks (a bronze lock, a silver lock, and a gold lock). *[Update: Transitioning to an interactive Lock/Unlock mechanic instead of a static image.]*
- **How to Solve (Player Journey):**
  1. The player observes math equations etched onto the chest's metal banding.
  2. The player deduces the values for Bronze (Key=6), Silver (Lock=4), and Gold (Chain=2) through the equations.
  3. Instead of typing an answer, the player drags physical keys (numbered 1-9) from their inventory into the correct locks on the chest.
  4. Turning the correct key in the correct lock plays a satisfying mechanical "clunk". Once all three are unlocked, the chest opens to reveal the progression item.
- **Answer:** `6`, `4`, `2` inserted into the respective locks.

### Level 4: Ominous Scratchings
- **What it Consists of:** A series of letters scratched into the stone wall, each possessing a toggleable tick mark above it.
- **How to Solve (Player Journey):**
  1. Click each letter's tick mark to cycle between Roman numerals: 0, I, and II.
  2. Read the end values of the words (represented by Roman numerals IV, II, V). The marks indicate how many times to count/include each letter.
  3. Once the marks match the target sums, harvest the letters and rearrange them into a 7-letter word starting with 'F'.
- **Answer:** `freedom`

### Level 5: Like Clockwork
- **What it Consists of:** A circular image partitioned into quadrants with hidden letters scattered inside and outside.
- **How to Solve (Player Journey):**
  1. Find the letters: **A**, **M**, **B**, **E**, and **R**.
  2. Read the quadrants starting from the top-right and moving clockwise around the circle, ending with the letter outside.
- **Answer:** `Amber`

### Level 6: Shackles the Dog
- **What it Consists of:** The Guard's spectral pet dog, Shackles, blocking the path.
- **How to Solve (Player Journey):**
  1. Gather various marked bones from your inventory.
  2. Drag and drop the bones onto Shackles in the correct spelling sequence.
  3. If an incorrect bone is fed, Shackles rejects it and spits it back out.
- **Answer:** `RABID REND`

### Level 7: Word Ladder
- **What it Consists of:** A carousel-based word ladder puzzle showing words morphing.
- **How to Solve (Player Journey):**
  1. Rotate the carousel to analyze the word progression.
  2. Identify that each word in the sequence must change exactly one letter from the previous word (starting from BONE to LOVE/LORE/LOSE).
- **Answer:** `BONE LONE LOVE` (accepts other correct pathways like `BONE LONE LORE`, `BONE LONE LOSE`, etc.)

### Level 8: Magic Box Rebus
- **What it Consists of:** A 3x3 magic grid containing blood drops, rum shots, and ice blocks.
- **How to Solve (Player Journey):**
  1. Arrange the icons so that each row, column, and diagonal sums to a value of 9.
  2. Pronounce the symbols out loud: Blood $\rightarrow$ "Blood", Shot $\rightarrow$ "Shot", Eyes/Ice $\rightarrow$ "Eyes".
- **Answer:** `bloodshot eyes`

### Level 9: Morse Code
- **What it Consists of:** A series of dashes and dots carved on a wooden plate.
- **How to Solve (Player Journey):**
  1. Translate the five groups of dots and dashes using a Morse code alphabet chart:
     - `-..` $\rightarrow$ D
     - `.` $\rightarrow$ E
     - `-.-.` $\rightarrow$ C
     - `.-` $\rightarrow$ A
     - `-.--` $\rightarrow$ Y
- **Answer:** `DECAY`

### Level 10: Whodunit?
- **What it Consists of:** A murder mystery scene in the cells. The player can talk to four inmates: Caine, Ronan, Lyra, and Silas.
- **How to Solve (Player Journey):**
  1. Speak to all four inmates to read their conflicting statements.
  2. Deduce who is lying based on the rule that only one inmate is telling the truth.
  3. Identify that Lyra's statement ("None of us did it") conflicts with the other statements unless the killer is not an inmate.
  4. Realize the Guard is the one who set up the crime.
- **Answer:** `guard`

---

## 🤵 Zone 2: The Mansion (Levels 11–20)
- **Character Mentor:** The Butler
- **Aesthetic:** Polished mahogany libraries, bookshelves, Victorian wallpapers, and gold clock faces.

### Level 11: Anagram Spice
- **What it Consists of:** A pantry of 21 draggable spice jars (two scrollable carousels), a plate flanked by two hands, and two pedestal "arches" of glowing slots curving out from the plate — the left arch already holds a fixed S, the right arch already holds a fixed A.
- **How to Solve (Player Journey):**
  1. Drag any two jars onto the plate. Each hand turns independently if the jar pair contains a letter belonging to its word: the left hand reacts to T/R/A (completing `S _ _ _` into STAR), the right hand reacts to N/I/E/S (completing `A _ _ _ _` into ANISE). A jar with no relevant letter leaves both hands still.
  2. Use a jar you've already proven is a dud as a "control" partner to isolate the effect of each new jar you test.
  3. Optionally rest confirmed jars on the matching pedestal to keep track — pedestal slot order is cosmetic, only the letters tested on the plate matter.
  4. Once all relevant letters are identified, combine them into the spice's name (ANISE) and the shape its pods are known for (STAR) to form the final two-word answer.
- **Answer:** `star anise`

### Level 12: Clock Roman Numerals
- **What it Consists of:** A sequence of clock times represented in Roman numerals: `III`, `XII:IX`, `XXI:XVIII`, `VI:XXVII`.
- **How to Solve (Player Journey):**
  1. Convert the Roman numerals to standard numbers:
     - `III` $\rightarrow$ 3:00
     - `XII:IX` $\rightarrow$ 12:09
     - `XXI:XVIII` $\rightarrow$ 21:18
     - `VI:XXVII` $\rightarrow$ 6:27
  2. Analyze the mathematical increments: the hour adds 9 hours (looping on a 12-hour clock), and the minutes add 9 minutes.
  3. Calculate the next step: `6 + 9 = 15` (XV) for hours, and `27 + 9 = 36` (XXXVI) for minutes.
- **Answer:** `XV:XXXVI`

### Level 13: Color Palette GPS
- **What it Consists of:** A mixing palette UI containing primary and secondary color values.
- **How to Solve (Player Journey):**
  1. Add and subtract color values to solve the missing slots.
  2. Find Pink by adding Red and White together.
  3. Find Green by subtracting Red from Orange to get Yellow, then adding Azure and Black to get Blue, and mixing Yellow and Blue.
  4. The color values provide numerical coordinates pointing to a specific island off the coast of Australia.
- **Answer:** `Vampire Island`

### Level 14: Curious Jigsaw
- **What it Consists of:** A scrambled 3x3 sliding tile puzzle box.
- **How to Solve (Player Journey):**
  1. Slide the puzzle blocks to reassemble the full image.
  2. The completed image reveals a spiral shell.
  3. The hint "EAT ME" reveals it is a French culinary delicacy.
- **Answer:** `escargot`

### Level 15: Patricia's Portrait
- **What it Consists of:** A dark portrait painting of the Master's first love, Patricia.
- **How to Solve (Player Journey):**
  1. Examine the canvas under close focus.
  2. Detect the upside-down Latin text written in faint brushstrokes above her head: `"Vita et Mors"`.
  3. Translate the Latin phrase to English.
- **Answer:** `life and death`

### Level 16: Third Eye Readings
- **What it Consists of:** A bookshelf containing five book titles: "The Third Eye", "The Great Gatsby", "Moby Dick", "Hamlet", "Frankenstein".
- **How to Solve (Player Journey):**
  1. Focus on the clue "The Third Eye provides a unique perspective".
  2. Look at the other book titles and isolate the third letter of each:
     - Th**e** Great Gatsby $\rightarrow$ E
     - Mo**b**y Dick $\rightarrow$ B
     - Ha**m**let $\rightarrow$ M
     - Fr**a**nkenstein $\rightarrow$ A
     - (And others depending on specific book files in data)
  3. Rearrange or spell the extracted letters to form the answer.
- **Answer:** `TEARS`

### Level 17: Pitch Dark Switches
- **What it Consists of:** A pitch-black screen with six toggleable light switches and a compass.
- **How to Solve (Player Journey):**
  1. Toggle the switches in sequence to reveal light zones.
  2. Adjust the compass dial: rotating it clockwise ("Up") or counterclockwise ("Down") to align the needle away from West.
  3. Read the letter sequence illuminated by the active bulbs.
- **Answer:** `RANDOM` (Dynamically matches the randomly generated letter sequence)

### Level 18: Silverware Math
- **What it Consists of:** A set of algebraic equations containing spoons, knives, and forks. *[Update: Transforming into an interactive "Table Setting" UI where players arrange the Master's silverware on a dining table to balance values.]*
- **How to Solve (Player Journey):**
  1. Arrange 4 spoons on the table to balance the first equation to find `Spoon = 10`.
  2. Arrange forks and knives visually to deduce the remaining values:
     - `Fork = 25`
     - `Knife = 100`
  3. Sum the values of the final table setting: `Knife + Fork + Spoon = 100 + 25 + 10 = 135`.
- **Answer:** `135`

### Level 19: Count Papagalul
- **What it Consists of:** A talking parrot in a cage that repeats words.
- **How to Solve (Player Journey):**
  1. Type specific voice prompts to the parrot.
  2. Listen to the lyrics the parrot sings back: *"One More Time..."*.
  3. Identify the musical group behind the song.
- **Answer:** `daft punk`

### Level 20: Mansion Genealogy
- **What it Consists of:** An interactive library drawer with multiple historical text scrolls detailing the House of Morvane.
- **How to Solve (Player Journey):**
  1. Open and read each book in the archive to find clues about the rulers.
  2. Look for a ruler who:
     - Never became a Queen (died before coronation).
     - Shares her name with a powerful ancestor (Lady Niamh).
     - Ruled for only one year.
     - Had the nickname "The Accursed".
- **Answer:** `Lady Niamh the Accursed`

---

## 🔮 Zone 3: The Forest (Levels 21–30)
- **Character Mentor:** Gypsy Teller
- **Aesthetic:** Moonlit mist, starry skies, glowing crystals, and fortune cards.

### Level 21: Essence Questionnaire
- **What it Consists of:** A questionnaire interface where the Gypsy asks questions.
- **How to Solve (Player Journey):**
  1. Answer the questions to reveal letters in a hidden phrase (Hangman style).
  2. Deduce the remaining letters to solve the phrase: a Descriptor, a Color, and a Noun.
- **Answer:** `RANDOM` (Dynamically matches the active phrase)

### Level 22: Tasseography Coffee
- **What it Consists of:** Three coffee cups with patterns in the grounds.
- **How to Solve (Player Journey):**
  1. Rotate the coffee cups to reveal letters and images on their rims.
  2. Match the letters (representing first/last characters of words) and the images to decipher the phrase: `S____Y T___S A___D`.
- **Answer:** `STORMY TIMES AHEAD`

### Level 23: Crystal Ball Zodiac
- **What it Consists of:** A crystal ball showing shifting dates and zodiac signs.
- **How to Solve (Player Journey):**
  1. Observe the alternating math operations in the year sequence (+25, -95).
  2. Calculate the target year in the sequence: `1639`.
  3. Identify the corresponding Eastern zodiac animal (Vietnamese zodiac Cat/Mèo).
- **Answer:** `1639:Mèo` (or `1639 Mèo`)

### Level 24: Gem Mosaic
- **What it Consists of:** Scrambled crystal mosaic fragments.
- **How to Solve (Player Journey):**
  1. Drag and connect the mosaic pieces starting with the corners.
  2. Read the spelled letters on the completed image.
- **Answer:** `lapis lazuli`

### Level 25: Mystics Geometry
- **What it Consists of:** A system of shapes: Red/Blue circles, triangles, stars, and squares. *[Update: Converting into interactive, glowing Romani runes that light up dynamically when values are locked in.]*
- **How to Solve (Player Journey):**
  1. Solve for the circle and triangle values and lock them into the rune UI to illuminate them.
  2. Use the blue/red offsets of the illuminated runes to deduce and lock the square and star values.
  3. Evaluate the target expression with all runes glowing.
- **Answer:** `1052`

### Level 26: Star Constellation
- **What it Consists of:** A rotating star map showing connected points.
- **How to Solve (Player Journey):**
  1. Align the star cluster to match known celestial alignments.
  2. Identify the matching zodiac sign.
- **Answer:** `CAPRICORN` (or `CAPRICORNUS`)

### Level 27: Zodiac Seasons
- **What it Consists of:** Tapestries of zodiac signs and seasonal frames.
- **How to Solve (Player Journey):**
  1. Match each zodiac tapestry to its correct season frame.
  2. Arrange the 12 signs in chronological order.
  3. Identify the name of the mythological 13th zodiac sign.
- **Answer:** `OPHIUCHUS`

### Level 28: Crystal Sequence
- **What it Consists of:** Seven colorful crystals and a compendium.
- **How to Solve (Player Journey):**
  1. Place the crystals in a circle based on the compendium clues (e.g., Moonstone mirrors glow, Obsidian is volcanic).
  2. Place the leftover stone in the center and identify it.
- **Answer:** `tiger's eye`

### Level 29: Sign Language GIF
- **What it Consists of:** An animated looping GIF showing hands spelling words.
- **How to Solve (Player Journey):**
  1. Watch the hand gestures to decode the spelling.
  2. Recognize the ASL characters spelling out a two-word warning.
- **Answer:** `abandon hope`

### Level 30: Major Arcana Tarot
- **What it Consists of:** A layout of 5 Major Arcana tarot cards, some right-side up, some reversed.
- **How to Solve (Player Journey):**
  1. Match the numbers of the cards (0 to 21) using Roman numerals (e.g., XVI, XIII, XV).
  2. Reverse the Roman numerals for the cards that are upside down.
  3. Translate the letter codes to form a 5-letter word.
- **Answer:** `livid`

---

## 🏜️ Zone 4: The Desert (Levels 31–40)
- **Character Mentor:** The Sphinx
- **Aesthetic:** Sandy tombs, sandstone pillars, obelisks, and golden relic icons.

### Level 31: Hieroglyphic Tablet
- **What it Consists of:** An ancient stone block carved with Egyptian symbols.
- **How to Solve (Player Journey):**
  1. Use the translation grid to swap the hieroglyphs for letters.
  2. Identify the name of the famous Pharaoh.
- **Answer:** `tutankhamon` (or `tutankhamun`)

### Level 32: Golden Scarab Path
- **What it Consists of:** A map detailing cities of Mansa Musa's gold pilgrimage route.
- **How to Solve (Player Journey):**
  1. Guide the scarab through the locations: Land of Gold $\rightarrow$ Great Desert $\rightarrow$ Egypt $\rightarrow$ Holy Land.
  2. Trace the loop back to the start and park the scarab in the center to unlock the phrase.
- **Answer:** `sublime splendor`

### Level 33: Arabic Fire Torch
- **What it Consists of:** A dark tomb chamber with columns and torches.
- **How to Solve (Player Journey):**
  1. Click to light the torches (which only stay burning for a few seconds).
  2. Quickly read the illuminated Arabic words before they fade.
  3. Translate the phrase to English.
- **Answer:** `broken heart`

### Level 34: Crocodile Sobek
- **What it Consists of:** A jigsaw depicting the Egyptian crocodile god Sobek.
- **How to Solve (Player Journey):**
  1. Reassemble the sliding blocks.
  2. Read the letters appearing along the diagonal.
- **Answer:** `sobek`

### Level 35: Sands Mirage
- **What it Consists of:** Shifting optical effects in the desert sands.
- **How to Solve (Player Journey):**
  1. Identify the term for an optical illusion caused by atmospheric conditions.
- **Answer:** `mirage`

### Level 36: Pyramid Hanoi Workshop
- **What it Consists of:** An interactive Tower of Hanoi setup with workshop columns (Carving, Painting, Site).
- **How to Solve (Player Journey):**
  1. Move the blocks to the Carving Workshop, then the Painting Workshop, and finally the Construction Site.
  2. Build the completed pyramid at the site from largest block to smallest.
- **Answer:** `menkaure`

### Level 37: Pillars Deities Chronology
- **What it Consists of:** Sandstone pillars requiring matches of Greek and Egyptian god counterparts.
- **How to Solve (Player Journey):**
  1. Match the deities (e.g. Horus/Apollo, Thoth/Hermes).
  2. Arrange the historical Pharaohs in chronological order.
  3. Combine the letters revealed at the base.
- **Answer:** `silent mirage`

### Level 38: Vigenere Sands Cipher
- **What it Consists of:** A coded string of characters scratched into the sand: `UMNIIK AJYC`.
- **How to Solve (Player Journey):**
  1. Speak to the Sphinx and solve her riddle ("what has a bed, a mouth, and banks?") to get the key: `RIVER`.
  2. Decrypt the coded string using a Vigenère cipher grid with the key `RIVER`.
- **Answer:** `desert soul`

### Level 39: Mathematical Papyri
- **What it Consists of:** A set of papyrus scrolls containing equations with Was, Shen, and Djed symbols.
- **How to Solve (Player Journey):**
  1. Solve for the numerical values of the individual symbols.
  2. Input the value that matches the golden papyrus sum.
- **Answer:** `eye of horus`

### Level 40: Pyramid Chambers
- **What it Consists of:** A layout of connected pyramid rooms containing hidden text hints.
- **How to Solve (Player Journey):**
  1. Navigate the rooms to collect the letters.
  2. Combine the letters to spell the final solution.
- **Answer:** `bird of prey`

---

## 😈 Zone 5: Hell (Levels 41–50)
- **Character Mentor:** The Devil
- **Aesthetic:** Obsidian pillars, roaring flames, slots, cage chains, and brain electrodes.

### Level 41: Asia Fire Map
- **What it Consists of:** A map of Central Asia with colored marker pins.
- **How to Solve (Player Journey):**
  1. Match and link the coordinates of locations based on their color.
  2. Read the name of the giant burning crater in Turkmenistan.
- **Answer:** `gates of hell`

### Level 42: Apocalypse Knight Tour
- **What it Consists of:** A chess board with four Horsemen knights.
- **How to Solve (Player Journey):**
  1. Move the knights clockwise/counterclockwise within the central tiles.
  2. Trigger the seals of the Apocalypse in the correct order in under 20 moves.
- **Answer:** `arena of anointed`

### Level 43: Damned Cages Math
- **What it Consists of:** Five chests holding screaming damned souls, marked with Latin words.
- **How to Solve (Player Journey):**
  1. Translate the Latin words into Christian numerology (e.g., Apostles = 12, Satan = 666, Cross = 4).
  2. Perform the arithmetic operations indicated by the words.
- **Answer:** `23`

### Level 44: Bosch Hell Jigsaw
- **What it Consists of:** A scrambled jigsaw of Hieronymus Bosch's painting "Tondal's Vision".
- **How to Solve (Player Journey):**
  1. Reassemble the jigsaw layout.
  2. Identify the differences (discrepancies) from the original painting.
- **Answer:** `ghost ship`

### Level 45: Familiar Faces
- **What it Consists of:** Ghostly projections of the Skeleton Guard, Butler, Gypsy, and Sphinx.
- **How to Solve (Player Journey):**
  1. Talk to each projection to gather clues about the identity of the lost soul.
  2. Link the clues to Dante's guide through the afterlife.
- **Answer:** `beatrice portinari`

### Level 46: Casino Slots
- **What it Consists of:** Three slot machine reels and a set of dice.
- **How to Solve (Player Journey):**
  1. Rotate the reels based on the dice rolls.
  2. Match the reels to form two words: the opposite of Hell, and a word for chaos.
- **Answer:** `heaven mayhem`

### Level 47: Binary Switch Brain
- **What it Consists of:** Switchboards connected to electrodes on a screaming victim's brain.
- **How to Solve (Player Journey):**
  1. Set the binary sequences (0s and 1s) based on the row counts.
  2. Watch the lightbulb glow brighter as you get each sequence right.
  3. Translate the final binary output into letters.
- **Answer:** `eureka`

### Level 48: Mouth of Truth Marbles
- **What it Consists of:** An ancient stone face and sin marbles (Lust, Gluttony, Pride, Wrath, Greed, Envy, Sloth).
- **How to Solve (Player Journey):**
  1. Place the sin marbles into the mouth openings in the correct order.
  2. Align the marbles based on their matching divine symbols.
- **Answer:** `chaplain`

### Level 49: Murder Mystery Botany
- **What it Consists of:** An interactive investigation board with suspect files and toxicology reports.
- **How to Solve (Player Journey):**
  1. Read the reports to identify the plant poison used in the murder.
  2. Trace the botanical classification to identify the killer's name.
- **Answer:** `yara-ma-yha-who`

### Level 50: Final Confrontation
- **What it Consists of:** The Devil's final trial, an ornate throne room with shifting text riddles.
- **How to Solve (Player Journey):**
  1. Solve the multi-layered text riddle by selecting combinations of words.
  2. Choose the correct ending path: "Hell", "Heaven", or "Neither".
- **Answer:** Accepts multiple paths (e.g. `dark burning ruins`, leading to the choice branch screen)
