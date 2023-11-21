import { FileInfo, Result } from "../interfaces";
import { DEFAULT_FILE_INFO, isOk } from "../others/utils";
import { googleApiCall } from "./common";
const ext = '.excalidraw'
export async function renameFile(fileId: string, newFileName: string) {
    newFileName += ext
    const res = await googleApiCall<FileInfo>({
        path: '/drive/v3/files/' + fileId,
        method: 'PATCH',
        query: {
            fields: 'id, name, createdTime,modifiedTime,mimeType,size'
        },
        headers: {
            'Content-Type': "application/json"
        },
        body: {
            name: newFileName
        },
    })
    return res
}
export async function readFile(fileId: string) {
    const { result, ...others } = await googleApiCall<any>({
        path: '/drive/v3/files/' + fileId,
        method: 'GET',

        query: {
            alt: 'media'
        },
        async onSuccess(res, result) {
            result.result = await res.text()
            return result
        },
    })
    const newResult: Result<string | undefined> = {
        ...others
    }
    newResult.result = result
    return newResult
}
export async function createFile(fileName: string) {
    fileName += ext
    //creating file 
    const { result, ...others } = await googleApiCall<any>({
        path: '/drive/v3/files',
        method: 'POST',
        body: {
            name: fileName,
            mimeType: "application/json"
        },
        query: {
            fields: 'id, name, createdTime,modifiedTime,mimeType,size',
        }
    })
    const newResult: Result<FileInfo | undefined> = {
        ...others
    }
    if (result) {
        newResult.result = { ...DEFAULT_FILE_INFO, ...result }
    }
    return newResult
}
export async function deleteFile(fileId: string) {
    const result = await googleApiCall<any>({
        path: '/drive/v3/files/' + fileId,
        method: 'DELETE',
        async onSuccess(res, result) {
            result.result = await res.text()
            return result
        },

    })
    const newResult: Result<boolean> = {
        ...result
    }
    newResult.result = isOk(result) ? true : false
    return newResult

}
export async function updateFile(fileId: string, data: string) {
    const { result, ...others } = await googleApiCall<any>({
        path: '/upload/drive/v3/files/' + fileId,
        method: 'PATCH',
        query: {
            uploadType: 'media',
            fields: 'id, name, createdTime,modifiedTime,mimeType,size'
        },
        headers: {
            'Content-Type': "application/json"
        },
        body: data
    })
    const newResult: Result<string | undefined> = {
        ...others
    }
    if (result) {
        newResult.result = result
    }
    return newResult
}
export async function listFiles() {
    const { result, ...others } = await googleApiCall<any>({
        path: '/drive/v3/files',
        query: {
            fields: 'nextPageToken, files(id, name, createdTime,modifiedTime,mimeType,size)',
            pageSize: 1000,
            q: `trashed=false and name contains '${ext}' and mimeType='application/json'`
        }
    })
    const newResult: Result<FileInfo[] | undefined> = {
        ...others
    }
    if (result) {
        newResult.result = result.files.map((e: any) => {
            return { ...DEFAULT_FILE_INFO, ...e }
        })
    }
    return newResult
}
