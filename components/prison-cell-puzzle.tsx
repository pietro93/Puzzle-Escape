import React, { useState } from "react";

interface PrisonCellPuzzleProps {
  onSolve: () => void;
}

// Define the InteractiveItem type here
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
  };
}

const PrisonCellPuzzle: React.FC<PrisonCellPuzzleProps> = ({ onSolve }) => {
  // Define prisonCellPuzzleData directly in the component
  const prisonCellPuzzleData = {
    initialRoom: "bars",
    rooms: [
      {
        id: "bars",
        name: "Cell Bars",
        backgroundImageUrl: "/images/prison-cell/bars.webp",
        items: [],
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
              dialogue: "The pillow is disgusting and covered in stains. You wouldn't dare touch it.",
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
            onClick: {
              dialogue: "It's a toilet. What did you expect?",
            },
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
              dialogue: "Just your ugly mug staring back at you.",
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
            },
          } as InteractiveItem,
          {
            id: "toilet",
            name: "Toilet",
            imageUrl: "/images/prison-cell/toilet2.webp",
            position: { top: 423, left: 494 },
            width: 259,
            height: 386,
            unit: "px",
            initialVisibility: true,
            onClick: {
              dialogue: "It's a toilet. What did you expect?",
            },
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
              dialogue: "Just your ugly mug staring back at you.",
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
  const [showRag, setShowRag] = useState<boolean>(true);
  const [inventory, setInventory] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [isBathroomVentOpen, setIsBathroomVentOpen] = useState<boolean>(false);
  const [isToiletClicked, setIsToiletClicked] = useState<boolean>(false);
  const [showAlcohol, setShowAlcohol] = useState<boolean>(false);
  const [showVent, setShowVent] = useState<boolean>(true);
  const [isHeatOn, setIsHeatOn] = useState<boolean>(false);
  const [isTapOn, setIsTapOn] = useState<boolean>(false);
  const [roomBackgrounds, setRoomBackgrounds] = useState<Record<string, string>>({
    bathroom: "/images/prison-cell/bathroom.webp",
  });

  const pixelToPercentage = (pixel: number, dimension: "width" | "height", baseDimension: number = 950) => {
    return `${(pixel / baseDimension) * 100}%`;
  };

  const changeRoomBackground = (roomId: string, newBackgroundImageUrl: string) => {
    setRoomBackgrounds((prevBackgrounds) => ({
      ...prevBackgrounds,
      [roomId]: newBackgroundImageUrl,
    }));
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === "vent") {
      setIsBathroomVentOpen(true);
      changeRoomBackground("bathroom", "/images/prison-cell/bathroom-2.webp");
      setShowAlcohol(true);
      setShowVent(false);
      return;
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
    }

    if (itemId === "toilet") {
      setIsToiletClicked(true);
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

  return (
    <div className="relative w-full h-full w-full h-full">
      {/* Room Container */}
      <div className="relative w-full h-full">
        {/* Background Image - Container */}
        <img
          src={roomBackgrounds[currentRoomId] || prisonCellPuzzleData.rooms.find((room) => room.id === currentRoomId)?.backgroundImageUrl}
          alt={prisonCellPuzzleData.rooms.find((room) => room.id === currentRoomId)?.name}
          className="w-full h-full object-cover z-0"
        />

        {/* Rag Image (Stacked) */}
        {currentRoomId === "bedroom" && showRag && (
          <img
            src="/images/prison-cell/rag.webp"
            alt="Rag"
            className="absolute top-0 left-0 object-cover z-1"
          />
        )}

        {/* Rag Phantom Div - Clickable Area (Smaller) */}
        {currentRoomId === "bedroom" && showRag && (
          <div
            className="absolute cursor-pointer z-2"
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
            className="absolute cursor-pointer z-2"
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
            src={currentRoomId === "bathroom" && !isToiletClicked ? "/images/prison-cell/toilet.webp" : "/images/prison-cell/toilet2.webp"}
            alt="Toilet"
            className="absolute top-0 left-0 object-cover z-1"
          />
        )}

        {/* Toilet Phantom Div - Clickable Area */}
        {(currentRoomId === "bathroom") && (
          <div
            className="absolute cursor-pointer z-2"
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
            className="absolute cursor-pointer z-2"
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
            className="absolute cursor-pointer z-2"
            style={{
              top: pixelToPercentage(711, "height"),
              left: pixelToPercentage(185, "width"),
              width: pixelToPercentage(52, "width"),
              height: pixelToPercentage(72, "height"),
            }}
            onClick={() => handleItemClick("alcohol")}
          />
        )}
      </div>

      {/* Tap Image (Stacked) */}
      {currentRoomId === "bathroom" && (
        <>
          {isTapOn && (
            <img
              src="/images/prison-cell/tap-on.webp"
              alt="Tap"
              className="absolute top-0 left-0 object-cover z-1"
              style={{
                top: pixelToPercentage(422, "height"),
                left: pixelToPercentage(258, "width"),
                width: pixelToPercentage(85, "width"),
                height: pixelToPercentage(78, "height"),
              }}
            />
          )}

          {isHeatOn && isTapOn && (
            <img
              src="/images/prison-cell/tap-hot.webp"
              alt="Hot Tap"
              className="absolute top-0 left-0 object-cover z-2"
              style={{
                top: pixelToPercentage(422, "height"),
                left: pixelToPercentage(258, "width"),
                width: pixelToPercentage(85, "width"),
                height: pixelToPercentage(78, "height"),
              }}
            />
          )}
        </>
      )}

      {/* Tap Phantom Div - Clickable Area */}
      {currentRoomId === "bathroom" && !isHeatOn && (
        <div
          className="absolute cursor-pointer z-3"
          style={{
            top: pixelToPercentage(422, "height"),
            left: pixelToPercentage(258, "width"),
            width: pixelToPercentage(85, "width"),
            height: pixelToPercentage(78, "height"),
          }}
          onClick={() => handleItemClick("tap")}
        />
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

      {/* Inventory Display */}
      <div className="bg-gray-800/50 p-2 rounded-md shadow-md mt-4">
        <h3 className="text-purple-200 font-pixel text-sm mb-1">Inventory:</h3>
        {inventory.length === 0 ? (
          <span className="text-gray-400 font-pixel text-xs">Empty</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {inventory.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 px-2 py-1 rounded-full text-xs font-pixel text-gray-200"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

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
  );
};

export default PrisonCellPuzzle;