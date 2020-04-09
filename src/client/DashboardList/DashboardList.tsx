import React, { useRef, useState, useEffect } from "react";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import {
  DashboardListClassNameContract,
  DashboardListProps,
  ListDataItem,
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
import DashboardListToolbar from "./views/DashboardListToolbar";

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
let currentColumnCount = 0;

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

/**
 * Calculates the amount of columns in a Masonry based on the given available width.
 * After a specific width, the Masonry won't become wider, as that would reduce usability.
 *
 * @param availableWidth Width to fit the Masonry columns in.
 */
const calculateMasonryColumnCount = (availableWidth: number): number => {
  if (availableWidth > 1300) availableWidth = 1300;
  return Math.floor((availableWidth + spacer) / (columnWidth + spacer));
};

const DashboardList: React.FC<DashboardListProps> = React.memo(
  ({ listData, managedClasses, onDeleteSelected }) => {
    const masonryRef = useRef(null);
    const onResizeRef = useRef(null);
    const [localListData, setLocalListData] = useState<ListDataItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [masonryBounds, setMasonryBounds] = useState({
      width: 0,
      left: 0,
      pageWidth: 0,
    });

    const onResize = ({ width: pageWidth }, forceUpdate?: boolean) => {
      const columnCount = calculateMasonryColumnCount(pageWidth);

      if (columnCount !== currentColumnCount || forceUpdate) {
        cellPositioner.reset({
          columnCount: columnCount,
          columnWidth,
          spacer,
        });

        if (masonryRef.current) masonryRef.current.recomputeCellPositions();
        currentColumnCount = columnCount;
      }

      const width = columnCount * (columnWidth + spacer) - spacer;
      const left = Math.floor((pageWidth - width) / 2);
      setMasonryBounds({ width, left, pageWidth });
    };

    // A debounced function must not be redefined on each rerender
    const debouncedOnResize = () => {
      if (onResizeRef.current === null) {
        onResizeRef.current = debounce(onResize, 80);
        return onResize;
      }
      return onResizeRef.current;
    };

    useEffect(() => {
      if (localListData !== listData) {
        setLocalListData(listData);
        cache.clearAll();
        onResize({ width: masonryBounds.pageWidth }, true);
        if (masonryRef.current) masonryRef.current.clearCellPositions();
      }
    }, [listData, localListData, masonryBounds]);

    // Selection occurs in a <DashboardListCell/>
    const selectItem = (id: string) => (selected: boolean) => {
      if (!selected) setSelectedItems(selectedItems.filter(item => item !== id));
      else setSelectedItems([...selectedItems, id]);
    };

    // We need to clear the selection list beforehand
    const onDelete = () => {
      onDeleteSelected(selectedItems);
      setSelectedItems([]);
    };

    // If one or more is selected, we enter select mode
    const inSelectMode = selectedItems.length > 0;

    return (
      <div className={managedClasses.dashboardList}>
        <DashboardListToolbar visible={inSelectMode} onDelete={onDelete} />
        {localListData !== null && localListData.length > 0 && (
          <WindowScroller>
            {({ height, scrollTop }) => (
              <AutoSizer disableHeight height={height} onResize={debouncedOnResize()}>
                {() => (
                  <Masonry
                    ref={masonryRef}
                    cellCount={localListData.length}
                    cellMeasurerCache={cache}
                    cellPositioner={cellPositioner}
                    cellRenderer={props => {
                      const data = localListData[props.index];
                      if (typeof data === "undefined") {
                        console.log(localListData);
                        console.log(props.index);
                        return null;
                      }
                      return (
                        <DashboardListCell
                          {...props}
                          cache={cache}
                          data={data}
                          onSelect={selectItem(data.id)}
                          selected={selectedItems.findIndex(i => i === data.id) > -1}
                          selectMode={inSelectMode}
                        />
                      );
                    }}
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
  }
);

export default manageJss(styles)(DashboardList);
