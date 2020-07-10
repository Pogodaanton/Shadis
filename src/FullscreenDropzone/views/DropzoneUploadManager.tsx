import React, { useState, useEffect, useCallback } from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DropzoneUploadManagerClassNameContract,
  DropzoneUploadManagerProps,
} from "./DropzoneUploadManager.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import DropzoneUpload from "./DropzoneUpload";
import { uniqueId } from "lodash-es";
import DropzoneDrag from "./DropzoneDrag";
import { classNames } from "@microsoft/fast-web-utilities";

const styles: ComponentStyles<DropzoneUploadManagerClassNameContract, DesignSystem> = {
  dropzoneUploadManager: {
    display: "flex",
    flexWrap: "wrap",
    overflow: "auto",
    justifyContent: "space-around",
    "& > *": {
      marginBottom: "20px",
    },
  },
  dropzoneUploadManager__empty: {
    zIndex: "-1",
    opacity: "0.5",
  },
};

const DropzoneUploadManager = (props: DropzoneUploadManagerProps) => {
  const [dropData, setDropData] = useState(props.dropData);
  const [uploadList, changeUploadList] = useState([]);

  const manageDropDataChange = useCallback(() => {
    const { dropData } = props;

    const acceptedUploadList = dropData.acceptedFiles.map(file => {
      return {
        key: uniqueId(new Date().getTime() + ""),
        file,
        rejected: false,
        preview: URL.createObjectURL(file),
      };
    });

    const rejectedUploadList = dropData.rejectedFiles.map(file => {
      return {
        key: uniqueId(""),
        file,
        rejected: true,
      };
    });

    const updatedUploadList = [
      ...uploadList,
      ...acceptedUploadList,
      ...rejectedUploadList,
    ];
    changeUploadList(updatedUploadList);
  }, [props, uploadList]);

  const removeUploadItem = useCallback(
    (key: string) => () =>
      changeUploadList(prevUploadList => {
        const updatedUploadList = prevUploadList.filter(
          (obj: { key: String }) => obj.key !== key
        );
        return updatedUploadList;
      }),
    []
  );

  // Props change listener
  useEffect(() => {
    if (props.dropData !== dropData) {
      setDropData(props.dropData);
      manageDropDataChange();
    }
  }, [props.dropData, dropData, manageDropDataChange]);

  const hasUploads = uploadList.length > 0;

  return (
    <div
      className={classNames(props.managedClasses.dropzoneUploadManager, [
        props.managedClasses.dropzoneUploadManager__empty,
        !hasUploads,
      ])}
    >
      {hasUploads ? (
        uploadList.map(
          (obj: {
            key: string;
            file: File;
            rejected: boolean;
            preview: string | null;
          }) => (
            <DropzoneUpload
              key={obj.key}
              file={obj.file}
              rejected={obj.rejected}
              preview={obj.preview}
              onRemoveRequest={removeUploadItem(obj.key)}
            />
          )
        )
      ) : (
        <DropzoneDrag />
      )}
    </div>
  );
};

export default manageJss(styles)(DropzoneUploadManager);
