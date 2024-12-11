import { toast } from "@/hooks/use-toast";
import axios from "axios";
export type DriveBaseFile = {
  createdTime: string;
  id: string;
  mimeType: string;
  modifiedTime: string;
  name: string;
};
export type DriveFolder = DriveBaseFile;
export type DriveFile = DriveBaseFile & { size: number };
const FILE_EXTENSION = ".excalidraw";
const FOLDER_NAME = "exaclidraw-drive";
export let defaultFolderId: string;
const driveApi = axios.create({
  baseURL: "https://www.googleapis.com",
});

export function initDriveApi({ token }: { token: string }) {
  driveApi.defaults.headers["Authorization"] = "Bearer " + token;
}

//store all files inside a excalidraw-drive folder
export async function renameFile(fileId: string, newFileName: string) {
  const result = await driveApi.patch(
    "/drive/v3/files/" + fileId,
    {
      name: newFileName + FILE_EXTENSION,
    },
    {
      params: {
        fields: "id, name, createdTime,modifiedTime,mimeType,size",
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data as DriveFile;
}
export async function readFileData(fileId: string) {
  const result = await driveApi.get("/drive/v3/files/" + fileId, {
    params: {
      alt: "media",
    },
  });
  return result.data as string;
}
export async function createFile(fileName: string) {
  const result = await driveApi.post(
    "/drive/v3/files",
    {
      name: fileName + FILE_EXTENSION,
      mimeType: "application/json",
      parents: [defaultFolderId],
    },
    {
      params: {
        fields: "id, name, createdTime,modifiedTime,mimeType,size",
      },
    }
  );
  return result.data as DriveFile;
}
export async function createFolder(folderName: string) {
  const result = await driveApi.post(
    "/drive/v3/files",
    {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    {
      params: {
        fields: "id, name, createdTime,modifiedTime,mimeType",
      },
    }
  );
  return result.data as DriveFolder;
}
export async function deleteFile(fileId: string) {
  await driveApi.delete("/drive/v3/files/" + fileId);
}
export async function updateFileData(fileId: string, data: string) {
  const result = await driveApi.patch(
    "/upload/drive/v3/files/" + fileId,
    data,
    {
      params: {
        fields: "id, name, createdTime,modifiedTime,mimeType,size",
        uploadType: "media",
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data as DriveFile;
}
// list all files of default folder
export async function getFiles() {
  const result = await driveApi.get("/drive/v3/files", {
    params: {
      pageSize: 1000,
      q: `trashed=false and '${defaultFolderId}' in parents and name contains '${FILE_EXTENSION}' and mimeType='application/json'`,
      fields:
        "nextPageToken, files(id, name, createdTime,modifiedTime,mimeType,size)",
    },
  });
  return result.data.files as DriveFile[];
}
// folders
export async function getFolders() {
  const result = await driveApi.get("/drive/v3/files", {
    params: {
      pageSize: 1000,
      q: `trashed=false and mimeType='application/vnd.google-apps.folder'`,
      fields:
        "nextPageToken, files(id, name, createdTime,modifiedTime,mimeType)",
    },
  });
  return result.data.files as DriveFolder[];
}

export async function driveTest(token: string) {
  driveApi.defaults.headers["Authorization"] = "Bearer " + token;
  const folder = await createFolder("folder-" + Math.random());
  const folders = await getFolders();
  defaultFolderId = folders[0].id;
  const file = await createFile("file-" + Math.random());
  const rename = await renameFile(file.id, "file-rename-" + Math.random());
  const updated = await updateFileData(file.id, "this is good ".repeat(100));
  const read = await readFileData(file.id);
  const files = await getFiles();
  const d = await deleteFile(file.id);

  console.log({ folders, files, file, rename, updated, read, d, folder });
}

//subscibe for access_token change
// useUserStore.subscribe((state) => {
//   if (state.user) {
//     driveApi.defaults.headers["Authorization"] =
//       "Bearer " + state.user.accessToken;
//   } else {
//     // delete driveApi.defaults.headers["Authorization"];
//   }
// });

//rediect to login
driveApi.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        // Handle 401 errors
        console.error("Unauthorized! Redirecting to login...");
        //just delete the user
        // const state = useUserStore.getState();
        // toast({
        //   title: "Google token expired",
        //   description:
        //     "Token expired, so you need to login again. Token is only valid for 1 hour",
        // });
        // state.setUser(undefined);
        // localStorage.removeItem("user");
      }
    }

    return Promise.reject(error); // Reject other errors
  }
);
