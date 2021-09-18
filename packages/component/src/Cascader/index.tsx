import React, { useEffect, useState } from 'react';
import { Cascader as AntdCascader, Input, Spin } from 'antd';
import { BlCascaderProps } from './index.type';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      // color: '#1890ff',
    }}
  />
);
export const BlCascader = (props: BlCascaderProps) => {
  const {
    inputDisplayIsOnlyLeaf,
    getAllPathFn,
    customDivider,
    defaultValue,
    value,
    onChange,
    options,
    onSearch,
    fetchData,
    placeholder = '请输入...',
  } = props;
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
  const [s_value, setvalue] = useState<CascaderValueType | undefined>(
    getDefaultValue(defaultValue) || getDefaultValue(value),
  );
  const [s_options, setOptions] = useState<CascaderOptionType[]>(options);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CascaderOptionType>();

  const handleOnChange = (
    value: CascaderValueType,
    selectedOptions?: CascaderOptionType[] | undefined,
  ) => {
    setvalue(value);
    setSelectedOption(selectedOptions && selectedOptions[0]);
    onChange && onChange(value);
    return;
  };

  const handleFetchData = async () => {
    setLoading(true);
    try {
      if (typeof fetchData === 'function') {
        const { data } = await fetchData();
        console.log(`data`, data);
        setOptions(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(`error`, error);
    }
  };
  const handleOnSearch = async (v) => {
    const value = v.target.value;
    setLoading(true);
    if (value && selectedOption) {
      // 有搜索内容，才把选中项塞到options中
      setOptions([selectedOption]);
    }

    if (typeof onSearch === 'function') {
      const { data } = await onSearch(value);

      // selectedOption 塞到data上去
      // 如果data上有selectedOption，从其中去重
      [
        selectedOption,
        {
          value: 'hubei',
          label: '湖北',
          isLeaf: false,
        },
        {
          value: 'hunan',
          label: '湖南',
          isLeaf: false,
        },
      ];
      setOptions(data);
      setLoading(false);
      return;
    }
    throw new Error('onSearch function required!');
  };
  function dropdownRender(menus) {
    if (typeof onSearch === 'function') {
      return (
        <div>
          <div style={{ padding: 8 }}>
            <Input suffix={suffix} placeholder={placeholder} onPressEnter={handleOnSearch} />
          </div>
          <Spin spinning={loading}>{menus}</Spin>
        </div>
      );
    }
    return menus;
  }
  function notFoundContent() {
    return (
      <div>
        加载中...
        <span style={{ marginLeft: '8px' }}>
          <Spin />
        </span>
      </div>
    );
  }

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
      options={s_options}
      value={s_value}
      onChange={(value, selectedOptions) => handleOnChange(value, selectedOptions)}
      notFoundContent={loading ? notFoundContent() : '暂无数据'}
      dropdownRender={dropdownRender}
      placeholder={placeholder}
    />
  );
};
