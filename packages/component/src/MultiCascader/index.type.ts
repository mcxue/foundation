import { ReactNode } from 'react';
import { MultiCascaderProps } from 'rsuite';

export interface DataItemType {
  /** The value of the option corresponds to the `valueKey` in the data. **/
  value: string;

  /** The content displayed by the option corresponds to the `labelKey` in the data. **/
  label: ReactNode;

  /**
   * The data of the child option corresponds to the `childrenKey` in the data.
   * Properties owned by tree structure components, such as TreePicker, Casacder.
   */
  children?: DataItemType[];

  /**
   * Properties of grouping functional components, such as CheckPicker, InputPicker
   */
  groupBy?: string;

  /**
   * The children under the current node are loading.
   * Used for components that have cascading relationships and lazy loading of children. E.g. Casacder, MultiCascader
   */
  loading?: boolean;
}

export interface BlMultiCascaderProps extends MultiCascaderProps {
  /**
   * 动态加载选项
   * @default	[BL]
   */
  loadData?: (item: DataItemType) => DataItemType[];
  /**
   * 搜索框占位符
   * @default	[BL] '请输入...'
   */
  searchPlaceholder?: string;
  /**
   * 未查询到结果占位符
   * @default	[BL] '未查询到结果'
   */
  noResultsText?: string;
  /**
   * 节点全选文本
   * @default	[BL] '全部'
   */
  checkAllText?: string;
  /**
   * 节点全选文本
   * @default	[BL] '全部'
   */
  onSearch?: (searchKeyword: string, event) => DataItemType[];
}
