import store from "..";

export function getFileInfoFromId(fileId?: string) {
    return store.getState().files.value.find((e) => e.id === fileId)
}