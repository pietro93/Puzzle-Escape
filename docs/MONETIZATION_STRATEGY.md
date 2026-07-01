# 💰 Monetization Strategy

This document defines how **Puzzle Escape** generates revenue on mobile, and the guardrails that keep monetization from undermining the narrative experience.

---

## 1. Model Overview

**Primary model:** Free-to-play with rewarded-ad hints + one-time IAP upgrade.

| Layer | Mechanism | Purpose |
|---|---|---|
| **Base game** | Free download, all 50 levels playable | Removes the install barrier; story is the retention hook, not a paywall. |
| **Hints (free path)** | Watch a rewarded video ad to unlock a hint | Primary revenue stream. Low friction, opt-in, standard for puzzle games. |
| **Hints (paid path)** | One-time IAP: "Remove Ads & Unlock Unlimited Hints" | Captures revenue from engaged/frustrated players who'd rather pay than watch ads. Flat purchase, not a subscription — this is a finite, 50-level narrative game, not a live-service title. |
| **Bonus content pack** | One-time IAP: 10 extra non-canon levels (alien/space theme) | Extends monetization past the point where most players stop spending — i.e. after finishing the 50-level main story. Separate SKU; stacks independently of the hint unlock. |

Desktop/Steam builds are unaffected by this strategy — ads and hint-gating are mobile-only. Desktop remains a premium, paid-upfront product (per [PROJECT_AUDIT.md](PROJECT_AUDIT.md) build pipeline roadmap).

---

## 2. Hint Economy

- Each level grants a small number of **free hints per day** (proposed: 1–2) before the ad-gate kicks in. A hard ad-gate from hint #1 onward risks early churn before players are invested in the story.
- Hint cost does not scale with level difficulty — keeps the system predictable and avoids feeling punitive in harder late-game zones (Desert, Hell).
- Hint state (daily allowance, ads watched) persists through the same save-state system already tracked as a technical gap in [PROJECT_AUDIT.md](PROJECT_AUDIT.md) (`localStorage` → needs robust persistence).

---

## 3. Guardrails: Protecting Narrative Immersion

The game's core value is atmospheric and emotional (see [NARRATIVE_DESIGN.md](NARRATIVE_DESIGN.md)). Monetization must never compromise the delivery of that experience.

- **Ads only trigger from an explicit hint-button tap inside a puzzle.** Never auto-play, never interstitial between levels.
- **No ads during dialogue, zone transitions, or the Level 50 finale.** These are the highest-stakes narrative beats (DUI reveal, Devil's entrance, Heaven/Hell/Neither ending) — interrupting them with a video ad breaks tone at the worst possible moment.
- **No ads in the final Hell zone's climactic sequence** (Levels 48–50) regardless of hint usage elsewhere — the ending choice should land without commercial interruption.
- IAP unlock messaging should be diegetic where possible (e.g. framed through a zone mentor's voice) rather than a generic system popup, consistent with the dialogue style rules in [NARRATIVE_DESIGN.md](NARRATIVE_DESIGN.md).

---

## 4. Implementation Notes

- Hint-gating logic and the ad-trigger hook belong in `hint-system.tsx`, alongside whatever ad SDK is chosen (e.g. AdMob) and IAP/receipt validation layer (e.g. RevenueCat, or platform-native StoreKit/Play Billing).
- IAP unlock state must be checked before showing any ad prompt — paying users should never see an ad-gated hint UI at all.
- This system is additive to the existing hint UI; no changes to puzzle logic or answer validation are required.

---

## 5. Bonus Content Pack (Post-Roadmap)

A paid, non-canon 10-level pack introducing a space/alien theme, positioned as **post-game epilogue content** rather than a sixth numbered zone.

- **Revenue purpose:** Most players stop spending once they finish the main 50-level story and see an ending. A bonus pack re-engages completers and captures additional revenue from the highest-LTV segment (players who finished the whole game) without altering the core 50-level pricing/ad model.
- **Positioning:** Treated as separate, clearly-marked bonus content (own store listing/IAP, own entry point post-finale) rather than inserted into the main progression — keeps the five-zone judgment cosmology intact for players who don't buy it.
- **Pricing:** One-time IAP, same flat-purchase logic as the hint unlock (no subscription).
- **Status:** Sequencing and narrative framing (how/where it hooks into the existing endings) are a game-design question to be resolved later — this is explicitly **post-roadmap** content, scoped after audio, testing, and the build pipeline items in [PROJECT_AUDIT.md](PROJECT_AUDIT.md) are complete.

---

## 6. Out of Scope (For Now)

- **Zone/chapter paywalls** (e.g. pay to unlock Mansion onward) — considered as an alternative primary model but not pursued; the ad+IAP hint model was chosen as the simpler path that doesn't require restructuring how zones are accessed.
- **Subscriptions, season passes, cosmetic IAP** — not appropriate for a finite, single-playthrough narrative game.
- **Mobile-specific scope changes** — this document assumes mobile ships as a port of the current build; if mobile scope diverges (e.g. shorter free chapter, different level count), this strategy should be revisited.
