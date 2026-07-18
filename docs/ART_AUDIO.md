# 🎨 Art & Audio Style Guide

## 1. Visual Aesthetics Style Guide
- **Core Style:** Premium Glassmorphism. Components must utilize translucent backdrops (`backdrop-blur-md`), thin glowing borders (`border-white/10`), and deep shadow dropping (`shadow-2xl`).
- **Dark Mode First:** The canvas is an infinite dark layout. Bright colors are strictly reserved for active states, interactive feedback, and magic components.
- **Micro-Animations:** Use Framer Motion for slight scale adjustments on button hovers (`whileHover={{ scale: 1.02 }}`), and subtle layout animations for puzzle state changes.
- **Image Formats:** Highly optimized WebP format for static scenes, and looping GIFs for animated hints/cues (e.g., sign language animations).

---

## 2. Audio Design Directives

> [!NOTE]
> For per-sound rationale, in-game trigger points, and open-source sourcing suggestions
> (OpenGameArt/Freesound search terms, licensing guidance), see `docs/AUDIO_DESIGN.md`.

### Background Soundtracks (BGM)
- **Zone 1 (Prison):** Muted water droplets, distant metal echoing, and low cello hums to create a claustrophobic feel.
- **Zone 2 (Mansion):** Quiet, slightly detuned harpsichord or classical grand piano melody playing in a minor key.
- **Zone 3 (Forest):** Wind chimes, rustling leaves, and soft woodwind instruments.
- **Zone 4 (Desert):** Ominous wind blowing, sitar or double reed instruments echoing in the distance.
- **Zone 5 (Hell):** Burning fire crackles, mechanical gear grinding, and industrial drone waves.

### Sound Effects (SFX)
- **Success Tone:** High-quality chime indicating solution matching.
- **Error Tone:** Dampened wood knock or low click.
- **UI Interaction:** Minimalist digital clicks for toggle items.
- **Bone clattering:** For skeleton guard dialogue transitions and bone feeding.

### Voice-Over / Speech Text Cues
- Each zone character's text box includes specific speed and pitch attributes to govern narrative visual text rendering, preparing the game engine for future voice-over sound bytes.
