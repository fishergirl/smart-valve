import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Row, Col, Select, Button, Icon } from 'antd';
import styles from '../basic.less';

const Option = Select.Option;

@connect(({ basic, suppliesMake }) => {
  return {
    basic,
    suppliesMake,
  };
})

@Form.create()
class Home extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'basic/getFactoryList'
    });
    this.props.dispatch({
      type: 'suppliesMake/getSuppliesMakeList'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'suppliesMake/changeState',
      payload: {page: 1, rows: 10},
    });
  }

  // 改变页码
  onPaginationChange = (page) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'suppliesMake/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'suppliesMake/getSuppliesMakeList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'suppliesMake/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'suppliesMake/getSuppliesMakeList',
      payload: formValues,
    });
  };

  // 点击查询按钮
  handleSearch = (e) => {
    this.props.dispatch({
      type: 'suppliesMake/changeState',
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
          type: 'suppliesMake/getSuppliesMakeList',
          payload: params,
        });
      }
    });
  };

  render() {
    const { basic: { factoryList }, suppliesMake: { listData }, form: { getFieldDecorator } } = this.props;
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
        title: '制造单位',
        dataIndex: 'factoryName',
        key: 'factoryName',
      },
      {
        title: '单位代码',
        dataIndex: 'factoryCode',
        key: 'factoryCode',
      },
      {
        title: '申请数量',
        key: 'amount',
        dataIndex: 'amount',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a><Icon type="download" />下载二维码物料</a>
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
    return (
      <Fragment>
        <Card
          bordered={false}
          className={styles.contentCard}
          title={<div><span className={styles.titleLine} />二维码物料生成</div>}
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
          <Table columns={columns} dataSource={listData.records} pagination={paginationConfig} rowKey="id" />
        </Card>
      </Fragment>
    );
  }
}

export default Home;
