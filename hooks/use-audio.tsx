"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false)
  const audioRefs = useRef({
    bgMusic: null as HTMLAudioElement | null,
    correctSound: null as HTMLAudioElement | null,
    wrongSound: null as HTMLAudioElement | null,
    buttonSound: null as HTMLAudioElement | null,
    transitionSound: null as HTMLAudioElement | null,
  })

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Background music
      audioRefs.current.bgMusic = new Audio("/audio/ambient-mystery.mp3")
      audioRefs.current.bgMusic.loop = true
      audioRefs.current.bgMusic.volume = 0.3

      // Sound effects
      audioRefs.current.correctSound = new Audio("/audio/correct.mp3")
      audioRefs.current.correctSound.volume = 0.5

      audioRefs.current.wrongSound = new Audio("/audio/wrong.mp3")
      audioRefs.current.wrongSound.volume = 0.5

      audioRefs.current.buttonSound = new Audio("/audio/button-click.mp3")
      audioRefs.current.buttonSound.volume = 0.4

      audioRefs.current.transitionSound = new Audio("/audio/transition.mp3")
      audioRefs.current.transitionSound.volume = 0.5
    }

    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
      audioRefs.current = {
        bgMusic: null,
        correctSound: null,
        wrongSound: null,
        buttonSound: null,
        transitionSound: null,
      }
    }
  }, [])

  // Play audio helper function
  const playAudio = useCallback(
    (audioRef: HTMLAudioElement | null) => {
      if (audioRef && !isMuted) {
        audioRef.currentTime = 0
        audioRef.play().catch((e) => console.log("Error playing sound:", e))
      }
    },
    [isMuted],
  )

  // Audio control functions
  const playBackgroundMusic = useCallback(() => {
    if (audioRefs.current.bgMusic && !isMuted) {
      const playPromise = audioRefs.current.bgMusic.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play was prevented. User interaction required.")
        })
      }
    }
  }, [isMuted])

  const stopBackgroundMusic = useCallback(() => {
    if (audioRefs.current.bgMusic) {
      audioRefs.current.bgMusic.pause()
      audioRefs.current.bgMusic.currentTime = 0
    }
  }, [])

  const playCorrectSound = useCallback(() => {
    playAudio(audioRefs.current.correctSound)
  }, [playAudio])

  const playWrongSound = useCallback(() => {
    playAudio(audioRefs.current.wrongSound)
  }, [playAudio])

  const playButtonSound = useCallback(() => {
    playAudio(audioRefs.current.buttonSound)
  }, [playAudio])

  const playTransitionSound = useCallback(() => {
    playAudio(audioRefs.current.transitionSound)
  }, [playAudio])

  // Generic sound player for any audio file
  const playSound = useCallback(
    (src: string) => {
      if (isMuted) return

      const audio = new Audio(src)
      audio.volume = 0.5
      audio.play().catch((e) => console.log("Error playing sound:", e))
    },
    [isMuted],
  )

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev

      if (audioRefs.current.bgMusic) {
        if (newMuted) {
          audioRefs.current.bgMusic.pause()
        } else {
          audioRefs.current.bgMusic.play().catch((e) => console.log("Error playing sound:", e))
        }
      }

      return newMuted
    })
  }, [])

  return {
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound,
    playWrongSound,
    playButtonSound,
    playTransitionSound,
    playSound,
    isMuted,
    toggleMute,
    correctSoundRef: audioRefs.current.correctSound,
    wrongSoundRef: audioRefs.current.wrongSound,
    buttonSoundRef: audioRefs.current.buttonSound,
  }
}
