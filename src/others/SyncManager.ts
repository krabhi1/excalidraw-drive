import { serializeAsJSON } from "@excalidraw/excalidraw";
import { createFile, deleteFile, updateFile } from "../api/drive";
import { FileInfo } from "../interfaces";
import store from "../store";
import { dataMap } from "../store/global";
import { setSelectedFileId } from "../store/slice/extraInfoSlice";
import { removeWithId, updateWithId } from "../store/slice/filesSlice";
import { delay } from "./utils";


export default class SyncManager {
    private timerId = 0;
    private isLock = false;

    start() {
        this._start();
    }

    close() {
        clearInterval(this.timerId);
    }

    private _start() {
        this.timerId = setInterval(() => {
            this.update();
        }, 1000);
    }
    private async update() {
        if (this.isLock) {
            return;
        }
        this.isLock = true;
        let data = store.getState().files.value
        for (let i = 0; i < data.length; i++) {
            let item = data[i]

            if (item.isNew) {
                await this.handleNew(item)
            } else if (item.isDeleted) {
                await this.handleDelete(item)
            } else if (item.lastUpdate > item.lastSave) {
                await this.handleSave(item)
            }

        }
        this.isLock = false;
    }
    private async handleDelete(item: FileInfo) {
        const { result, ...info } = await deleteFile(item.id)
        if (result) {
            //remove file from textMap , files, selectedId
            store.dispatch(removeWithId(item.id))
            //remove selected
            const selectedFileId = store.getState().extraInfo.value.selectedFileId
            if (selectedFileId && selectedFileId == item.id) {
                store.dispatch(setSelectedFileId(undefined))
            }
            dataMap.delete(item.id)
        } else {
        }
    }
    private async handleNew(item: FileInfo) {
        const { result, ...info } = await createFile(item.name)
        if (result) {
            const newItem = { ...item }
            newItem.id = result.id
            newItem.isNew = false
            //rename textMap
            const oldText = dataMap.getData(item.id)
            dataMap.setData(newItem.id, oldText || '')
            dataMap.delete(item.id)
            //update files
            store.dispatch(updateWithId({
                id: item.id,
                info: newItem
            }))
            //re select if selected
            const selectedFileId = store.getState().extraInfo.value.selectedFileId
            if (selectedFileId && selectedFileId == item.id) {
                store.dispatch(setSelectedFileId(newItem.id))
            }

        }
    }
    private async handleSave(item: FileInfo) {
        //check if sync needed or not
        const newTime = Date.now();
        //const text = JSON.stringify(dataMap.getData(item.id)!!)
        const { elements, appState } = dataMap.getData(item.id)!! as any
        const text = serializeAsJSON(elements,appState,null as any,'local')
        const response = await updateFile(item.id, text)
        store.dispatch(updateWithId({
            id: item.id,
            info: {
                lastSave: newTime
            }
        }))

    }
}