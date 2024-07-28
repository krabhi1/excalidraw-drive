import SyncManager from "../others/SyncManager"
import DataMap from "../others/DataMap"


export const dataMap = new DataMap()
export const syncManager = new SyncManager()
export let activeFileInfo :any= {
    fileId: undefined
}