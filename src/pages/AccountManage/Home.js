import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Divider, Form, Radio, Select, Button, Modal, Input } from 'antd';
import styles from '../basic.less';

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

@connect(({ accountManage }) => {
  return {
    accountManage,
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
      type: 'accountManage/getAccountList'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'accountManage/changeState',
      payload: {page: 1, rows: 10},
    });
  }

  // 改变页码
  onPaginationChange = (page) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'accountManage/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'accountManage/getAccountList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'accountManage/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'accountManage/getAccountList',
      payload: formValues,
    });
  };

  // 点击查询按钮
  handleSearch = (e) => {
    this.props.dispatch({
      type: 'accountManage/changeState',
      payload: {
        current: 1,
      },
    });
    this.search(e);
  };

  search = (e) => {
    if (e) e.preventDefault();
    const {dispatch, form} = this.props;
    // 处理参数
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.setState({
          formValues: fieldsValue,
        });
        const params = fieldsValue;
        if (fieldsValue.factoryId !== undefined) {
          params._search = true;
        }
        dispatch({
          type: 'accountManage/getAccountList',
          payload: params,
        });
      }
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
    const { accountManage: { listData } } = this.props;
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
        title: '账号',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '密码',
        dataIndex: 'plainPwd',
        key: 'plainPwd',
      },
      {
        title: '角色',
        key: 'roleId',
        dataIndex: 'roleList[0].name',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={()=>this.showModal(record)}><i className="iconfont icon-bianji" />修改</a>
            <Divider type="vertical"/>
            <a><i className="iconfont icon-shanchu" />注销</a>
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
            <Form.Item {...formItemLayout} label={Label('账号')}>
              {form.getFieldDecorator('loginName', {
                initialValue: data.loginName,
                rules: [{ required: true, message: '请输入账号' }],
              })(
                <Input placeholder="请输入账号" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('密码')}>
              {form.getFieldDecorator('plainPwd', {
                initialValue: data.plainPwd,
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input placeholder="请输入密码" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('角色')}>
              {form.getFieldDecorator('roleId', {
                initialValue: data.roleList ? parseInt(data.roleList[0].id) : null,
              })(
                <Radio.Group>
                  <Radio value={2}>监管部门</Radio>
                  <Radio value={4}>二维码生产单位</Radio>
                </Radio.Group>
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
            <Form.Item {...formItemLayout} label={Label('账号')}>
              {form.getFieldDecorator('loginName', {
                rules: [{ required: true, message: '请输入账号' }],
              })(
                <Input placeholder="请输入账号" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('密码')}>
              {form.getFieldDecorator('plainPwd', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input placeholder="请输入密码" autoComplete="off" />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('角色')}>
              {form.getFieldDecorator('roleId', {
              })(
                <Radio.Group>
                  <Radio value={2}>监管部门</Radio>
                  <Radio value={4}>二维码生产单位</Radio>
                </Radio.Group>
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
          title={<div><span className={styles.titleLine} />账号管理</div>}
        >
          <div style={{ marginBottom: 16 }}>
            <div className={styles.extraHandle} style={{ marginBottom: 16 }}>
              <Button type="primary" icon="plus" onClick={this.openAddModal}>添加账号</Button>
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
