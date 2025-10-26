import React, { useState } from "react";
import CharacterDialoguePopup from "@/components/character-dialogue-popup";

interface PrisonCellPuzzleProps {
  onSolve: () => void;
}

interface InteractiveItem {
  id: string;
  name: string;
  imageUrl: string;
  position: {
    top: number;
    left: number;
  };
  width: number;
  height: number;
  unit: string;
  initialVisibility: boolean;
  onClick?: {
    disappears?: boolean;
    addToInventory?: boolean;
    changesRoomBackground?: boolean;
    dialogue?: string;
    skeletonComment?: string;
  };
}

// Define an interface for the drag-and-drop items
interface DraggableItem {
  id: string;
  name: string;
  imageUrl: string;
}

const PrisonCellPuzzle: React.FC<PrisonCellPuzzleProps> = ({ onSolve }) => {
  const prisonCellPuzzleData = {
    initialRoom: "bars",
    rooms: [
      {
        id: "bars",
        name: "Cell Bars",
        backgroundImageUrl: "/images/prison-cell/bars.webp",
        items: [
          {
            id: "guard",
            name: "Guard",
            imageUrl: "",
            position: { top: 370, left: 300 },
            width: 200,
            height: 100,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue:
                "The guard stands sentry: all bones, no nerves, uniform pressed to fetishistic crispness. You suspect he only got the job because no one else was dying to take it.",
            },
          } as InteractiveItem,
          {
            id: "lock",
            name: "Lock",
            imageUrl: "",
            position: { top: 439, left: 370 },
            width: 30,
            height: 8,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue:
                "You wonder how many desperate fingers have scraped at that lock. Judging by the gouges, this lock has forgotten what keys look like.",
            },
          } as InteractiveItem,
          {
            id: "cigarette",
            name: "Cigarette",
            imageUrl: "",
            position: { top: 439, left: 370 },
            width: 30,
            height: 8,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue: "You quickly snatch the lit cigarette off the guard's bony fingers.",
            },
          } as InteractiveItem,
           ],
        nav: {
          right: "bedroom",
          left: "bathroom",
        },
      },
      {
        id: "bedroom",
        name: "Cell Bedroom",
        backgroundImageUrl: "/images/prison-cell/bedroom.webp",
        items: [
          {
            id: "rag",
            name: "Rag",
            imageUrl: "/images/prison-cell/rag.webp",
            position: { top: 747, left: 100 },
            width: 240,
            height: 153,
            unit: "px",
            initialVisibility: true,
            onClick: {
              disappears: true,
              addToInventory: true,
              dialogue:
                "You snatch up the filthy rag from the floor. It's drenched in who-knows-what, but it might come in handy.",
            },
          } as InteractiveItem,
          {
            id: "pillow",
            name: "Pillow",
            imageUrl: "",
            position: { top: 191, left: 366 },
            width: 268,
            height: 156,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue:
                "The pillow writhes with ancient stains that seem to spell out words in a dead language. You're pretty sure one of them is your name.",
            },
          } as InteractiveItem,
          {
            id: "window",
            name: "Window",
            imageUrl: "",
            position: { top: 100, left: 600 },
            width: 100,
            height: 150,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue:
                "A window—if you’re being generous. Gnarled bars grin down at you, chewing on the sunlight before you ever see it.",
            },
          } as InteractiveItem,
          {
            id: "bed",
            name: "Bed",
            imageUrl: "",
            position: { top: 400, left: 600 },
            width: 200,
            height: 100,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue: "You consider lying down. You decide standing is safer.",
            },
          } as InteractiveItem,
        ],
        nav: {
          left: "bars",
        },
      },
      {
        id: "bathroom",
        name: "Cell Bathroom",
        backgroundImageUrl: "/images/prison-cell/bathroom.webp",
        items: [
          {
            id: "vent",
            name: "Vent",
            imageUrl: "",
            position: { top: 714, left: 186 },
            width: 84,
            height: 89,
            unit: "px",
            initialVisibility: true,
            onClick: {
              changesRoomBackground: true,
              disappears: true,
            },
          } as InteractiveItem,
          {
            id: "toilet",
            name: "Toilet",
            imageUrl: "/images/prison-cell/toilet.webp",
            position: { top: 423, left: 494 },
            width: 259,
            height: 386,
            unit: "px",
            initialVisibility: true,
          } as InteractiveItem,
          {
            id: "mirror",
            name: "Mirror",
            imageUrl: "",
            position: { top: 164, left: 183 },
            width: 192,
            height: 216,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue: "A face peers from the polished dimness. It is yours, mostly.",
            },
          } as InteractiveItem,
          {
            id: "alcohol",
            name: "Rubbing Alcohol",
            imageUrl: "/images/prison-cell/alcohol.webp",
            position: { top: 711, left: 185 },
            width: 52,
            height: 72,
            unit: "px",
            initialVisibility: true,
            onClick: {
              disappears: true,
              addToInventory: true,
              dialogue:
                "A bottle of isopropyl alcohol. Probably for cleaning the toilet.",
                skeletonComment: "Or for drinking, if you're having one of those days."
            },
          } as InteractiveItem,
        ],
        nav: {
          right: "bars",
        },
      },
    ],
  };

  const [currentRoomId, setCurrentRoomId] = useState<string>(
    prisonCellPuzzleData.initialRoom
  );
   const getItemImage = (itemName: string): string | undefined => {
      switch (itemName) {
          case "Lit Cigarette":
              return "/images/prison-cell/cigarette-inventory.webp";
          case "Rag":
              return "/images/prison-cell/rag-inventory.webp";
          case "Rubbing Alcohol":
              return "/images/prison-cell/alcohol-inventory.webp";
          default:
              return undefined;
      }
  };

  const [showRag, setShowRag] = useState<boolean>(true);
  const [inventory, setInventory] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [isBathroomVentOpen, setIsBathroomVentOpen] = useState<boolean>(false);
  const [isToiletClicked, setIsToiletClicked] = useState<boolean>(false);
  const [firstClick, setFirstClick] = useState<boolean>(true);
  const [showAlcohol, setShowAlcohol] = useState<boolean>(false);
  const [showVent, setShowVent] = useState<boolean>(true);
  const [isHeatOn, setIsHeatOn] = useState<boolean>(false);
  const [isTapOn, setIsTapOn] = useState<boolean>(false);
  const [isCigaretteClicked, setIsCigaretteClicked] = useState<boolean>(false);
  const [showGuardDialogue, setShowGuardDialogue] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const [isRagOnTube, setIsRagOnTube] = useState<boolean>(false);
  const [isRagSoaked, setIsRagSoaked] = useState<boolean>(false);
   const [mirrorImage, setMirrorImage] = useState<string | null>(null);
   const [roomBackgrounds, setRoomBackgrounds] = useState<Record<string, string>>({
    bathroom: "/images/prison-cell/bathroom.webp",
    bars: "/images/prison-cell/bars.webp",
  });

  const pixelToPercentage = (pixel: number, dimension: "width" | "height", baseDimension: number = 950) => {
    return `${(pixel / baseDimension) * 100}%`;
  };

  const changeRoomBackground = (roomId: string, newBackgroundImageUrl: string) => {
    setRoomBackgrounds(prev => ({
      ...prev,
      [roomId]: newBackgroundImageUrl
    }));
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === "vent") {
      setIsBathroomVentOpen(true);
      changeRoomBackground("bathroom", "/images/prison-cell/bathroom-2.webp");
      setShowAlcohol(true);
      setShowVent(false);
      setDialogue("The small vent comes off with ease, revealing a passage to what is surely home to several rats and vermins."); 
      return;
    }

      if (itemId === "toilet") {
        if (firstClick) {
            setDialogue("You stare deep into the toilet bowl. Something stares back. The stench threatens to write its own memoir inside your nostrils. You consider if escape is worth falling in.");
            setFirstClick(false);
          }
        setIsToiletClicked(!isToiletClicked)
    }

    if (itemId === "cigarette") {
      setDialogue("You quickly snatch the lit cigarette off the guard's bony fingers.");
      setShowGuardDialogue(true);
      changeRoomBackground("bars", "/images/prison-cell/bars-2.webp");
      setInventory((prev) => [...prev, "Lit Cigarette"]);
      setIsCigaretteClicked(true);
      return;
    }

     if (itemId === "mirror") {
      let imagePath: string | null = null;
      let newDialogue = "A face peers from the polished dimness. It is yours, mostly.";

      if (isHeatOn && isTapOn) {
        imagePath = "/images/prison-cell/mirror-tap-steam.webp";
        newDialogue = "Some badly written letters are made barely visible by the condensation on the mirror.";
      } else if (isTapOn) {
        imagePath = "/images/prison-cell/mirror-tap-on.webp";
      } else {
        imagePath = "/images/prison-cell/mirror-tap-off.webp";
      }

      setMirrorImage(imagePath);
      setDialogue(newDialogue);
    } 

    const item = prisonCellPuzzleData.rooms
      .find((room) => room.id === currentRoomId)
      ?.items.find((i) => i.id === itemId);

    if (!item || !item.onClick) return;

    if (item.onClick.disappears) {
      if (itemId === "rag") setShowRag(false);
      if (itemId === "alcohol") setShowAlcohol(false);
    }

    if (item.onClick.addToInventory && item.name && !inventory.includes(item.name)) {
      setInventory((prev) => [...prev, item.name]);
    }

    if (item.onClick.dialogue) {
      setDialogue(item.onClick.dialogue);
      if (item.onClick.skeletonComment) {
        // Show dialogue with skeleton comment
        setDialogue(prevDialogue => {
          if (prevDialogue) {
            return `${prevDialogue} \nSkeleton: ${item.onClick.skeletonComment}`;
          }
          return `Skeleton: ${item.onClick.skeletonComment}`;
        });
      }
    }
    if (itemId === "toilet") {
      setIsToiletClicked(!isToiletClicked); // Toggle the toilet state
    }
  };

  const navigate = (direction: "left" | "right" | "up" | "down") => {
    const nextRoomId = prisonCellPuzzleData.rooms.find(
      (room) => room.id === currentRoomId
    )?.nav[direction];
    if (nextRoomId) {
      setCurrentRoomId(nextRoomId);
    }
  };

  const closeDialogue = () => {
    setDialogue(null);
  };

  const closeGuardDialogue = () => {
    setShowGuardDialogue(false);
  };

  const handleDragStart = (item: DraggableItem) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem) return;

    if (targetId === "tube" && draggedItem.name === "Rag") {
      setIsRagOnTube(true);
      setInventory((prevInventory) => prevInventory.filter((item) => item !== "Rag"));
    }
     if (targetId === "tube" && draggedItem.name === "Alcohol" && isRagOnTube) {
      setIsRagSoaked(true);
      setInventory((prevInventory) => prevInventory.filter((item) => item !== "Rubbing Alcohol"));
    }

      if (targetId === "tube" && draggedItem.name === "Lit Cigarette" && isRagSoaked) {
      setIsHeatOn(true);
      setInventory((prevInventory) => prevInventory.filter((item) => item !== "Lit Cigarette"));
    }
    setDraggedItem(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* Room Container */}
      <div className="relative w-full h-full">
        {/* Background Image - Container */}
        <img
          src={roomBackgrounds[currentRoomId] || prisonCellPuzzleData.rooms.find((room) => room.id === currentRoomId)?.backgroundImageUrl}
          alt={prisonCellPuzzleData.rooms.find((room) => room.id === currentRoomId)?.name}
          className="w-full h-full object-cover z-0"
        />

        {/* Rag Image (Stacked) - Conditional Rendering and Drag Handling*/}
        {currentRoomId === "bedroom" && showRag && (
          <img
            src="/images/prison-cell/rag.webp"
            alt="Rag"
            className="absolute top-0 left-0 object-cover z-1"
          />
        )}

        {/* Rag Phantom Div - Clickable Area (Smaller) - Drag and Drop */}
        {currentRoomId === "bedroom" && showRag && (
          <div
            className="absolute cursor-pointer z-20"
            style={{
              top: pixelToPercentage(747, "height"),
              left: pixelToPercentage(100, "width"),
              width: pixelToPercentage(240, "width"),
              height: pixelToPercentage(153, "height"),
            }}
            onClick={() => handleItemClick("rag")}
          />
        )}

        {/* Pillow Phantom Div - Clickable Area */}
        {currentRoomId === "bedroom" && (
          <div
            className="absolute cursor-pointer z-20"
            style={{
              top: pixelToPercentage(362, "height"),
              left: pixelToPercentage(271, "width"),
              width: pixelToPercentage(268, "width"),
              height: pixelToPercentage(156, "height"),
            }}
            onClick={() => handleItemClick("pillow")}
          />
        )}

        {/* Vent Phantom Div - Clickable Area */}
        {currentRoomId === "bathroom" && showVent && (
          <div
            className="absolute cursor-pointer z-50"
            style={{
              top: pixelToPercentage(714, "height"),
              left: pixelToPercentage(186, "width"),
              width: pixelToPercentage(84, "width"),
              height: pixelToPercentage(89, "height"),
            }}
            onClick={() => handleItemClick("vent")}
          />
        )}

        {/* Toilet Image (Stacked) */}
        {(currentRoomId === "bathroom") && (
          <img
            src={isToiletClicked ? "/images/prison-cell/toilet2.webp" : "/images/prison-cell/toilet.webp"}
            alt="Toilet"
            className="absolute top-0 left-0 object-cover z-1"
          />
        )}

        {/* Toilet Phantom Div - Clickable Area */}
        {(currentRoomId === "bathroom") && (
          <div
            className="absolute cursor-pointer z-20"
            style={{
              top: pixelToPercentage(423, "height"),
              left: pixelToPercentage(494, "width"),
              width: pixelToPercentage(259, "width"),
              height: pixelToPercentage(386, "height"),
            }}
            onClick={() => handleItemClick("toilet")}
          />
        )}

        {/* Mirror Phantom Div - Clickable Area */}
        {(currentRoomId === "bathroom") && (
          <div
            className="absolute cursor-pointer z-20"
            style={{
              top: pixelToPercentage(164, "height"),
              left: pixelToPercentage(183, "width"),
              width: pixelToPercentage(192, "width"),
              height: pixelToPercentage(216, "height"),
            }}
            onClick={() => handleItemClick("mirror")}
          />
        )}

        {/* Alcohol Image (Stacked) */}
        {currentRoomId === "bathroom" && showAlcohol && (
          <img
            src="/images/prison-cell/alcohol.webp"
            alt="Alcohol"
            className="absolute top-0 left-0 object-cover z-1"
          />
        )}

        {/* Alcohol Phantom Div - Clickable Area */}
        {currentRoomId === "bathroom" && showAlcohol && (
          <div
            className="absolute cursor-pointer z-20"
            style={{
              top: pixelToPercentage(711, "height"),
              left: pixelToPercentage(185, "width"),
              width: pixelToPercentage(52, "width"),
              height: pixelToPercentage(72, "height"),
            }}
            onClick={() => handleItemClick("alcohol")}
          />
        )}

        {/* Tap Image (Stacked) */}
        {currentRoomId === "bathroom" && (
          <>
            {isTapOn && (
              <img
                src="/images/prison-cell/tap-on.webp"
                alt="Tap"
                className="absolute top-0 left-0 object-cover z-1"
              />
            )}

            {isHeatOn && isTapOn && (
              <img
                src="/images/prison-cell/tap-hot.webp"
                alt="Hot Tap"
                className="absolute top-0 left-0 object-cover z-2"
              />
            )}
          </>
        )}

        {/* Tap Phantom Div - Clickable Area */}
        {currentRoomId === "bathroom" && (!isHeatOn || !isTapOn) && (
          <div
            className="absolute cursor-pointer z-50"
            style={{
              top: pixelToPercentage(422, "height"),
              left: pixelToPercentage(258, "width"),
              width: pixelToPercentage(57, "width"),
              height: pixelToPercentage(84, "height"),
            }}
            onClick={() => setIsTapOn(!isTapOn)}
          />
        )}

         {/* Sink Phantom Div - Clickable Area - Drop Zone */}
        {currentRoomId === "bathroom" && (
          <div
            className="absolute cursor-pointer z-20"
            style={{
              top: pixelToPercentage(505, "height"),
              left: pixelToPercentage(146, "width"),
              width: pixelToPercentage(324, "width"),
              height: pixelToPercentage(146, "height"),
            }}
            onClick={() => {
                if (isHeatOn && !isTapOn) {
                  setDialogue("The heat from the flames is making the metal from the sink extremely hot to the touch");
                } else if (isHeatOn && isTapOn) {
                  setDialogue("The heat from the sink is causing the water to evaporate creating a foggy steam");
                } else {
                   setDialogue("The sink is made of pure steel.");
                }
                 }}
            onDrop={() => handleDrop("tube")}
            onDragOver={(e) => e.preventDefault()}
          >
          </div>
        )}

        {/* Conditional Rag Images */}
        {currentRoomId === "bathroom" && (
          <>
            {isRagOnTube && !isRagSoaked && !isHeatOn && (
              <img src="/images/prison-cell/rag-sink.webp" alt="Rag on Tube" className="absolute top-0 left-0 w-full h-full object-cover z-2" />
            )}
            {isRagSoaked && !isHeatOn && (
              <img src="/images/prison-cell/rag-sink-soaked.webp" alt="Rag on Tube Soaked" className="absolute top-0 left-0 w-full h-full object-cover z-3" />
            )}
            {isHeatOn && (
              <img src="/images/prison-cell/rag-sink-blaze.webp" alt="Rag on Tube Blazing" className="absolute top-0 left-0 w-full h-full object-cover z-4" />
            )}
          </>
        )}


        {/* Sink Tube Phantom Div - Clickable Area */}
        {currentRoomId === "bathroom" && (
          <div
            className="absolute cursor-pointer z-20"
            style={{
              top: pixelToPercentage(654, "height"),
              left: pixelToPercentage(282, "width"),
              width: pixelToPercentage(71, "width"),
              height: pixelToPercentage(102, "height"),
            }}
            onClick={() => {
                        if (isHeatOn && !isTapOn) {
                  setDialogue("Waves of heat shimmer from the sink, the metal glowing with a dull hunger.");
                } else if (isHeatOn && isTapOn) {
                  setDialogue("Steam billows upward, thick and greasy, blurring the rust-stained walls.");
                } else {
                   setDialogue("The sink is pure steel, glumly defying rust and hope. You sense it’s seen many things scrubbed away—few of them stains.");
                }
            }}
            onDrop={() => handleDrop("tube")}
            onDragOver={(e) => e.preventDefault()}
          >
            {isRagOnTube && !isRagSoaked && !isHeatOn && (
              <img src="/images/prison-cell/rag-sink.webp" alt="Rag on Tube" className="absolute top-0 left-0 object-cover z-2" />
            )}
            {isRagSoaked && !isHeatOn && (
              <img src="/images/prison-cell/rag-sink-soaked.webp" alt="Rag on Tube Soaked" className="absolute top-0 left-0 object-cover z-3" />
            )}
            {isHeatOn && (
              <img src="/images/prison-cell/rag-sink-blaze.webp" alt="Rag on Tube Blazing" className="absolute top-0 left-0 object-cover z-4" />
            )}
          </div>
        )}

        {/* Cigarette Phantom Div - Clickable Area */}
        {currentRoomId === "bars" && !isCigaretteClicked && (
          <>
            <div
              className="absolute cursor-pointer z-20"
              style={{
                top: pixelToPercentage(439, "height"),
                left: pixelToPercentage(370, "width"),
                width: pixelToPercentage(30, "width"),
                height: pixelToPercentage(8, "height"),
              }}
              onClick={() => handleItemClick("cigarette")}
            />
          </>
        )}

         {/* Lock Phantom Div - Clickable Area */}
        {currentRoomId === "bars" && (
            <div
                className="absolute cursor-pointer z-20"
                style={{
                    top: pixelToPercentage(614, "height"),
                    left: pixelToPercentage(108, "width"),
                    width: pixelToPercentage(160, "width"),
                    height: pixelToPercentage(162, "height"),
                }}
                onClick={() => handleItemClick("lock")}
            >
            </div>
        )}

        {/* Skeleton Guard Phantom Divs - Clickable Areas */}
        {currentRoomId === "bars" && (
            <>
                <div
                    className="absolute cursor-pointer z-20"
                    style={{
                        top: pixelToPercentage(278, "height"),
                        left: pixelToPercentage(376, "width"),
                        width: pixelToPercentage(126, "width"),
                        height: pixelToPercentage(144, "height"),
                    }}
                    onClick={() => handleItemClick("guard")}
                >
                </div>
                <div
                    className="absolute cursor-pointer z-20"
                    style={{
                        top: pixelToPercentage(480, "height"),
                        left: pixelToPercentage(312, "width"),
                        width: pixelToPercentage(284, "width"),
                        height: pixelToPercentage(406, "height"),
                    }}
                    onClick={() => handleItemClick("guard")}
                >
                </div>
                <div
                    className="absolute cursor-pointer z-20"
                    style={{
                        top: pixelToPercentage(366, "height"),
                        left: pixelToPercentage(424, "width"),
                        width: pixelToPercentage(74, "width"),
                        height: pixelToPercentage(120, "height"),
                    }}
                    onClick={() => handleItemClick("guard")}
                >
                </div>
            </>
        )}

        {/* Bed Phantom Div - Clickable Area */}
        {currentRoomId === "bedroom" && (
            <div
                className="absolute cursor-pointer z-20"
                style={{
                    top: pixelToPercentage(498, "height"),
                    left: pixelToPercentage(359, "width"),
                    width: pixelToPercentage(574, "width"),
                    height: pixelToPercentage(386, "height"),
                }}
                onClick={() => handleItemClick("bed")}
            >
            </div>
        )}

        {/* Gated Window Phantom Div - Clickable Area */}
        {currentRoomId === "bedroom" && (
            <div
                className="absolute cursor-pointer z-20"
                style={{
                    top: pixelToPercentage(46, "height"),
                    left: pixelToPercentage(693, "width"),
                    width: pixelToPercentage(195, "width"),
                    height: pixelToPercentage(159, "height"),
                }}
                onClick={() => handleItemClick("window")}
            >
            </div>
        )}

        {/* Navigation Arrows */}
        {prisonCellPuzzleData.rooms.find((room) => room.id === currentRoomId)?.nav.left && (
          <button
            onClick={() => navigate("left")}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &larr;
          </button>
        )}
        {prisonCellPuzzleData.rooms.find((room) => room.id === currentRoomId)?.nav.right && (
          <button
            onClick={() => navigate("right")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &rarr;
          </button>
        )}

        {/* Dialogue Popup */}
        {dialogue && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-4 rounded-md shadow-md w-1/2">
              <p className="text-gray-200 font-pixel text-sm">{dialogue}</p>
              <button
                onClick={closeDialogue}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>


   {/* Inventory Display */}
      <div className="bg-gray-800/50 p-2 rounded-md shadow-md mt-4">
        <h3 className="text-purple-200 font-pixel text-sm mb-1">Inventory:</h3>
        {inventory.length === 0 ? (
          <span className="text-gray-400 font-pixel text-xs">Empty</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {inventory.map((item, index) => {
                const imageSrc = getItemImage(item);
                return (
                  imageSrc ? (
                      <img
                          key={index}
                          src={imageSrc}
                          alt={item}
                          className="w-8 h-8" // Adjust size as needed
                      />
                  ) : (
                      <div
                          key={index}
                          className="bg-gray-700 px-2 py-1 rounded-full text-xs font-pixel text-gray-200"
                      >
                          {item}
                      </div>
                  )
                );
            })}
          </div>
        )}
      </div>
     
     
      {showGuardDialogue && (
        <CharacterDialoguePopup
          character="skeleton"
          dialogue="HEY! I WAS HOLDING THAT! ...whatever, not like I can smoke anyways. I have no lungs."
          onClose={closeGuardDialogue}
        />
      )}
    </div>
  );
};

export default PrisonCellPuzzle;