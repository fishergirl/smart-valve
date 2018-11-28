import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Form, Button, Modal, Input } from 'antd';
import styles from '../basic.less';
import { productCodeReg } from '../../utils/regex';

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

@connect(({ dataBase }) => {
  return {
    dataBase,
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
      type: 'dataBase/getDataBaseList'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'dataBase/changeState',
      payload: {page: 1, rows: 10},
    });
  }

  // 改变页码
  onPaginationChange = (page) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'dataBase/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'dataBase/getDataBaseList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'dataBase/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'dataBase/getDataBaseList',
      payload: formValues,
    });
  };

  showModal = (record) => {
    this.setState({
      infoVisible: true,
      record,
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

  render() {
    const { dataBase: { listData } } = this.props;
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'order',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '产品代码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '产品型号',
        key: 'model',
        dataIndex: 'model',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={()=>this.showModal(record)}><i className="iconfont icon-bianji" />修改</a>
            <Divider type="vertical"/>
            <a><i className="iconfont icon-shanchu" />删除</a>
          </span>
        ),
      },
    ];
    const paginationConfig = {
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: () => `总共${listData.total}条记录`,
      onChange: this.onPaginationChange,
      onShowSizeChange: this.onShowSizeChange,
    };
    const InfoModal = Form.create()((props) => {
      const { visible, form, infoModalSubmit, handleInfoModal, data } = props;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
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
            <Form.Item {...formItemLayout} label={Label('产品代码')}>
              {form.getFieldDecorator('code', {
                initialValue: data.code,
                rules: [{ required: true, message: '请输入产品代码' }],
              })(
                <Input placeholder="请输入产品代码" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('产品名称')}>
              {form.getFieldDecorator('name', {
                initialValue: data.name,
                rules: [{ required: true, message: '请输入产品名称' }],
              })(
                <Input placeholder="请输入产品名称" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('产品型号')}>
              {form.getFieldDecorator('model', {
                initialValue: data.model,
                rules: [{ required: true, message: '请输入产品型号' }],
              })(
                <Input placeholder="请输入产品型号" autoComplete="off" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    });
    const AddModal = Form.create()((props) => {
      const { addVisible, form, addModalSubmit, handleAddModal } = props;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
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
            <Form.Item {...formItemLayout} label={Label('产品代码')}>
              {form.getFieldDecorator('code', {
                rules: [{ pattern: productCodeReg, message: '格式不正确' }, { required: true, message: '请输入产品代码' }],
              })(
                <Input placeholder="请输入产品代码(1-2位数字或字母)" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('产品名称')}>
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入产品名称' }],
              })(
                <Input placeholder="请输入产品名称" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('产品型号')}>
              {form.getFieldDecorator('model', {
                rules: [{ required: true, message: '请输入产品型号' }],
              })(
                <Input placeholder="请输入产品型号" autoComplete="off" />
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
          title={<div><span className={styles.titleLine} />产品数据字典</div>}
        >
          <div style={{ marginBottom: 16 }}>
            <div className={styles.extraHandle} style={{ marginBottom: 16 }}>
              <Button type="primary" icon="plus" onClick={this.openAddModal}>添加产品数据字典</Button>
            </div>
          </div>
          <Table columns={columns} dataSource={listData.records} pagination={paginationConfig} rowKey="id" />
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
