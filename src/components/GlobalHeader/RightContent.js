import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const currentUserName = localStorage.getItem('currentUserName');
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/*<Menu.Item key="userCenter">*/}
        {/*<Icon type="user" />*/}
        {/*<FormattedMessage id="menu.account.center" defaultMessage="account center" />*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item key="userinfo">*/}
        {/*<Icon type="setting" />*/}
        {/*<FormattedMessage id="menu.account.settings" defaultMessage="account settings" />*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item key="triggerError">*/}
        {/*<Icon type="close-circle" />*/}
        {/*<FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Divider />*/}
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="退出登录" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.name ? (
          <Fragment>
            <span className={`${styles.action} ${styles.account}`}>
              {/*<Avatar*/}
              {/*size="small"*/}
              {/*className={styles.avatar}*/}
              {/*src={currentUser.avatar}*/}
              {/*alt="avatar"*/}
              {/*/>*/}
              <span className={styles.name}>{currentUserName}</span>
              <Icon type="caret-down" />
            </span>
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Icon type="logout" />
              </span>
            </Dropdown>
          </Fragment>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
