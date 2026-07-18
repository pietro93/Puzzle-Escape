import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"
import * as fs from "fs"

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit()
}

const createWindow = () => {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "../assets/icon.png"),
    backgroundColor: "#121212",
  })

  // Load the app
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"))
  } else {
    mainWindow.loadURL("http://localhost:3000")
  }

  // Open DevTools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// Handle save game data
ipcMain.handle("save-game", async (event, gameData) => {
  const userDataPath = app.getPath("userData")
  const savePath = path.join(userDataPath, "save.json")

  try {
    fs.writeFileSync(savePath, JSON.stringify(gameData))
    return { success: true }
  } catch (error) {
    console.error("Failed to save game:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
})

// Handle load game data
ipcMain.handle("load-game", async () => {
  const userDataPath = app.getPath("userData")
  const savePath = path.join(userDataPath, "save.json")

  try {
    if (fs.existsSync(savePath)) {
      const data = fs.readFileSync(savePath, "utf8")
      return { success: true, data: JSON.parse(data) }
    }
    return { success: false, error: "No save file found" }
  } catch (error) {
    console.error("Failed to load game:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
})
