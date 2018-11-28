import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Divider, Form, Row, Col, Select, Button, Modal, Input, message } from 'antd';
import styles from '../basic.less';
import { codeReg, phoneReg } from '../../utils/regex';
import InfoModal from './InfoModal';
import AddModal from './AddModal';

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

@connect(({ basic, entManage }) => {
  return {
    basic,
    entManage,
  };
})
@Form.create()
class Home extends Component {
  state = {
    visible: false,
    addVisible: false,
    formValues: {},
    loginName: '',
    code: '',
    name: '',
    id: '',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'basic/getFactoryList',
    });
    this.props.dispatch({
      type: 'entManage/getList',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'entManage/changeState',
      payload: { page: 1, rows: 10 },
    });
  }

  // 改变页码
  onPaginationChange = page => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'entManage/changeState',
      payload: {
        page,
      },
    });
    this.props.dispatch({
      type: 'entManage/getList',
      payload: formValues,
    });
  };

  // 改变每页记录数
  onShowSizeChange = (page, rows) => {
    const { formValues } = this.state;
    this.props.dispatch({
      type: 'entManage/changeState',
      payload: {
        page: 1,
        rows,
      },
    });
    this.props.dispatch({
      type: 'entManage/getList',
      payload: formValues,
    });
  };

  // 点击查询按钮
  handleSearch = e => {
    this.props.dispatch({
      type: 'entManage/changeState',
      payload: {
        page: 1,
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
      const params = {
        factoryId: fieldsValue.factoryId,
      };
      if (params.factoryId === undefined) delete params.factoryId;
      dispatch({
        type: 'entManage/getList',
        payload: params,
      });
    });
  };

  // 检验单位名称唯一性
  checkName = (rule, value, callback) => {
    const { dispatch } = this.props;
    if (value !== undefined && value !== '') {
      if (/\s/.test(value)) {
        callback('请勿输入空格');
        return;
      }
      dispatch({
        type: 'entManage/checkCode',
        payload: {
          name: value,
        },
      }).then(() => {
        const {
          entManage: { checkCodeMsg },
        } = this.props;
        if (checkCodeMsg && checkCodeMsg !== 'no') {
          callback('此单位已存在，请重新输入');
          return;
        }
        callback();
      });
    } else {
      callback();
    }
  };
  // 检验单位代码唯一性
  checkCode = (rule, value, callback) => {
    const { dispatch } = this.props;
    if (value !== undefined && value !== '') {
      if (/\s/.test(value)) {
        callback('请勿输入空格');
        return;
      }
      dispatch({
        type: 'entManage/checkCode',
        payload: {
          code: value,
        },
      }).then(() => {
        const {
          entManage: { checkCodeMsg },
        } = this.props;
        if (checkCodeMsg && checkCodeMsg !== 'no') {
          callback('此代码已存在，请重新输入');
          return;
        }
        callback();
      });
    } else {
      callback();
    }
  };

  showModal = record => {
    const {
      basic: { factoryList },
      dispatch,
    } = this.props;
    const item = factoryList.filter(item => item.name === record.name)[0];
    dispatch({
      type: 'entManage/getEntInfo',
      payload: { id: record.id },
    });
    dispatch({
      type: 'entManage/changeState',
      payload: { visible: true, loginName: item.loginName, code: record.code },
    });
    this.setState({
      visible: true,
      loginName: item.loginName,
      code: record.code,
      name: record.name,
      id: record.id,
    });
  };

  // 注销
  delete = id => {
    console.log(id, 111111);
    const { dispatch } = this.props;
    dispatch({
      type: 'entManage/deleteEnt',
      payload: { id: id },
    }).then(() => {
      const {
        entManage: { deleteEntMsg },
      } = this.props;
      if (parseInt(deleteEntMsg) === 0) {
        message.success('操作成功！');
        this.props.dispatch({
          type: 'entManage/getList',
        });
      }
    });
  };

  openAddModal = () => {
    this.props.dispatch({
      type: 'entManage/changeState',
      payload: { addVisible: true },
    });
  };

  render() {
    const {
      basic: { factoryList },
      entManage: { listData, page, entInfo },
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
        title: '制造单位',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '单位代码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '联系电话',
        key: 'phone',
        dataIndex: 'phone',
      },
      {
        title: '单位地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
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
            <a onClick={() => this.delete(record.id)}>
              <i className="iconfont icon-shanchu" />
              注销
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
    return (
      <Fragment>
        <Card
          bordered={false}
          className={styles.contentCard}
          title={
            <div>
              <span className={styles.titleLine} />
              制造单位管理
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
                          <Option key={item.factoryId} value={item.factoryId}>
                            {item.name}({item.code})
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item className={styles.extraHandle}>
                    <Button type="primary" icon="plus" onClick={this.openAddModal}>
                      添加制造单位
                    </Button>
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
          <Table
            columns={columns}
            dataSource={listData.records}
            pagination={paginationConfig}
            rowKey="id"
          />
        </Card>
        <InfoModal
          entInfo={entInfo}
          name={this.state.name}
          code={this.state.code}
          id={this.state.id}
        />
        <AddModal />
      </Fragment>
    );
  }
}

export default Home;
