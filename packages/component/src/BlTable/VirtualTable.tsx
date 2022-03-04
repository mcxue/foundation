import React, {
  useRef,
  useEffect,
  useContext,
  createContext,
  useReducer,
  useState,
  useMemo,
  Dispatch,
} from 'react';
import _, { throttle, isNumber } from 'lodash';

interface VTableState {
  renderLen: number;
  start: number;
  offsetStart: number;
  rowHeight: number;
  totalLen: number;
  vid: string;
}

interface VTableContextType {
  dispatch?: Dispatch<{ type: VTABLE_REDUCER; payload: any }>;
  vTableState: VTableState;
}

enum VTABLE_REDUCER {
  changeTrs,
  initHeight,
  changeTotalLen,
  reset,
}

// ===============reducer ============== //
const initialState = {
  // 行高度
  rowHeight: 0,
  // 当前的scrollTop
  curScrollTop: 0,
  // 总行数
  totalLen: 0,
};

function reducer(state, action) {
  const { payload } = action;

  let stateScrollTop = state.curScrollTop;
  switch (action.type) {
    // 改变trs 即 改变渲染的列表trs
    case VTABLE_REDUCER.changeTrs:
      return {
        ...state,
        curScrollTop: payload,
      };
    // 初始化每行的高度, 表格总高度, 渲染的条数
    case VTABLE_REDUCER.initHeight:
      return {
        ...state,
        rowHeight: payload,
      };
    // 更改totalLen
    case VTABLE_REDUCER.changeTotalLen:
      if (payload === 0) {
        stateScrollTop = 0;
      }

      return {
        ...state,
        totalLen: payload,
        curScrollTop: stateScrollTop,
      };

    case VTABLE_REDUCER.reset:
      return {
        ...state,
        curScrollTop: 0,
      };
    default:
      throw new Error();
  }
}

// ==============全局常量 ================== //
const DEFAULT_VID = 'vtable';
const vidMap = new Map();

// ===============context ============== //
const VTableContext = createContext<VTableContextType>({
  vTableState: {
    renderLen: 10,
    start: 0,
    offsetStart: 0,
    // =============
    rowHeight: initialState.rowHeight,
    totalLen: 0,
    vid: DEFAULT_VID,
  },
});

// =============组件 =================== //

function VRow(props: any, ref: any): JSX.Element {
  const { dispatch, vTableState } = useContext(VTableContext);

  const { rowHeight, totalLen, vid } = vTableState;

  const { children, style, ...restProps } = props;

  const trRef = useRef<HTMLTableRowElement>(null);

  const getRealRef = () => {
    return _.has(ref, 'current') ? ref : trRef;
  };

  useEffect(() => {
    const initHeight = (tempRef) => {
      if (tempRef?.current?.offsetHeight && !rowHeight && totalLen) {
        const tempRowHeight = tempRef?.current?.offsetHeight ?? 0;

        vidMap.set(vid, {
          ...vidMap.get(vid),
          rowItemHeight: tempRowHeight,
        });
        dispatch?.({
          type: VTABLE_REDUCER.initHeight,
          payload: tempRowHeight,
        });
      }
    };

    initHeight(getRealRef());
  }, [trRef, dispatch, rowHeight, totalLen, ref, vid]);

  return (
    <tr
      {...restProps}
      ref={getRealRef()}
      style={{
        ...style,
        height: rowHeight || 'auto',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </tr>
  );
}

function VWrapper(props: any): JSX.Element {
  const { children, ...restProps } = props;

  const { dispatch, vTableState } = useContext(VTableContext);
  const { renderLen, start, vid, totalLen } = vTableState;

  const contents = useMemo(() => {
    return children[1];
  }, [children]);

  const contentsLen = useMemo(() => {
    return contents?.length ?? 0;
  }, [contents]);

  useEffect(() => {
    if (totalLen !== contentsLen) {
      dispatch?.({
        type: VTABLE_REDUCER.changeTotalLen,
        payload: contentsLen ?? 0,
      });
    }
  }, [contentsLen, dispatch, vid, totalLen]);

  let tempNode: any = [];
  if (Array.isArray(contents) && contents.length) {
    tempNode = [children[0], contents.slice(start, start + (renderLen ?? 1))];
  } else {
    tempNode = children;
  }

  return <tbody {...restProps}>{tempNode}</tbody>;
}

function VTable(props: any, otherParams): JSX.Element {
  const { style = {}, children, ...rest } = props;
  const { width, ...rest_style } = style;

  const { vid, scrollY, reachEnd, onScroll, resetScrollTopWhenDataChange } = otherParams ?? {};

  const [state, dispatch] = useReducer(reducer, initialState);

  const wrap_tableRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const ifChangeRef = useRef(false);

  // 数据的总条数
  const [totalLen, setTotalLen] = useState<number>(children[1]?.props?.data?.length ?? 0);

  useEffect(() => {
    setTotalLen(state.totalLen);
  }, [state.totalLen]);

  useEffect(() => {
    return () => {
      vidMap.delete(vid);
    };
  }, [vid]);

  // 数据变更
  useEffect(() => {
    ifChangeRef.current = true;

    if (isNumber(children[1]?.props?.data?.length)) {
      dispatch?.({
        type: VTABLE_REDUCER.changeTotalLen,
        payload: children[1]?.props?.data?.length ?? 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children[1].props.data]);

  // table总高度
  const tableHeight = useMemo<string | number>(() => {
    let temp: string | number = 'auto';

    if (state.rowHeight && totalLen) {
      temp = state.rowHeight * totalLen;
    }
    return temp;
  }, [state.rowHeight, totalLen]);

  // table的scrollY值
  const [tableScrollY, setTableScrollY] = useState(0);

  // tableScrollY 随scrollY / tableHeight 进行变更
  useEffect(() => {
    let temp = 0;

    if (typeof scrollY === 'string') {
      temp = (wrap_tableRef.current?.parentNode as HTMLElement)?.offsetHeight ?? 0;
    } else {
      temp = scrollY;
    }

    // if (isNumber(tableHeight) && tableHeight < temp) {
    //   temp = tableHeight;
    // }

    // 处理tableScrollY <= 0的情况
    if (temp <= 0) {
      temp = 0;
    }

    setTableScrollY(temp);
  }, [scrollY, tableHeight]);

  // 渲染的条数
  const renderLen = useMemo<number>(() => {
    let temp = 1;
    if (state.rowHeight && totalLen && tableScrollY) {
      if (tableScrollY <= 0) {
        temp = 0;
      } else {
        const tempRenderLen = ((tableScrollY / state.rowHeight) | 0) + 1 + 2;
        // temp = tempRenderLen > totalLen ? totalLen : tempRenderLen;
        temp = tempRenderLen;
      }
    }
    return temp;
  }, [state.rowHeight, totalLen, tableScrollY]);

  // 渲染中的第一条
  let start = state.rowHeight ? (state.curScrollTop / state.rowHeight) | 0 : 0;

  // 偏移量
  let offsetStart = state.rowHeight ? state.curScrollTop % state.rowHeight : 0;

  // 用来优化向上滚动出现的空白
  if (state.curScrollTop && state.rowHeight && state.curScrollTop > state.rowHeight) {
    start -= 1;
    offsetStart += state.rowHeight;
  } else {
    start = 0;
  }

  // 数据变更 操作scrollTop
  useEffect(() => {
    const scrollNode = wrap_tableRef.current?.parentNode as HTMLElement;

    if (ifChangeRef?.current) {
      ifChangeRef.current = false;

      if (resetScrollTopWhenDataChange) {
        // 重置scrollTop
        if (scrollNode) {
          scrollNode.scrollTop = 0;
        }

        dispatch?.({ type: VTABLE_REDUCER.reset });
      }
    }

    if (vidMap.has(vid)) {
      vidMap.set(vid, {
        ...vidMap.get(vid),
        scrollNode,
      });
    }
  }, [totalLen, resetScrollTopWhenDataChange, vid, children]);

  useEffect(() => {
    const throttleScroll = throttle((e) => {
      const scrollTop: number = e?.target?.scrollTop ?? 0;
      const scrollHeight: number = e?.target?.scrollHeight ?? 0;
      const clientHeight: number = e?.target?.clientHeight ?? 0;

      onScroll && onScroll();

      //  // 有滚动条的情况到底了
      if (scrollTop + clientHeight >= scrollHeight) {
        reachEnd && reachEnd();
      }

      return scrollTop;
    }, 50);

    const ref = wrap_tableRef?.current?.parentNode as HTMLElement;

    const handleScroll = (e) => {
      const newScrollTop = throttleScroll(e) ?? state.curScrollTop;

      if (newScrollTop > state.curScrollTop && newScrollTop - state.curScrollTop > 100) {
        dispatch?.({
          type: VTABLE_REDUCER.changeTrs,
          payload: newScrollTop,
        });
      } else if (newScrollTop < state.curScrollTop && state.curScrollTop - newScrollTop > 100) {
        dispatch?.({
          type: VTABLE_REDUCER.changeTrs,
          payload: newScrollTop,
        });
      }
    };

    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }

    return () => {
      ref.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll, reachEnd, state.curScrollTop]);

  return (
    <div
      ref={wrap_tableRef}
      style={{
        width: '100%',
        position: 'relative',
        height: tableHeight,
        boxSizing: 'border-box',
        paddingTop: state.curScrollTop,
      }}
    >
      <VTableContext.Provider
        value={{
          dispatch,
          vTableState: {
            rowHeight: state.rowHeight,
            start,
            offsetStart,
            renderLen,
            totalLen,
            vid,
          },
        }}
      >
        <table
          {...rest}
          ref={tableRef}
          style={{
            ...rest_style,
            width,
            position: 'relative',
            transform: `translateY(-${offsetStart}px)`,
          }}
        >
          {children}
        </table>
      </VTableContext.Provider>
    </div>
  );
}

// ================导出===================
export function VList(props: {
  height: number | string;
  // 到底的回调函数
  onReachEnd?: () => void;
  onScroll?: () => void;
  // 唯一标识
  vid?: string;
  // 重置scrollTop 当数据变更的时候.  默认为true
  // reset scrollTop when data change
  resetTopWhenDataChange?: boolean;
}): any {
  const { vid = DEFAULT_VID, height, onReachEnd, onScroll, resetTopWhenDataChange = true } = props;

  const resetScrollTopWhenDataChange = onReachEnd ? false : resetTopWhenDataChange;

  if (!vidMap.has(vid)) {
    vidMap.set(vid, {});
  }

  return {
    table: (p) =>
      VTable(p, {
        vid,
        scrollY: height,
        reachEnd: onReachEnd,
        onScroll,
        resetScrollTopWhenDataChange,
      }),
    body: {
      wrapper: VWrapper,
      row: VRow,
    },
  };
}

export function scrollTo(option: {
  /**
   * 行数
   */
  row?: number;
  /**
   * y的偏移量
   */
  y?: number;
  /**
   * 同一页面拥有多个虚拟表格的时候的唯一标识.
   */
  vid?: string;
}) {
  const { row, y, vid = DEFAULT_VID } = option;

  const { scrollNode, rowItemHeight } = vidMap.get(vid);

  if (row) {
    if (row - 1 > 0) {
      scrollNode.scrollTop = (row - 1) * (rowItemHeight ?? 0);
    } else {
      scrollNode.scrollTop = 0;
    }
  } else {
    scrollNode.scrollTop = y ?? 0;
  }

  return { vid, rowItemHeight };
}

setInterval(() => {}, 1000);
