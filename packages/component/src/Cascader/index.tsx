import React, { useState } from 'react';
import { Cascader as AntdCascader } from 'antd';
import { BlCascaderProps } from './index.type';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';

export const BlCascader = (props: BlCascaderProps) => {
  const { inputDisplayIsOnlyLeaf, getAllPathFn, customDivider, defaultValue, value, onChange } =
    props;
  // 处理默认值
  const getDefaultValue = (value: CascaderValueType | undefined) => {
    if (value === undefined || value?.length === 0) {
      return;
    }
    if (inputDisplayIsOnlyLeaf && typeof getAllPathFn === 'function') {
      // 获取该叶子节点的全路径
      return getAllPathFn(value as CascaderValueType);
    }
    return value;
  };
  const [vvalue, setvalue] = useState<CascaderValueType | undefined>(
    getDefaultValue(defaultValue) || getDefaultValue(value),
  );

  const handleOnChange = (
    value: CascaderValueType,
    selectedOptions?: CascaderOptionType[] | undefined,
  ) => {
    setvalue(value);
    onChange && onChange(value);
    return;
  };

  return (
    <AntdCascader
      displayRender={(label, selectedOptions) => {
        if (inputDisplayIsOnlyLeaf) {
          const length = label.length;
          return label[length - 1];
        }
        if (customDivider) {
          return label.join(customDivider);
        }
        return label.join(' / ');
      }}
      {...props}
      value={vvalue}
      onChange={(value, selectedOptions) => handleOnChange(value, selectedOptions)}
    />
  );
};
