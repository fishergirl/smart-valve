import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Divider, Form, Button, Modal, Input, InputNumber } from 'antd';
import styles from '../basic.less';

const { TextArea } = Input;
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

@connect(({ qrSupplies }) => {
  return {
    qrSupplies,
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
      type: 'qrSupplies/getQrSuppliesList',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'qrSupplies/changeState',
      payload: { page: 1, rows: 10 },
    });
  }

  // 改变页码
  onPaginationChange = page => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'qrSupplies/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'qrSupplies/getQrSuppliesList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'qrSupplies/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'qrSupplies/getQrSuppliesList',
      payload: formValues,
    });
  };

  showModal = record => {
    this.setState({
      infoVisible: true,
      record,
    });
  };

  infoModalSubmit = fieldsValue => {
    this.setState({
      infoVisible: false,
    });
  };

  handleInfoModal = flag => {
    this.setState({
      infoVisible: !!flag,
    });
  };

  openAddModal = () => {
    this.setState({
      addVisible: true,
    });
  };

  addModalSubmit = fieldsValue => {
    console.log(fieldsValue, 111);
    this.setState({
      addVisible: false,
    });
  };

  handleAddModal = flag => {
    this.setState({
      addVisible: !!flag,
    });
  };

  render() {
    const {
      qrSupplies: { listData, page },
    } = this.props;
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
        title: '申请数量',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.showModal(record)}>
              <i className="iconfont icon-bianji" />
              修改
            </a>
            <Divider type="vertical" />
            <a>
              <i className="iconfont icon-shanchu" />
              删除
            </a>
          </span>
        ),
      },
    ];
    const paginationConfig = {
      current: page,
      total: listData.total,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: () => `总共${listData.total}条记录`,
      onChange: this.onPaginationChange,
      onShowSizeChange: this.onShowSizeChange,
    };
    const InfoModal = Form.create()(props => {
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
          footer={null}
          visible={visible}
          onOk={okHandle}
          onCancel={() => handleInfoModal()}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item {...formItemLayout} label={Label('生成数量')}>
              {form.getFieldDecorator('amount', {
                initialValue: data.amount,
                rules: [{ required: true, message: '请输入生成数量' }],
              })(<span>{data.amount}</span>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('备注')}>
              {form.getFieldDecorator('remark')(<span>{data.remark ? data.remark : '暂无'}</span>)}
            </Form.Item>
          </Form>
        </Modal>
      );
    });
    const AddModal = Form.create()(props => {
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
            <Form.Item {...formItemLayout} label={Label('申请数量')}>
              {form.getFieldDecorator('amount', {
                rules: [{ required: true, message: '请输入申请数量' }],
              })(<InputNumber min={1} decimalSeparator="0" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="备注">
              {form.getFieldDecorator('remark')(<TextArea rows={4} placeholder="请输入备注事项" />)}
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
          title={
            <div>
              <span className={styles.titleLine} />
              我的二维码
            </div>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <div
              className={styles.extraHandle}
              style={{ marginBottom: 16 }}
              onClick={this.openAddModal}
            >
              <Button type="primary" icon="plus">
                申请物料
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={listData.records}
            pagination={paginationConfig}
            rowKey="id"
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
