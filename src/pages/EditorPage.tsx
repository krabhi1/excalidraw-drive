import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawAPIRefValue,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import { useEffect, useRef, useState } from "react";
import FileList from "../components/FileList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectProfile, setProfile } from "../store/slice/userProfileSlice";
import { listFiles } from "../api/drive";
import { getUserProfile } from "../api/google";
import { getAccessTokenCookies, showResultMessage } from "../others/utils";
import { activeFileInfo, dataMap, syncManager } from "../store/global";
import {
  createOfflineFile,
  setDriveFiles,
  updateWithId,
} from "../store/slice/filesSlice";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import { Layout, Skeleton, notification } from "antd";
import {
  selectExtraInfo,
  setSelectedFileId,
} from "../store/slice/extraInfoSlice";
import { getFileInfoFromId } from "../store/slice/utils";
import store from "../store";
interface DataFile {
  filename: string;
  excalElements: ExcalidrawElement[];
  appState?: AppState;
  lastSave: number;
  lastUpdate: number;
}

export default function EditorPage() {
  const excalRef = useRef<ExcalidrawImperativeAPI>(null);
  const userProfile = useAppSelector(selectProfile);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  //
  const extraInfo = useAppSelector(selectExtraInfo);
  const selectedFileId = extraInfo.selectedFileId;

  const [activeFileId, setActiveFileId] = useState<string>();
  useEffect(() => {
    setActiveFileId(undefined);
    //clearCanvas()
    //load text from textMap or server
    const loadFile = async () => {
      if (!selectedFileId) return;
      const id = selectedFileId;
      const data = (await dataMap.getTextOrReadDrive(id)) as any;
      //only if selectedFileId is id
      const newSelectedFileId = store.getState().extraInfo.value.selectedFileId;
      if (selectedFileId && selectedFileId == newSelectedFileId) {
        //activeFileInfo.fileId = newSelectedFileId
        setActiveFileId(newSelectedFileId);
        if (data) {
          excalRef.current?.updateScene({
            ...data,
          });
        } else {
          excalRef.current?.updateScene({
            elements: [],
            appState: {},
          });
        }
      }
    };
    loadFile();

    //save for last open file
    if (selectedFileId) {
      localStorage.setItem("last_open_file_id", selectedFileId);
    }
  }, [selectedFileId]);

  async function init() {
    //check token or redirect to login
    if (!getAccessTokenCookies()) {
      return navigate("/login", { replace: true });
    }
    //load profile
    const profile = await getUserProfile();
    if (profile.result) {
      dispatch(setProfile(profile.result));
    } else {
      showResultMessage(profile);
    }
    //load files
    const files = await listFiles();
    if (files.result) {
      dispatch(setDriveFiles(files.result));
      //
      let fileId = localStorage.getItem("last_open_file_id");
      if (!fileId) {
        fileId = files.result[0].id;
      }
      dispatch(setSelectedFileId(fileId));
    } else {
      showResultMessage(files);
    }
    //sync manager
    syncManager.start();
  }
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!activeFileId) {
      clearCanvas();
    }
  }, [activeFileId]);

  function handleAddFile() {
    //show add file dialog
    const name = window.prompt("Add file")?.trim();
    if (name && name.length > 0) {
      const id = "offline_" + name + "_" + Math.random();
      dispatch(createOfflineFile({ name, id }));
      dispatch(setSelectedFileId(id));
    }
  }

  function closeMenu() {
    const state = { ...excalRef.current?.getAppState()!, openMenu: null };
    excalRef.current?.updateScene({ appState: state });
  }
  function handleDelete(i: number) {
    closeMenu();
  }
  function handleRename(i: number) {
    closeMenu();
  }
  function handleChange(
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    _: BinaryFiles
  ) {
    const file = getFileInfoFromId(activeFileId);
    // setData((e) => {
    //   return { elements }
    // })
    if (activeFileId) {
      const time = Date.now();
      const id = activeFileId;
      dispatch(
        updateWithId({
          id: id,
          info: {
            lastUpdate: time,
          },
        })
      );
      dataMap.setData(id, {
        elements,
        appState,
      });
    }
  }

  function clearCanvas() {
    excalRef.current?.resetScene();
  }
  return (
    <div className="main">
      <Excalidraw ref={excalRef} onChange={handleChange}>
        <WelcomeScreen>
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.Logo />
            <WelcomeScreen.Center.Heading>
              {selectedFileId && selectedFileId != activeFileId
                ? "loading..."
                : " Select file or create one"}
            </WelcomeScreen.Center.Heading>
          </WelcomeScreen.Center>
        </WelcomeScreen>
        <MainMenu>
          <MainMenu.ItemCustom>
            <Layout className="">
              {userProfile ? (
                <Profile profile={userProfile} />
              ) : (
                <Skeleton active avatar paragraph={{ rows: 0 }} />
              )}
            </Layout>
          </MainMenu.ItemCustom>

          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
          <MainMenu.Group title="files">
            <MainMenu.Item onSelect={handleAddFile}>Add file</MainMenu.Item>
            <FileList />
          </MainMenu.Group>
        </MainMenu>
      </Excalidraw>
    </div>
  );
}
