import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Row, Col, Select, Button, Modal, Input } from 'antd';
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

@connect(({ basic, entAccount }) => {
  return {
    basic,
    entAccount,
  };
})

@Form.create()
class Home extends Component {
  state = {
    visible: false,
    formValues: {},
    record: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'basic/getFactoryList'
    });
    this.props.dispatch({
      type: 'entAccount/getEntAccountList'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'entAccount/changeState',
      payload: {page: 1, rows: 10},
    });
  }

  // 改变页码
  onPaginationChange = (page) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'entAccount/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'entAccount/getEntAccountList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'entAccount/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'entAccount/getEntAccountList',
      payload: formValues,
    });
  };

  // 点击查询按钮
  handleSearch = (e) => {
    this.props.dispatch({
      type: 'entAccount/changeState',
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
          type: 'entAccount/getEntAccountList',
          payload: params,
        });
      }
    });
  };

  showModal = (record) => {
    this.setState({
      visible: true,
      record,
    });
  };

  modalSubmit = (fieldsValue) => {
    this.setState({
      visible: false,
    });
  };

  handleModal = (flag) => {
    this.setState({
      visible: !!flag,
    });
  };

  render() {
    const { basic: { factoryList }, entAccount: { listData }, form: { getFieldDecorator } } = this.props;
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
        title: '单位代码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '制造单位',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '账号',
        key: 'loginName',
        dataIndex: 'loginName',
      },
      {
        title: '密码',
        dataIndex: 'plainPwd',
        key: 'plainPwd',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={()=>this.showModal(record)}><i className="iconfont icon-bianji" />修改密码</a>
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
      const { visible, form, modalSubmit, handleModal, data } = props;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          modalSubmit(fieldsValue);
        });
      };
      return (
        <Modal
          title="信息"
          okText="保存"
          cancelText="关闭"
          visible={visible}
          onOk={okHandle}
          onCancel={() => handleModal()}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item {...formItemLayout} label="单位代码">
              <span>{data.code}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="制造单位">
              <span>{data.name}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="账号">
              <span>{data.loginName}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('密码')}>
              {form.getFieldDecorator('plainPwd', {
                initialValue: data.plainPwd,
                rules: [{ required: true, message: '请输入角色名称' }],
              })(
                <Input placeholder="请输入密码" autoComplete="off" />
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
          title={<div><span className={styles.titleLine} />制造单位管理</div>}
        >
          <div className={styles.searchForm} style={{ marginBottom: 16 }}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={16}>
                <Col>
                  <Form.Item label="制造单位">
                    {getFieldDecorator('factoryId')(
                      <Select style={{ width: 300 }} placeholder="全部" allowClear>
                        {factoryList.map(item=>(
                          <Option key={item.id} value={item.id}>{item.name}({item.code})</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Table columns={columns} dataSource={listData.records} pagination={paginationConfig} rowKey="factoryId" />
        </Card>
        <InfoModal
          visible={this.state.visible}
          modalSubmit={this.modalSubmit}
          handleModal={this.handleModal}
          data={this.state.record}
        />
      </Fragment>
    );
  }
}

export default Home;
