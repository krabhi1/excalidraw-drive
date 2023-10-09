import { MainMenu } from "@excalidraw/excalidraw";
import { FileInfo } from "../interfaces";
import { Spin } from "antd";
import { LoadingOutlined, MoreOutlined } from "@ant-design/icons";

interface Props {
    fileInfo: FileInfo
    selectedItemId: string | undefined;
    onDeleteClick?: (id: string) => void
    onRenameClick?: (info: FileInfo) => void
    onClick?: (id: string) => void
    onHover?: (id: string) => void
}
function Status({ file }: { file: FileInfo }) {

    if (file.isDeleted) return <Spin indicator={<LoadingOutlined style={{ fontSize: "13px", color: 'red' }} />} />
    if (file.isNew) return <Spin indicator={<LoadingOutlined style={{ fontSize: "13px", color: 'green' }} />} />
    const isSaving = file.lastUpdate > file.lastSave
    if (isSaving) return <Spin indicator={<LoadingOutlined style={{ fontSize: "13px" }} />} />
    return <></>
}
export default function FileListItem(
    props: Props
) {
    const { fileInfo: file, selectedItemId } = props


    return (
        <MainMenu.ItemCustom
            className={`file-item ${file.id === selectedItemId ? "file-selected" : ""
                }`}
            onClick={() => {
                props.onClick?.call(null, file.id)
            }}
            onMouseEnter={() => {
                props.onHover?.call(null, file.id)
            }}
        >
            <span>{file.name}</span>
            <div className="file-icon-box">
                <Status file={file} />
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onRenameClick?.call(null, file)
                    }}
                    className="edit-icon"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                    >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                    </svg>
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onDeleteClick?.call(null, file.id)

                    }}
                    className="delete-icon"
                >
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            strokeWidth="1.25"
                            d="M3.333 5.833h13.334M8.333 9.167v5M11.667 9.167v5M4.167 5.833l.833 10c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667l.833-10M7.5 5.833v-2.5c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833v2.5"
                        ></path>
                    </svg>
                </div>
            </div>
        </MainMenu.ItemCustom>
    );
}