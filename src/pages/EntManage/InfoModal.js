import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, message } from 'antd';
import { codeReg, phoneReg } from '../../utils/regex';

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

@connect(({ entManage }) => {
  return {
    entManage,
  };
})
@Form.create()
export default class InfoModal extends Component {
  okHandle = () => {
    const {
      dispatch,
      form,
      entManage: { loginName },
      entInfo,
      id,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err || entInfo === fieldsValue) return;
      dispatch({
        type: 'entManage/saveEntInfo',
        payload: {
          ...fieldsValue,
          loginName,
          id,
        },
      }).then(() => {
        const {
          entManage: { saveEntInfoMsg },
        } = this.props;
        if (parseInt(saveEntInfoMsg) === 0) {
          message.success('操作成功！');
          this.props.dispatch({
            type: 'entManage/getList',
          });
        }
      });
      form.resetFields();
      dispatch({
        type: 'entManage/changeState',
        payload: { visible: false, entInfo: {}, loginName: '', code: '' },
      });
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'entManage/changeState',
      payload: { visible: false, entInfo: {}, loginName: '', code: '' },
    });
  };

  // 检验单位名称唯一性
  checkName = (rule, value, callback) => {
    const { dispatch, name } = this.props;
    if (value !== undefined && value !== '') {
      if (/\s/.test(value)) {
        callback('请勿输入空格');
        return;
      }
      if (value !== name) {
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
            callback('该单位已存在，请重新输入');
            return;
          }
          callback();
        });
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  checkCode = (rule, value, callback) => {
    const { dispatch, code } = this.props;
    if (value !== undefined && value !== '') {
      if (/\s/.test(value)) {
        callback('请勿输入空格');
        return;
      }
      if (value !== code) {
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
            callback('该单位代码已存在，请重新输入');
            return;
          }
          callback();
        });
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  render() {
    const {
      entInfo,
      form: { getFieldDecorator },
      entManage: { visible },
    } = this.props;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="信息"
          okText="保存"
          cancelText="关闭"
          visible={visible}
          onOk={this.okHandle}
          onCancel={() => this.handleCancel()}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item {...formItemLayout} label={Label('制造单位')}>
              {getFieldDecorator('name', {
                initialValue: entInfo.name,
                rules: [
                  { validator: this.checkName },
                  { required: true, message: '请输入单位名称' },
                ],
                validateTrigger: 'onBlur',
              })(<Input autoComplete="off" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label={Label('单位代码')}>
              {getFieldDecorator('code', {
                initialValue: entInfo.code,
                rules: [
                  { validator: this.checkCode },
                  { pattern: codeReg, message: '格式不正确' },
                  { required: true, message: '请输入单位代码' },
                ],
                validateTrigger: 'onBlur',
              })(<Input autoComplete="off" placeholder="请输入单位代码(两位英文字母)" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="联系电话">
              {getFieldDecorator('phone', {
                initialValue: entInfo.phone,
                rules: [
                  { pattern: phoneReg, message: '格式不正确' },
                  { required: true, message: '请输入联系电话' },
                ],
              })(<Input autoComplete="off" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="单位地址">
              {getFieldDecorator('address', {
                initialValue: entInfo.address,
                rules: [{ required: true, message: '请输入单位地址' }],
              })(<Input autoComplete="off" />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
