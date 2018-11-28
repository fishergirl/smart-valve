import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Button, Form, Modal, Input, Select, InputNumber } from 'antd';
import styles from '../basic.less';
import { productCodeReg } from '../../utils/regex';

const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 16 },
  },
};
const Label = label => (
  <span>
    <span style={{ color: 'red' }}>*</span> {label}
  </span>
);

@connect(({ basic }) => {
  return {
    basic,
  };
})
@Form.create()
class Home extends Component {
  state = {
    infoVisible: false,
    addVisible: false,
    record: {},
    formValues: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'basic/getProductList'
    });
    this.props.dispatch({
      type: 'basic/getFactoryProductGroup'
    });
  }

  componentWillUnmount() {

  }

  showModal = () => {
    this.setState({
      infoVisible: true,
    });
  };

  infoModalSubmit = (fieldsValue) => {
    this.setState({
      infoVisible: false,
    });
  };

  handleInfoModal = (flag) => {
    this.setState({
      infoVisible: !!flag,
    });
  };

  openAddModal = () => {
    this.setState({
      addVisible: true,
    });
  };

  addModalSubmit = (fieldsValue) => {
    this.setState({
      addVisible: false,
    });
  };

  handleAddModal = (flag) => {
    this.setState({
      addVisible: !!flag,
    });
  };

  setRecords = (record) => {
    this.setState({
      record,
    })
  };

  render() {
    const { basic: { factoryProductGroup, productList } } = this.props;
    const expandedRowRender = (records, index, indent, expanded) => {
      const columns = [
        { title: '产品代码1', dataIndex: 'code1', key: 'code1', width: 200 },
        { title: '产品代码', dataIndex: 'code', key: 'code', width: 100 },
        { title: '产品名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '产品型号', dataIndex: 'model', key: 'model', width: 100 },
        {
          title: '操作',
          width: 150,
          dataIndex: 'action',
          key: 'action',
          render: () => (
            <span>
              <a onClick={()=>this.showModal()}><i className="iconfont icon-bianji" />修改</a>
              <Divider type="vertical"/>
              <a><i className="iconfont icon-shanchu" />删除</a>
            </span>
          ),
        },
      ];

      return (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={records.data}
          pagination={false}
          showHeader={false}
          defaultExpandAllRows
          onRow={(record) => {
            return {
              onClick: () => {this.setRecords(record)},       // 点击行
            };
          }}
        />
      );
    };
    const columns = [
      { title: '制造单位', dataIndex: 'factoryName', key: 'factoryName', width: 200 },
      { title: '产品代码', dataIndex: 'code1', key: 'code1', width: 100 },
      { title: '产品名称', dataIndex: 'name1', key: 'name1', width: 150 },
      { title: '产品型号', dataIndex: 'model1', key: 'model1', width: 100 },
      { title: '操作', key: 'action', width: 150, render: () => <Button onClick={this.openAddModal} type="primary" icon="plus" style={{backgroundColor: '#0072bc', borderColor: '#0072bc', float: 'right'}}>添加产品</Button> },
    ];

    const InfoModal = Form.create()((props) => {
      const { visible, infoModalSubmit, handleInfoModal, data, form: { getFieldDecorator, validateFields, resetFields } } = props;
      const okHandle = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;
          resetFields();
          infoModalSubmit(fieldsValue);
        });
      };
      return (
        <Modal
          title="信息"
          okText="保存"
          cancelText="关闭"
          visible={visible}
          onOk={okHandle}
          onCancel={() => handleInfoModal()}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item label={Label('产品')} {...formItemLayout}>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请选择产品' }],
              })(
                <Select placeholder="全部" allowClear>
                  {productList.map(item=>(
                    <Option key={item.id} value={item.id}>{item.model}(产品编码：{item.code})</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('许可证号')}>
              {getFieldDecorator('licenseKey', {
                initialValue: data.licenseKey,
                rules: [{ required: true, message: '请输入许可证号' }],
              })(
                <Input placeholder="请输入许可证号" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="适用温度">
              {getFieldDecorator('temperature', {
                initialValue: data.model,
              })(
                <Input placeholder="请输入适用温度" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="适用介质">
              {getFieldDecorator('medium', {
                initialValue: data.medium,
              })(
                <Input placeholder="请输入适用介质" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="公称压力">
              {getFieldDecorator('nominalPressure', {
                initialValue: data.nominalPressure,
              })(
                <Input placeholder="请输入公称压力" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="主要部件材料">
              {getFieldDecorator('material', {
                initialValue: data.material,
              })(
                <Input placeholder="请输入主要部件材料" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="设计使用年限">
              {getFieldDecorator('year', {
                initialValue: data.year,
              })(
                <InputNumber min={1} />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="制造标准">
              {getFieldDecorator('standard', {
                initialValue: data.standard,
              })(
                <Input placeholder="请输入制造标准" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="证书描述">
              {getFieldDecorator('certExplain', {
                initialValue: data.certExplain,
              })(
                <Input placeholder="请输入证书描述" autoComplete="off" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    });
    const AddModal = Form.create()((props) => {
      const { addVisible, form: { getFieldDecorator, validateFields, resetFields }, addModalSubmit, handleAddModal } = props;
      const okHandle = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;
          resetFields();
          addModalSubmit(fieldsValue);
        });
      };
      return (
        <Modal
          title="信息"
          okText="保存"
          cancelText="关闭"
          visible={addVisible}
          onOk={okHandle}
          onCancel={() => handleAddModal()}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item label={Label('产品')} {...formItemLayout}>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请选择产品' }],
              })(
                <Select placeholder="全部" allowClear>
                  {productList.map(item=>(
                    <Option key={item.id} value={item.id}>{item.model}(产品编码：{item.code})</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('许可证号')}>
              {getFieldDecorator('licenseKey', {
                rules: [{ required: true, message: '请输入许可证号' }],
              })(
                <Input placeholder="请输入许可证号" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="适用温度">
              {getFieldDecorator('temperature')(
                <Input placeholder="请输入适用温度" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="适用介质">
              {getFieldDecorator('medium')(
                <Input placeholder="请输入适用介质" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="公称压力">
              {getFieldDecorator('nominalPressure')(
                <Input placeholder="请输入公称压力" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="主要部件材料">
              {getFieldDecorator('material')(
                <Input placeholder="请输入主要部件材料" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="设计使用年限">
              {getFieldDecorator('year')(
                <InputNumber min={1} />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="制造标准">
              {getFieldDecorator('standard')(
                <Input placeholder="请输入制造标准" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="证书描述">
              {getFieldDecorator('certExplain')(
                <Input placeholder="请输入证书描述" autoComplete="off" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    });
    return (
      <Fragment>
        <Card
          bordered={false}
          className={styles.contentCard}
          title={<div><span className={styles.titleLine} />制造单位产品</div>}
        >
          <Table
            className="components-table-demo-nested"
            columns={columns}
            expandedRowRender={expandedRowRender}
            dataSource={factoryProductGroup}
            defaultExpandAllRows
            rowKey="factoryName"
          />
        </Card>
        <InfoModal
          visible={this.state.infoVisible}
          infoModalSubmit={this.infoModalSubmit}
          handleInfoModal={this.handleInfoModal}
          data={this.state.record}
        />
        <AddModal
          addVisible={this.state.addVisible}
          addModalSubmit={this.addModalSubmit}
          handleAddModal={this.handleAddModal}
        />
      </Fragment>
    );
  }
}

export default Home;
