import { contextBridge, ipcRenderer } from "electron"

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  saveGame: (data: any) => ipcRenderer.invoke("save-game", data),
  loadGame: () => ipcRenderer.invoke("load-game"),
  platform: "electron",
})
