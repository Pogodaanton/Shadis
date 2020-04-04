import React, { useRef, useState } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DashboardListClassNameContract,
  DashboardListProps,
} from "./DashboardList.props";
import {
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  WindowScroller,
  AutoSizer,
} from "react-virtualized";
import { debounce } from "lodash-es";
import DashboardListCell from "./views/DashboardListCell";

const styles: ComponentStyles<DashboardListClassNameContract, DesignSystem> = {
  dashboardList: {
    "& .ReactVirtualized__Masonry, & .ReactVirtualized__Masonry__innerScrollContainer": {
      outline: "none",
    },
  },
};

// Defaults for masonry cells
const columnWidth = 200;
const spacer = 10;

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
  defaultHeight: 250,
  minHeight: 45,
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

const calculateColumnCount = (width: number): number =>
  Math.floor((width + spacer) / (columnWidth + spacer));

const DashboardList: React.FC<DashboardListProps> = ({ listData, managedClasses }) => {
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

  // A debounced function must not be redefined on each rerender
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
                  cellRenderer={props => (
                    <DashboardListCell
                      {...props}
                      cache={cache}
                      data={listData[props.index]}
                    />
                  )}
                  autoHeight={true}
                  height={height}
                  scrollTop={scrollTop}
                  width={masonryBounds.width}
                  overscanByPixels={100}
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
