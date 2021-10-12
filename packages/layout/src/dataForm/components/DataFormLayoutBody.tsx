import React, { ReactNode, useCallback, useState } from 'react';
import { Row, Col, Space, Form, FormInstance } from 'antd';
import useResizeObserver from '@react-hook/resize-observer';
import { BlIcon } from '@blacklake-web/component';
import { useVisible } from '@blacklake-web/hooks';
import { DataFormLayoutInfoBlock } from '../DataFormLayout.type';
import '../../detail/components/DetailLayoutContent.less';
export interface DataFormLayoutBodyProps {
  /**顶部拓展内容 */
  topContext?: ReactNode;
  /**左侧拓展内容 */
  leftContext?: ReactNode;
  /**右侧拓展内容 */
  rightContext?: ReactNode;
  /**下部拓展内容 */
  bottomContext?: ReactNode;
  /**中间formItem部分 */
  info?: DataFormLayoutInfoBlock[];
  /**antd form实例 */
  form: FormInstance;
  bodyStyle?: {};
  infoBlockStyleProps?: {};
  /**
   * FormItem 布局类型水平或上下
   * @default horizontal
   */
  formLayout?: 'horizontal' | 'vertical';
}

const infoBlockStyle = {
  marginTop: 24,
};

const DataFormLayoutBody = (props: DataFormLayoutBodyProps) => {
  const {
    info,
    form,
    formLayout = 'vertical',
    topContext,
    leftContext,
    rightContext,
    bottomContext,
    infoBlockStyleProps,
    bodyStyle,
  } = props;
  const contentRef = React.useRef(null);
  const { judgeVisible, addVisible, deleteVisible } = useVisible();
  // const dataCount = info
  //   ?.map((i) => i.items?.length || 0)
  //   .reduce((previousValue, currentValue) => previousValue + currentValue);

  const getColumn = (windowSize) => {
    if (windowSize < 1280) {
      return 1;
    }
    if (windowSize >= 1280 && windowSize <= 1440) {
      return 2;
    }
    if (windowSize >= 1440) {
      return 3;
    }
    return 1;
  };

  const useSize = (target) => {
    const [rowWidth, setRowWidth] = React.useState(0);

    React.useLayoutEffect(() => {
      setRowWidth(target.current.getBoundingClientRect().width);
    }, [target]);

    useResizeObserver(target, (entry) => setRowWidth(entry.contentRect.width));
    return rowWidth;
  };

  const baseSpan = (1 / getColumn(useSize(contentRef))) * 100;
  const isSingleColumn = getColumn(useSize(contentRef)) === 1;

  const renderInfoBlock = (infoBlock: DataFormLayoutInfoBlock, infoIndex) => {
    const renderTitle = (infoBlock: DataFormLayoutInfoBlock) => {
      const { title } = infoBlock;

      return title ? (
        <div style={{ paddingRight: 20 }} key={`info_${infoIndex}`}>
          <Row justify={'space-between'} className="bl-descriptionTitle">
            <Col>
              <span className="title-left">{title}</span>
            </Col>
            <Col>
              <div
                className={'bl-toggleButon'}
                onClick={() =>
                  judgeVisible(infoIndex) ? deleteVisible(infoIndex) : addVisible(infoIndex)
                }
              >
                <BlIcon type={judgeVisible(infoIndex) ? 'iconshouqi' : 'iconzhankai'} />
              </div>
            </Col>
          </Row>
        </div>
      ) : null;
    };

    const renderItem = (infoBlock: DataFormLayoutInfoBlock) => {
      const { items = [], column, align = 'left' } = infoBlock;
      return (
        <Row style={{ paddingTop: 24 }}>
          {items.map((item, itemIndex) => {
            const { span, render, style, ...formItemProps } = item;
            const colSpan = item.isFullLine || item.isFullLine ? 100 : baseSpan;
            return (
              <Form.Item
                key={`formItem_${itemIndex}`}
                className={item.isFullLine ? 'bl-form-item' : 'bl-form-item-single'}
                {...formItemProps}
                style={{
                  padding: '0 12px',
                  flex: `0 0 ${colSpan}%`,
                  maxWidth: `${colSpan}%`,
                  display: 'flex',
                  justifyContent: align,
                  ...style,
                }}
              >
                {render()}
              </Form.Item>
            );
          })}
        </Row>
      );
    };

    return (
      <div
        key={`${infoBlock.title}_${infoBlock.items?.length}`}
        style={{ ...infoBlockStyle, ...infoBlockStyleProps }}
      >
        {renderTitle(infoBlock)}
        {!judgeVisible(infoIndex) && renderItem(infoBlock)}
      </div>
    );
  };

  const renderTopContext = () => {
    if (!topContext) return null;

    return <div>{topContext}</div>;
  };

  const renderBottomContext = () => {
    if (!bottomContext) return null;

    return <div>{bottomContext}</div>;
  };

  const renderLeftContext = () => {
    if (!leftContext) return null;

    return <div>{leftContext}</div>;
  };

  const renderRightContext = () => {
    if (!rightContext) return null;

    return <div>{rightContext}</div>;
  };

  return (
    <div
      style={{
        height: '100%',
        padding: '0px 20px',
        overflowY: 'auto',
        marginBottom: 50,
        ...bodyStyle,
      }}
      ref={contentRef}
    >
      {renderTopContext()}
      <Row wrap={false}>
        {renderLeftContext()}
        <Form
          form={form}
          name="dataFormInfo"
          preserve={false}
          style={{ width: '100%', marginBottom: 24 }}
          labelCol={isSingleColumn ? { flex: '120px' } : {}}
          layout={isSingleColumn ? 'horizontal' : formLayout}
        >
          {info?.map((infoBlock: DataFormLayoutInfoBlock, infoIndex) =>
            renderInfoBlock(infoBlock, infoIndex),
          )}
        </Form>
        {renderRightContext()}
      </Row>
      {renderBottomContext()}
    </div>
  );
};

export default DataFormLayoutBody;
