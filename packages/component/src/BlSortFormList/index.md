---
title: 表单表格 - BlSortFormList
nav:
  title: 组件
  path: /component
  order: 1
group:
  title: BlPro
  path: /BlPro
---

```tsx
/**
 * title: 可自增的formList
 * desc: 表单收集大量列表数据使用
 */

import React from 'react';
import _ from 'lodash';
import { Form, Input, InputNumber, Select, Button, Tabs } from 'antd';
import { BlSortFormList, validateSortFormList } from '@blacklake-web/component';

export default () => {
  const [form] = Form.useForm();
  const rowTotal = 100;
  const colTotal = 5;

  const fields = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '数量',
      dataIndex: 'number',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
  ];

  let initialValue = [];
  for (let i = 1; i <= rowTotal; i++) {
    const res = {};

    for (let j = 1; j <= colTotal; j++) {
      fields.forEach(({ title, dataIndex }) => {
        res[`${title}_${j}`] = `${title}_${j}_${i}`;
      });
    }
    initialValue.push(res);
  }

  setTimeout(() => {
    form.setFieldsValue({ filedName: initialValue });
  }, 1000);

  return (
    <>
      <Tabs>
        <Tabs.TabPane key={2} tab="2" forceRender>
          <BlSortFormList
            name="filedName"
            form={form}
            useVirtual
            renderColumns={() => {
              const res = [];

              for (let i = 1; i <= colTotal; i++) {
                fields.forEach(({ title, dataIndex }) => {
                  res.push({
                    title: `${title}_${i}`,
                    dataIndex: `${dataIndex}_${i}`,
                    width: 150,
                    render: (text, field, index) => {
                      if (title === '编号') {
                        return (
                          <span>
                            {title}_{i}_{index}
                          </span>
                        );
                      }
                      return (
                        <Form.Item
                          name={[field.name, `${title}_${i}`]}
                          fieldKey={[field.fieldKey, `${title}_${i}`]}
                          style={{ marginBottom: '0' }}
                          rules={[{ required: true, message: '不能为空' }]}
                          initialValue={1}
                        >
                          <Input />
                        </Form.Item>
                      );
                    },
                  });
                });
              }

              return res;
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key={1} tab="1" forceRender>
          占位
        </Tabs.TabPane>
      </Tabs>
      <Button
        onClick={() => {
          validateSortFormList(form, 'filedName').then(() => {
            console.log(form.getFieldsValue());
          });
        }}
      >
        提交
      </Button>
    </>
  );
};
```

<API />
