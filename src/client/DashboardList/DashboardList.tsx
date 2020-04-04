import React, { useRef, useState } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DashboardListClassNameContract,
  DashboardListProps,
  ListDataItem,
} from "./DashboardList.props";
import { useTranslation } from "react-i18next";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  CellRenderer,
  WindowScroller,
  AutoSizer,
} from "react-virtualized";
import { TFunction } from "i18next";
import { debounce } from "lodash-es";

const styles: ComponentStyles<DashboardListClassNameContract, DesignSystem> = {
  dashboardList: {},
  dashboardListCell: {
    "& > h4": {
      position: "absolute",
      bottom: "0px",
    },
  },
};

// Defaults for masonry cells
const columnWidth = 200;
const spacer = 10;

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
  defaultHeight: 250,
  defaultWidth: 200,
  fixedWidth: true,
});

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 3,
  columnWidth: 200,
  spacer: 10,
});

const cellRenderer = (
  listData: ListDataItem[],
  t: TFunction,
  className: string
): CellRenderer => ({ index, key, parent, style }) => {
  const { id, title, thumb_height } = listData[index];

  return (
    <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
      <div className={className} style={style}>
        <img
          src={`${window.location.origin}/uploads/${id}.thumb.jpg`}
          alt={"Thumbnail for image with title: " + t(title, title)}
          style={{
            height: thumb_height,
            width: "200px",
          }}
        />
        <h4>{t(title, title)}</h4>
      </div>
    </CellMeasurer>
  );
};

const calculateColumnCount = (width: number): number =>
  Math.floor((width + spacer) / (columnWidth + spacer));

const DashboardList: React.FC<DashboardListProps> = ({ listData, managedClasses }) => {
  const { t } = useTranslation("dashboard");
  const masonryRef = useRef(null);
  const onResizeRef = useRef(null);
  const [masonryBounds, setMasonryBounds] = useState({
    width: 0,
    left: 0,
  });

  const onResize = ({ width: pageWidth }) => {
    const columnCount = calculateColumnCount(pageWidth);

    cellPositioner.reset({
      columnCount: columnCount,
      columnWidth,
      spacer,
    });

    masonryRef.current.recomputeCellPositions();

    const width = columnCount * (columnWidth + spacer) - spacer;
    const left = Math.floor((pageWidth - width) / 2);
    setMasonryBounds({ width, left });
  };

  const debouncedOnResize = () => {
    if (onResizeRef.current === null) {
      onResizeRef.current = debounce(onResize, 100);
      return onResize;
    }
    return onResizeRef.current;
  };

  return (
    <div className={managedClasses.dashboardList}>
      {listData !== null && listData.length > 0 && (
        <WindowScroller>
          {({ height, scrollTop }) => (
            <AutoSizer disableHeight height={height} onResize={debouncedOnResize()}>
              {() => (
                <Masonry
                  ref={masonryRef}
                  cellCount={listData.length}
                  cellMeasurerCache={cache}
                  cellPositioner={cellPositioner}
                  cellRenderer={cellRenderer(
                    listData,
                    t,
                    managedClasses.dashboardListCell
                  )}
                  autoHeight={true}
                  height={height}
                  scrollTop={scrollTop}
                  width={masonryBounds.width}
                  style={{ left: masonryBounds.left }}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </div>
  );
};

export default manageJss(styles)(DashboardList);
