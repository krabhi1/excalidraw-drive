import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  selectExtraInfo,
  setSelectedFileId,
} from "../store/slice/extraInfoSlice";
import { selectFiles, updateWithId } from "../store/slice/filesSlice";
import FileListItem from "./FileListItem";

export default function FileList() {
  const items_ = useAppSelector(selectFiles);
  const items = items_.map((file) => ({
    ...file,
    name: file.name.replace(".excalidraw", ""),
  }));
  const dispatch = useAppDispatch();
  const extraInfo = useAppSelector(selectExtraInfo);
  const selectedFileId = extraInfo.selectedFileId;
  //const items = files.filter((e) => !e.isDeleted);
  const [hoverItemID, setHoverItemID] = useState("");
  return (
    <div className="file-box">
      {items.map((file, i) => (
        <FileListItem
          onDeleteClick={(e) => {
            dispatch(
              updateWithId({
                id: hoverItemID,
                info: {
                  isDeleted: true,
                },
              })
            );
          }}
          onRenameClick={(file) => {}}
          onHover={setHoverItemID}
          selectedItemId={selectedFileId}
          key={file.id}
          fileInfo={file}
          onClick={(e) => dispatch(setSelectedFileId(e))}
        />
      ))}
    </div>
  );
}
