import React, { ReactNode, useState } from 'react';
// import { MultiCascader } from 'rsuite';
import MultiCascader from 'gc-rsuite/lib/MultiCascader';
import { BlMultiCascaderProps, DataItemType } from './index.type';
import Icon, { SearchOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
require('gc-rsuite/styles/less/index.less');
import './index.less';

const suffix = (
  <SearchOutlined
    style={{
      fontSize: 16,
      // color: '#1890ff',
    }}
  />
);
export const BlMultiCascader: React.FC<BlMultiCascaderProps> = (props) => {
  const {
    data,
    value,
    defaultValue,
    onChange,
    onSearch,
    placeholder = '请选择...',
    searchPlaceholder = '请输入...',
    // noResultsText = '没查询到结果',
    // checkAllText = '全部',
    loadData,
    searchable,
  } = props;
  const [blvalue, setBlvalue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [blData, setBlData] = useState<any[]>(data);

  const handleChange = (value, event) => {
    console.log('handleChange', value);
    setBlvalue(value);
    onChange && onChange(value, event);
  };
  // 工具函数 搜索
  const getSearchRes = (inputValue, options, res) => {
    options.map((item) => {
      if (item.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
        res.push(item);
      }
    });
    return res;
  };
  // 搜索
  const handleOnSearch = async (inputValue, e) => {
    console.log('搜索', inputValue);
    if (typeof onSearch === 'function') {
      const data = await onSearch(inputValue, e);
      console.log(`data`, data);
    }
    setBlData([]);
  };
  // 渲染菜单栏
  const renderMenu = (children, menu) => {
    if (children.length === 0) {
      return <p style={{ padding: 4, textAlign: 'center' }}>加载中...</p>;
    }
    if (loading || children.length === 0) {
      return (
        <p style={{ padding: 4, textAlign: 'center' }}>
          <Icon style={{ marginRight: 4 }} type="loading" /> 加载中...
        </p>
      );
    }
    return menu;
  };
  // loadData工具函数,将请求到的选项替换之前节点
  const getNextSelectOption = (options, selectOption) => {
    return options.map((item) => {
      if (item.value == selectOption.value) {
        return (item = selectOption);
      }
      return item;
    });
  };
  // select
  const onSelect = async (item: DataItemType, selectedPaths: DataItemType[], event) => {
    const targetOption = selectedPaths[selectedPaths.length - 1];
    if (targetOption?.children) {
      if (typeof loadData === 'function') {
        const data = await loadData(item);
        targetOption.children = data;
        setBlData(getNextSelectOption(blData, targetOption));
      }
    }
  };

  return (
    <div>
      <MultiCascader
        cascade={false}
        countable={false}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        // this is rsuite 库拥有的属性
        // locale={{
        //   searchPlaceholder: 'aasdsad',
        //   noResultsText,
        //   placeholder,
        //   checkAll: checkAllText,
        // }}
        {...props}
        value={defaultValue || blvalue}
        onChange={(value, event) => handleChange(value, event)}
        renderMenu={renderMenu}
        onSelect={onSelect}
        data={blData}
        onSearch={handleOnSearch}
        onEntered={() => {
          console.log(`onEntered`);
        }}
      />
    </div>
  );
};
