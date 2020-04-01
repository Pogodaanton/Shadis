import React, { useState, useEffect, useCallback } from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DropzoneUploadManagerClassNameContract,
  DropzoneUploadManagerProps,
} from "./DropzoneUploadManager.props";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import DropzoneUpload from "./DropzoneUpload";
import { uniqueId } from "lodash-es";

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
  dropzoneUploadManager_hidden: {
    display: "none",
  },
};

const DropzoneUploadManager = (props: DropzoneUploadManagerProps) => {
  const [dropData, setDropData] = useState(props.dropData);
  const [uploadList, changeUploadList] = useState([]);

  const manageDropDataChange = useCallback(() => {
    const { dropData } = props;
    if (dropData.acceptedFiles.length <= 0) {
      console.log("bingo");
    }

    console.log("manageDropDataChange");
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
    console.log(updatedUploadList);
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

  //

  // Props change listener
  useEffect(() => {
    if (props.dropData !== dropData) {
      setDropData(props.dropData);
      manageDropDataChange();
    }
  }, [props.dropData, dropData, manageDropDataChange]);

  return (
    <div className={props.managedClasses.dropzoneUploadManager}>
      {uploadList.length > 0 &&
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
        )}
    </div>
  );
  /*
  return (
    (dropData.acceptedFiles.length > 0 || dropData.rejectedFiles.length > 0) && (
      <Fragment>
        <FaExclamationTriangle className={props.managedClasses.dropzoneUploadManagerIcon} />
        <Heading tag={HeadingTag.h1} size={2}>
          {t("upload.error.title")}
        </Heading>
        <Heading tag={HeadingTag.h2} size={5}>
          {errorMessage}
        </Heading>
      </Fragment>
    )
  );*/
};

export default manageJss(styles)(DropzoneUploadManager);
