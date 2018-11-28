import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Card, Table, Row, Col, Select, Button, DatePicker } from 'antd';
import styles from '../basic.less';
import EChartsHollowPie from '../../components/EChartsHollowPie';

const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(({ basic, prodStat }) => {
  return {
    basic,
    prodStat,
  };
})
@Form.create()
class Home extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'basic/getProductList',
    });
    this.props.dispatch({
      type: 'prodStat/getProdStatList',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'prodStat/changeState',
      payload: { page: 1, rows: 10 },
    });
  }

  // 改变页码
  onPaginationChange = page => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'prodStat/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'prodStat/getProdStatList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'prodStat/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'prodStat/getProdStatList',
      payload: formValues,
    });
  };

  // 点击查询按钮
  handleSearch = e => {
    this.props.dispatch({
      type: 'prodStat/changeState',
      payload: {
        current: 1,
      },
    });
    this.search(e);
  };

  search = e => {
    if (e) e.preventDefault();
    const { dispatch, form } = this.props;
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
        type: 'prodStat/getProdStatList',
        payload: params,
      });
    });
  };

  render() {
    const {
      basic: { factoryList, productList },
      prodStat: { listData },
      form: { getFieldDecorator },
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
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '产品型号',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '已检测出厂数量',
        key: 'count',
        dataIndex: 'count',
      },
    ];
    const paginationConfig = {
      // showQuickJumper: true,
      // showSizeChanger: true,
      showTotal: () => `总共${listData.total}条记录`,
      onChange: this.onPaginationChange,
      onShowSizeChange: this.onShowSizeChange,
    };
    const productionStat = {
      color: ['#ca416e', '#cab541', '#6fdafa'],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [
          {
            name: 'YSQ-3智能液化石油气瓶阀',
          },
          {
            name: 'YSQ-3E液化石油气瓶阀',
          },
          {
            name: 'DME-J1B液化二甲醚瓶阀',
          },
        ],
      },
      series: [
        {
          name: '产品统计',
          type: 'pie',
          radius: ['50%', '70%'],
          data: [
            { value: 250, name: 'YSQ-3智能液化石油气瓶阀' },
            { value: 180, name: 'YSQ-3E液化石油气瓶阀' },
            { value: 300, name: 'DME-J1B液化二甲醚瓶阀' },
          ],
        },
      ],
    };
    return (
      <Fragment>
        <Card
          className={styles.contentCard}
          title={
            <div>
              <span className={styles.titleLine} />
              生产统计管理
            </div>
          }
        >
          <div className={styles.searchForm} style={{ marginBottom: 16 }}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={16}>
                <Col>
                  <Form.Item label="制造单位">
                    {getFieldDecorator('factoryId')(
                      <Select style={{ width: 300 }} placeholder="全部" allowClear>
                        {factoryList.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.name}({item.code})
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="产品">
                    {getFieldDecorator('code')(
                      <Select style={{ width: 300 }} placeholder="全部" allowClear>
                        {productList.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.model}(产品编码：{item.code})
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="检验时间">
                    {getFieldDecorator('creatTime')(<RangePicker style={{ width: 300 }} />)}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Row gutter={48}>
            <Col span={10}>
              <Table
                columns={columns}
                dataSource={listData.records}
                pagination={paginationConfig}
                rowKey="id"
              />
            </Col>
            <Col span={14}>
              <Card
                bordered={false}
                bodyStyle={{ width: '100%', height: 500 }}
                title="生产统计"
                className={styles.prodStatContent}
              >
                <EChartsHollowPie data={productionStat} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}

export default Home;
