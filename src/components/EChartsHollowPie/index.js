import React, { Component, Fragment } from 'react';
import echarts from 'echarts';
import styles from './index.less';

let hollowPieCharts = null;

export default class EChartsHollowPie extends Component {
  componentDidMount() {
    const { data } = this.props;
    hollowPieCharts = echarts.init(this.dom);
    this.changeData(data);
    window.addEventListener('resize', () => {
      hollowPieCharts.resize();
    });
  }

  componentWillReceiveProps(nextProps) {
    hollowPieCharts.resize();
    if (this.props.data !== nextProps.data) {
      this.changeData(nextProps.data);
    }
  }

  changeData = data => {
    hollowPieCharts.setOption(data);
  };

  render() {
    return (
      <Fragment>
        <div
          className={styles.main}
          ref={dom => {
            this.dom = dom;
          }}
        />
      </Fragment>
    );
  }
}
