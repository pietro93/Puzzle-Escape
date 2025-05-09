import {
  specificResponses,
  solutionResponses,
  greetingResponses,
  insultResponses,
  personalResponses,
  easterEggResponses,
  questionResponses,
  defaultResponses,
  idleMessages,
} from "@/data/parrot-dialogue"

// Type for tracking solution state
export type SolutionState = "initial" | "askAgain" | "askOneMoreTime" | "solved"

// Interface for the dialogue manager
export interface ParrotDialogueManager {
  getResponse: (
    input: string,
    solutionState: SolutionState,
  ) => {
    response: string
    newSolutionState: SolutionState
    isMultiline: boolean
  }
  getIdleMessage: () => string
}

// Create and export the dialogue manager
export const createParrotDialogueManager = (): ParrotDialogueManager => {
  return {
    getResponse(input: string, solutionState: SolutionState) {
      const userInput = input.trim().toLowerCase()
      const response = ""
      const newSolutionState = solutionState
      const isMultiline = false

      // Special case: fourth wall breaking (10% chance)
      if (Math.random() < 0.1) {
        return {
          response: "Breaking the fourth wall! Gawk!",
          newSolutionState,
          isMultiline: false,
        }
      }

      // Check for specific responses first
      if (specificResponses[userInput]) {
        return {
          response: specificResponses[userInput],
          newSolutionState,
          isMultiline: false,
        }
      }

      // Check solution path
      if (userInput === "solution" && solutionState === "initial") {
        return {
          response: solutionResponses["solution"],
          newSolutionState: "askAgain",
          isMultiline: false,
        }
      } else if (userInput === "again" && solutionState === "askAgain") {
        return {
          response: solutionResponses["again"],
          newSolutionState: "askOneMoreTime",
          isMultiline: false,
        }
      } else if (userInput === "one more time" && solutionState === "askOneMoreTime") {
        return {
          response: solutionResponses["one more time"],
          newSolutionState: "solved",
          isMultiline: true,
        }
      }

      // Check for greetings
      if (/^(hello|hi|hey|hola|good (morning|afternoon|evening))$/i.test(userInput)) {
        return {
          response: this.getRandomResponse(greetingResponses),
          newSolutionState,
          isMultiline: false,
        }
      }

      // Check for insults
      if (/fuck|shit|bitch|cunt/i.test(userInput)) {
        const match = userInput.match(/fuck|shit|bitch|cunt/i)
        if (match) {
          return {
            response: `${match[0].toUpperCase()} YOU RIGHT BACK!`,
            newSolutionState,
            isMultiline: false,
          }
        }
      }

      if (/idiot|stupid|dumb/i.test(userInput)) {
        return {
          response: this.getRandomResponse(insultResponses.intelligence),
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/mother/i.test(userInput)) {
        return {
          response: this.getRandomResponse(insultResponses.family),
          newSolutionState,
          isMultiline: false,
        }
      }

      // Check for personal questions
      if (/name\??/i.test(userInput)) {
        return {
          response: personalResponses["name"],
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/age\??/i.test(userInput)) {
        return {
          response: personalResponses["age"],
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/gay\??/i.test(userInput)) {
        return {
          response: personalResponses["gay"],
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/butler/i.test(userInput)) {
        return {
          response: personalResponses["butler"],
          newSolutionState,
          isMultiline: false,
        }
      }

      // Check for easter eggs
      if (/polly wants a cracker/i.test(userInput)) {
        return {
          response: easterEggResponses["polly wants a cracker"],
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/never/i.test(userInput)) {
        return {
          response: easterEggResponses["never"],
          newSolutionState,
          isMultiline: false,
        }
      }

      // Check for questions
      if (/^why/i.test(userInput)) {
        return {
          response: questionResponses["why"],
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/^how/i.test(userInput)) {
        return {
          response: questionResponses["how"],
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/^what/i.test(userInput)) {
        return {
          response: questionResponses["what"],
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/^help$/i.test(userInput)) {
        return {
          response: questionResponses["help"],
          newSolutionState,
          isMultiline: false,
        }
      }

      // Check for nonsense
      if (/(.)\1{3,}/i.test(userInput)) {
        return {
          response: "REPEAT AFTER ME: ENUNCIATION!",
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/kill/i.test(userInput)) {
        return {
          response: "THERE'S A KILLER IN ME",
          newSolutionState,
          isMultiline: false,
        }
      }

      if (/[^\w\s]/i.test(userInput)) {
        return {
          response: "KEYBOARD MALFUNCTION?",
          newSolutionState,
          isMultiline: false,
        }
      }

      // Default response if nothing else matches
      return {
        response: this.getRandomResponse(defaultResponses),
        newSolutionState,
        isMultiline: false,
      }
    },

    getIdleMessage() {
      return this.getRandomResponse(idleMessages)
    },

    getRandomResponse(responses: string[]) {
      return responses[Math.floor(Math.random() * responses.length)]
    },
  }
}
