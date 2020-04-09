import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DashboardListCellProps,
  DashboardListCellClassNameContract,
} from "./DashboardListCell.props";
import React from "react";
import {
  neutralLayerL2,
  DesignSystem,
  backgroundColor,
  accentFillSelected,
  neutralForegroundRest,
  applyElevation,
  ElevationMultiplier,
  applyElevatedCornerRadius,
} from "@microsoft/fast-components-styles-msft";
import { useTranslation } from "react-i18next";
import {
  Label,
  Checkbox,
  CheckboxClassNameContract,
} from "@microsoft/fast-components-react-msft";
import { parseColorHexRGBA } from "@microsoft/fast-colors";
import { classNames } from "@microsoft/fast-web-utilities";
import { ViewLink } from "./ViewLink";

const styles: ComponentStyles<DashboardListCellClassNameContract, DesignSystem> = {
  dashboardListCell: {
    background: neutralLayerL2,
    overflow: "hidden",
    ...applyElevatedCornerRadius(),
    ...applyElevation(ElevationMultiplier.e4),
    cursor: "pointer",
    "&:hover $dashboardListCell_metadata": {
      transform: "translateY(0%)",
      transition: "transform .2s .1s cubic-bezier(0.1, 0.9, 0.2, 1)",
    },
    "&$dashboardListCell__checked $dashboardListCell_metadata": {
      transform: "translateY(0%)",
    },
  },
  dashboardListCell_image: {
    width: "200px",
    objectFit: "contain",
    background: neutralLayerL2,
    userDrag: "none",
    userSelect: "none",
    opacity: "0",
    transition: "opacity .1s",
  },
  dashboardListCell_metadata: {
    position: "absolute",
    bottom: "0px",
    left: "0px",
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    textAlign: "center",
    background: des => parseColorHexRGBA(backgroundColor(des) + "cc").toStringWebRGBA(),
    transform: "translateY(100%)",
    transition: "transform .2s cubic-bezier(0.9, 0.1, 1, 0.2)",
    outline: "none",
    cursor: "default",
    "& > label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      outline: "none",
    },
  },
  dashboardListCell_checkbox: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: "2",
  },
  dashboardListCell_overlay: {
    display: "none",
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: neutralForegroundRest,
    zIndex: "1",
    outline: "none",
    ...applyElevatedCornerRadius(),
    background: (des: DesignSystem) =>
      parseColorHexRGBA(accentFillSelected(des) + "aa").toStringWebRGBA(),
  },
  dashboardListCell__checked: {
    "& $dashboardListCell_overlay": {
      display: "block",
    },
  },
};

const checkboxStyle: ComponentStyles<CheckboxClassNameContract, DesignSystem> = {
  checkbox_input: {
    borderRadius: "50%",
  },
  checkbox_stateIndicator: {},
  checkbox__checked: {
    "& $checkbox_stateIndicator": {
      "&::before": {
        backgroundSize: "17px",
        backgroundPosition: "1px 2px",
      },
    },
  },
};

const onImageLoaded: React.ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
  currentTarget.style.opacity = "1";
};

const onImageError: React.ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
  currentTarget.style.display = "none";
};

/**
 * Renders a cell and sets its height in the CellMeasurementCache
 */
const CellRenderer: React.FC<DashboardListCellProps> = props => {
  const { id, title, thumb_height } = props.data;
  const { t } = useTranslation("dashboard");

  // We already know the thumbnail size, so we take over the work of <CellMeasurer />
  if (!props.cache.has(props.index, 0)) {
    props.cache.set(props.index, 0, 200, thumb_height);
    if (
      props.parent &&
      typeof props.parent.invalidateCellSizeAfterRender === "function"
    ) {
      props.parent.invalidateCellSizeAfterRender({
        columnIndex: 0,
        rowIndex: props.index,
      });
    }
  }

  const onCheckmarkChange = (
    e: React.ChangeEvent<HTMLInputElement> & React.MouseEvent
  ) => {
    if (typeof e.currentTarget.checked !== "undefined" || props.selectMode) {
      props.onSelect(!props.selected);
    }
  };

  return (
    <div
      key={props.key}
      className={classNames(props.managedClasses.dashboardListCell, [
        props.managedClasses.dashboardListCell__checked,
        props.selected,
      ])}
      onClick={onCheckmarkChange}
      style={{
        ...props.style,
        height: thumb_height,
      }}
    >
      <ViewLink to={`/${id}/`} disabled={props.selectMode}>
        <img
          className={props.managedClasses.dashboardListCell_image}
          src={`${window.location.origin}/${id}.thumb.jpg`}
          alt={t(title, title)}
          onError={onImageError}
          onLoad={onImageLoaded}
          style={{
            height: thumb_height,
          }}
        />
      </ViewLink>
      <Checkbox
        inputId={id}
        className={props.managedClasses.dashboardListCell_checkbox}
        onChange={onCheckmarkChange}
        jssStyleSheet={checkboxStyle}
        checked={props.selected}
      />
      <div className={props.managedClasses.dashboardListCell_overlay} />
      <footer className={props.managedClasses.dashboardListCell_metadata} tabIndex={0}>
        <Label tabIndex={-1}>{t(title, title)}</Label>
      </footer>
    </div>
  );
};

export default manageJss(styles)(CellRenderer);
