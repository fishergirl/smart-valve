import React, { Component, Fragment } from 'react';
import echarts from 'echarts';
import styles from './index.less';

let barCharts = null;

export default class EChartsHollowPie extends Component {
  componentDidMount() {
    const { data } = this.props;
    barCharts = echarts.init(this.dom);
    this.changeData(data);
    window.addEventListener('resize', () => {
      barCharts.resize();
    });
  }

  componentWillReceiveProps(nextProps) {
    barCharts.resize();
    if (this.props.data !== nextProps.data) {
      this.changeData(nextProps.data);
    }
  }

  changeData = (data) => {
    barCharts.setOption(data);
  };

  render() {
    return (
      <Fragment>
        <div className={styles.main} ref={(dom) => { this.dom = dom; }} />
      </Fragment>
    );
  }
}
