import { faker } from "@faker-js/faker";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectProfile, setProfile } from "../store/slice/userProfileSlice";
import { Skeleton, message } from "antd";
import { FileInfo } from "../interfaces";
import {
  createOfflineFile,
  selectFiles,
  setFiles,
} from "../store/slice/filesSlice";
import {
  delay,
  getAccessTokenCookies,
  randomFileInfo,
  randomInt,
  setAccessTokenCookies,
} from "../others/utils";
import React from "react";
import {
  selectExtraInfo,
  setSelectedFileId,
} from "../store/slice/extraInfoSlice";
import { refreshAccessToken } from "../api/token";
import { createFile, deleteFile, readFile, updateFile } from "../api/drive";
import store from "../store";
export default function Test() {
  const test = [
    ProfileStateTest,
    FileInfoTest,
    ExtraFileTest,
    ApiCall,
    DriveTest,
  ];
  return (
    <div>
      {test.map((E, i) => (
        <React.Fragment key={i}>
          <E />
          {i != test.length - 1 ? <hr /> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

function ProfileStateTest() {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();

  function handleFetchProfile() {
    dispatch(
      setProfile({
        name: "abhishek",
        imageURL: faker.image.avatar(),
        email: "@nothing",
      })
    );
  }
  return (
    <div>
      {profile ? (
        <div>
          <img
            style={{
              width: "32px",
            }}
            src={profile.imageURL}
            alt="no image"
          />
          {profile.name}
        </div>
      ) : (
        <Skeleton
          avatar
          paragraph={{ rows: 0 }}
          style={{
            width: "100px",
          }}
        />
      )}
      <div>
        <button onClick={handleFetchProfile}>fetch profile</button>
      </div>
    </div>
  );
}

function FileInfoTest() {
  const files = useAppSelector(selectFiles);
  const dispatch = useAppDispatch();
  const Item = ({ file }: { file: FileInfo }) => {
    return <div>{JSON.stringify(file)}</div>;
  };
  function handleAdd() {
    dispatch(setFiles([...files, randomFileInfo()]));
  }
  async function updateRandom() {
    const index = randomInt(0, files.length - 1);
    const newFiles = [...files];
    newFiles[index] = randomFileInfo();
    message.info("updating at " + index);
    await delay(1000);
    dispatch(setFiles([...newFiles]));
  }
  return (
    <div>
      <button onClick={handleAdd}>Add</button>
      <button onClick={updateRandom}>Update</button>
      <div>
        {files.map((e) => (
          <Item file={e} key={e.id} />
        ))}
      </div>
    </div>
  );
}

function ExtraFileTest() {
  const extraInfo = useAppSelector(selectExtraInfo);
  const dispatch = useAppDispatch();
  function handleUpdate() {
    dispatch(setSelectedFileId(faker.string.sample(5)));
  }
  return (
    <div>
      <button onClick={handleUpdate}>update</button>
      <div> {JSON.stringify(extraInfo)}</div>
    </div>
  );
}

function ApiCall() {
  async function handleCall() {
    const result = await refreshAccessToken();
  }
  function handleInvalidToken() {
    setAccessTokenCookies("--nothing--");
  }
  return (
    <div>
      <button onClick={handleCall}>refresh access_token</button>
      <button onClick={handleInvalidToken}>invalid token</button>
    </div>
  );
}

function DriveTest() {
  function handleCreate() {
    // createFile(faker.system.commonFileName());
    const name = faker.system.commonFileName()
    const id = "offline_" + name + "_" + Math.random()
    store.dispatch(createOfflineFile({ name, id }));
  }
  async function handleDelete() {
    // createFile(faker.system.commonFileName());
    const name = faker.system.commonFileName()
    const file = await createFile(name)
    if (file.result) {
      const result = await deleteFile(file.result.id)
    }
  }
  async function handleRead() {
    const result = await readFile('153NZlVFsyTmnz_PZd2lkZM1WgVgU2GHn')
  }
  async function handleWrite() {
    const result = await updateFile('153NZlVFsyTmnz_PZd2lkZM1WgVgU2GHn', "hello")
  }
  return (
    <div>
      <button onClick={handleCreate}>create</button>
      <button onClick={handleRead}>read</button>
      <button onClick={handleWrite}>write</button>
      <button onClick={handleDelete}>delete</button>
    </div>
  );
}
