export interface UserProfile {
    name: string;
    imageURL: string;
    email: string
}
export interface FileInfo {
    id: string;
    name: string;
    lastSave: number;
    lastUpdate: number;
    isNew: boolean
    isDeleted: boolean
    rename?: { name: string }
}
export interface ExtraInfo {
    selectedFileId?: string
}
export interface Result<T = any> {
    result?: T
    errorMessage: string
    error?: any
    statusCode: number
}
export interface RequestQuery {
    path?: string;
    method?: "GET" | "POST" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
    authToken?: string
    onSuccess?: (res: Response, result: Result) => Promise<Result>
    onFail?: (res: Response, result: Result) => Promise<Result>
}