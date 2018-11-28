import React, { Component, Fragment } from 'react';
import echarts from 'echarts';
import styles from './index.less';

let verbarCharts = null;

export default class EchartsVerBar extends Component {
  componentDidMount() {
    const { data } = this.props;
    verbarCharts = echarts.init(this.dom);
    this.changeData(data);
    window.addEventListener('resize', () => {
      verbarCharts.resize();
    });
  }

  componentWillReceiveProps(nextProps) {
    verbarCharts.resize();
    if (this.props.data !== nextProps.data) {
      this.changeData(nextProps.data);
    }
  }

  changeData = (data) => {
    verbarCharts.setOption(data);
  };

  render() {
    return (
      <Fragment>
        <div className={styles.main} ref={(dom) => { this.dom = dom; }} />
      </Fragment>
    );
  }
}
