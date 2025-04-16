"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null)
  const buttonSoundRef = useRef<HTMLAudioElement | null>(null)
  const transitionSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      bgMusicRef.current = new Audio("/audio/ambient-mystery.mp3")
      bgMusicRef.current.loop = true
      bgMusicRef.current.volume = 0.3

      correctSoundRef.current = new Audio("/audio/correct.mp3")
      correctSoundRef.current.volume = 0.5

      wrongSoundRef.current = new Audio("/audio/wrong.mp3")
      wrongSoundRef.current.volume = 0.5

      buttonSoundRef.current = new Audio("/audio/button-click.mp3")
      buttonSoundRef.current.volume = 0.4

      transitionSoundRef.current = new Audio("/audio/transition.mp3")
      transitionSoundRef.current.volume = 0.5
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
      correctSoundRef.current = null
      wrongSoundRef.current = null
      buttonSoundRef.current = null
      transitionSoundRef.current = null
    }
  }, [])

  const playBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current && !isMuted) {
      // Some browsers require user interaction before playing audio
      const playPromise = bgMusicRef.current.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play was prevented. User interaction required.")
        })
      }
    }
  }, [isMuted])

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
    }
  }, [])

  const playCorrectSound = useCallback(() => {
    if (correctSoundRef.current && !isMuted) {
      correctSoundRef.current.currentTime = 0
      correctSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }, [isMuted])

  const playWrongSound = useCallback(() => {
    if (wrongSoundRef.current && !isMuted) {
      wrongSoundRef.current.currentTime = 0
      wrongSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }, [isMuted])

  const playButtonSound = useCallback(() => {
    if (buttonSoundRef.current && !isMuted) {
      buttonSoundRef.current.currentTime = 0
      buttonSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }, [isMuted])

  const playTransitionSound = useCallback(() => {
    if (transitionSoundRef.current && !isMuted) {
      transitionSoundRef.current.currentTime = 0
      transitionSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev

      if (bgMusicRef.current) {
        if (newMuted) {
          bgMusicRef.current.pause()
        } else {
          bgMusicRef.current.play().catch((e) => console.log("Error playing sound:", e))
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
    isMuted,
    toggleMute,
    correctSoundRef,
    wrongSoundRef,
    buttonSoundRef,
  }
}
