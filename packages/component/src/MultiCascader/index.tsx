import React, { ReactNode, useState } from 'react';
import { MultiCascader } from 'rsuite';
import { BlMultiCascaderProps, DataItemType } from './index.type';
import './index.less';
import Icon, { SearchOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
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
    loadData,
    searchable,
  } = props;
  const [blvalue, setBlvalue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [blData, setBlData] = useState<any[]>(data);

  const handleChange = (value, event) => {
    setBlvalue(value);
    onChange && onChange(value, event);
  };
  const handleOnSearch = async (v) => {
    const value = v.target.value;
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
    if (searchable) {
      return (
        <div>
          <div style={{ padding: 8 }}>
            <Input suffix={suffix} placeholder={searchPlaceholder} onPressEnter={handleOnSearch} />
          </div>
          <Spin spinning={loading}>{menu}</Spin>
        </div>
      );
    }
    return menu;
  };
  // 工具函数
  const handleArrayObj = (options, selectOption) => {
    return options.map((item) => {
      if (item.value == selectOption.value) {
        return (item = selectOption);
      }
      return item;
    });
  };
  const onSelect = async (item: DataItemType, selectedPaths: DataItemType[], event) => {
    const targetOption = selectedPaths[selectedPaths.length - 1];
    if (typeof loadData === 'function') {
      const data = await loadData(item);
      targetOption.children = data;
      setBlData(handleArrayObj(blData, targetOption));
    }
  };

  return (
    <div>
      <MultiCascader
        placeholder={placeholder}
        // searchPlaceholder={searchPlaceholder}
        {...props}
        value={defaultValue || blvalue}
        onChange={(value, event) => handleChange(value, event)}
        renderMenu={renderMenu}
        onSelect={onSelect}
        data={blData}
        searchable={false}
      />
    </div>
  );
};
// 异步加载
// 用户点击某个选项，onSelect函数获取用户点击的选项，选中项Id去发送请求（loading）获取子列表,子列表拼接到选中项目的chirld中
