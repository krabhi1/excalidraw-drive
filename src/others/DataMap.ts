import { readFile } from "../api/drive"
import store from "../store"
import { getFileInfoFromId } from "../store/slice/utils"

export default class DataMap {
    map = new Map<string, Object|undefined>()
    async getTextOrReadDrive(id: string) {
        let data: Object | undefined = undefined
        data = this.map.get(id)
        //check file is offline create one
        const fileInfo = getFileInfoFromId(id)

        if (data == undefined) {
            if (fileInfo && fileInfo.isNew) {
               
            } else {
                const result = await readFile(id)
                if (result.result != undefined) {
                    try {
                        data = JSON.parse(result.result)
                    } catch (error) {
                       
                    }
                } else {
                }
            }
            this.map.set(id, data )
        }
        return data
    }
    setData(id: string, data: Object|undefined) {
        this.map.set(id, data)
    }
    getData(id: string) {
        return this.map.get(id)
    }
    delete(id: string) {
        this.map.delete(id)
    }
}