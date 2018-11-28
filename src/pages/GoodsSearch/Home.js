import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Table, Row, Col, Select, Button, Modal, DatePicker } from 'antd';
import styles from '../basic.less';

const Option = Select.Option;
const { RangePicker } = DatePicker;
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

@connect(({ basic, goodsSearch }) => {
  return {
    basic,
    goodsSearch,
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
      type: 'goodsSearch/getGoodsSearchList'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'goodsSearch/changeState',
      payload: {page: 1, rows: 10},
    });
  }

  // 改变页码
  onPaginationChange = (page) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'goodsSearch/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'goodsSearch/getGoodsSearchList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'goodsSearch/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'goodsSearch/getGoodsSearchList',
      payload: formValues,
    });
  };

  // 点击查询按钮
  handleSearch = (e) => {
    this.props.dispatch({
      type: 'goodsSearch/changeState',
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
      if (err) return;
      let { startTime, endTime } = [];
      if (fieldsValue.creatTime && fieldsValue.creatTime.length !== 0) {
        startTime = fieldsValue.creatTime[0].format('YYYY-MM-DD');
        endTime = fieldsValue.creatTime[1].format('YYYY-MM-DD');
      }
      const values = fieldsValue;
      delete values.creatTime;
      const params = {
        ...values,
        startTime,
        endTime,
      };
      this.setState({
        formValues: params,
      });
      if (fieldsValue.factoryId !== undefined) {
        params._search = true;
      }
      dispatch({
        type: 'goodsSearch/getGoodsSearchList',
        payload: params,
      });
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
    const { basic: { factoryList }, goodsSearch: { listData }, form: { getFieldDecorator } } = this.props;
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
        dataIndex: 'factoryCode',
        key: 'factoryCode',
      },
      {
        title: '制造单位',
        dataIndex: 'factoryName',
        key: 'factoryName',
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '生成数量',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={()=>this.showModal(record)}><i className="iconfont icon-bianji" />详情</a>
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
              <span>{data.factoryCode}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="制造单位">
              <span>{data.factoryName}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="生成数量">
              <span>{data.amount}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="备注">
              <span>{data.remark ? data.remark : '暂无'}</span>
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
                  <Form.Item label="创建时间">
                    {getFieldDecorator('creatTime')(
                      <RangePicker style={{ width: 300 }} />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">查询</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Table columns={columns} dataSource={listData.records} pagination={paginationConfig} rowKey="id" />
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
