import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col } from 'antd';
import styles from './Home.less';
import Map from '../../components/EchartsMap';
import EChartsHollowPie from '../../components/EChartsHollowPie';
import EchartsBar from '../../components/EchartsBar';
import EchartsBarVer from '../../components/EchartsBarVer';

@connect(({}) => {
  return {};
})
class Home extends Component {
  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const DataItem = props => {
      return (
        <div className={styles.dataItem}>
          <p>本日生产</p>
          <h2>
            880000<span>只</span>
          </h2>
        </div>
      );
    };
    const productPerOpiton = {
      color: ['#ca416e', '#cab541', '#6fdafa'],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%',
      },
      legend: {
        textStyle: {
          color: '#fff',
        },
        orient: 'vertical',
        x: 'left',
        data: [
          {
            name: '液化二甲醚瓶阀',
          },
          {
            name: '液化石油气瓶阀',
          },
          {
            name: '智能液化石油气瓶阀',
          },
        ],
      },
      series: [
        {
          name: '产品统计',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          data: [
            { value: 250, name: '液化二甲醚瓶阀' },
            { value: 180, name: '液化石油气瓶阀' },
            { value: 300, name: '智能液化石油气瓶阀' },
          ],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
      ],
    };
    const yearModelOption = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          show: true,
          textStyle: {
            color: '#8de5ff',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#8de5ff',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#8de5ff',
            width: 0.5,
            type: 'solid',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
        axisLabel: {
          show: true,
          textStyle: {
            color: '#8de5ff',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#8de5ff',
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: '2011年',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230],
          itemStyle: {
            normal: {
              color: '#8de5ff',
            },
          },
        },
      ],
    };
    const yearProductionStatOption = {
      xAxis: {
        type: 'category',
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        axisLabel: {
          show: true,
          textStyle: {
            color: '#8de5ff',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#8de5ff',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#8de5ff',
            width: 0.5,
            type: 'solid',
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#8de5ff',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#8de5ff',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#8de5ff',
            width: 0.5,
            type: 'solid',
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70],
          type: 'bar',
          barCategoryGap: '50%',
        },
        {
          name: '最高生产量',
          type: 'line',
          data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70],
          lineStyle: {
            color: '#cab541', // 折线颜色
          },
        },
      ],
    };
    const factoryProductionStatOption = {
      color: ['#ca416e', '#cab541', '#6fdafa'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: ['液化二甲醚瓶阀', '液化石油气瓶阀', '智能液化石油气瓶阀'],
        textStyle: {
          color: '#fff',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: [
            '环日集团',
            '扬州安宜',
            '民生重工',
            '杭州立琪',
            '浙江铭仕',
            '宁波浙豪',
            '宁波金佳',
            '平湖中天',
          ],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#8de5ff',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#8de5ff',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#8de5ff',
              width: 0.5,
              type: 'solid',
            },
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#8de5ff',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#8de5ff',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#8de5ff',
              width: 0.5,
              type: 'solid',
            },
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '液化二甲醚瓶阀',
          type: 'bar',
          data: [320, 332, 301, 334, 390, 330, 320, 201],
          barGap: 0,
          barCategoryGap: '30%',
        },
        {
          name: '液化石油气瓶阀',
          type: 'bar',

          data: [120, 132, 101, 134, 90, 230, 210, 106],
        },
        {
          name: '智能液化石油气瓶阀',
          type: 'bar',

          data: [220, 182, 191, 234, 290, 330, 310, 200],
        },
      ],
    };
    return (
      <Fragment>
        <Row className={styles.home}>
          <div className={styles.head}>
            <Row gutter={16}>
              <Col span={8}>
                <Row gutter={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
                  <Col span={4} offset={2}>
                    <span
                      style={{ borderRadius: '2px 16px 2px 16px' }}
                      onClick={() => this.props.dispatch(routerRedux.push('/entManage'))}
                    >
                      单位管理
                    </span>
                  </Col>
                  <Col span={4}>
                    <span
                      style={{ borderRadius: '2px 16px 2px 16px' }}
                      onClick={() => this.props.dispatch(routerRedux.push('/entAccount'))}
                    >
                      单位账号
                    </span>
                  </Col>
                  <Col span={4}>
                    <span
                      style={{ borderRadius: '2px 16px 2px 16px' }}
                      onClick={() => this.props.dispatch(routerRedux.push('/goodsSearch'))}
                    >
                      物料查询
                    </span>
                  </Col>
                  <Col span={4}>
                    <span
                      style={{ borderRadius: '2px 16px 2px 16px' }}
                      onClick={() => this.props.dispatch(routerRedux.push('/prodStat'))}
                    >
                      生产统计
                    </span>
                  </Col>
                  <Col span={4}>
                    <span
                      style={{ borderRadius: '2px 16px 2px 16px' }}
                      onClick={() => this.props.dispatch(routerRedux.push('/accountManage'))}
                    >
                      账号管理
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <div />
              </Col>
              <Col span={8}>
                <Row gutter={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
                  <Col span={4} offset={2}>
                    <span onClick={() => this.props.dispatch(routerRedux.push('/database'))}>
                      数据字典
                    </span>
                  </Col>
                  <Col span={4}>
                    <span onClick={() => this.props.dispatch(routerRedux.push('/scanStat'))}>
                      扫码统计
                    </span>
                  </Col>
                  <Col span={4}>
                    <span onClick={() => this.props.dispatch(routerRedux.push('/entProduct'))}>
                      单位产品
                    </span>
                  </Col>
                  <Col span={5}>
                    <span onClick={() => this.props.dispatch(routerRedux.push('/qrSupplies'))}>
                      二维码物料
                    </span>
                  </Col>
                  <Col span={4}>
                    <span onClick={() => this.props.dispatch(routerRedux.push('/suppliesMake'))}>
                      物料生成
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Row style={{ height: 658, padding: '20px 30px' }} gutter={16}>
            <Col
              className={`${styles.middleLeft} ${styles.border}`}
              xs={18}
              sm={18}
              md={18}
              lg={18}
              xl={18}
              xxl={17}
            >
              <div className={styles.left}>
                <DataItem />
                <DataItem />
                <DataItem />
                <div className={styles.productPer}>
                  <div className={styles.chartTitle}>
                    <h3>产品类型生产占比分布</h3>
                    <div className={styles.line} />
                  </div>
                  <EChartsHollowPie data={productPerOpiton} />
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.chartTitle}>
                  <h3>制造单位分布</h3>
                  <div className={styles.line} style={{ width: 141 }} />
                </div>
                <Map />
              </div>
            </Col>
            <Col className={styles.middleRight} xs={6} sm={6} md={6} lg={6} xl={6} xxl={7}>
              <div className={`${styles.top} ${styles.border}`}>
                {moment().format('YYYY MMMM Do dddd HH:mm:ss')}
              </div>
              <div className={`${styles.bottom} ${styles.border}`}>
                <div className={styles.chartTitle}>
                  <h3>
                    年度产品型号生产统计<span>（单位：万只）</span>
                  </h3>
                  <div className={styles.line} style={{ width: 283 }} />
                </div>
                <EchartsBar data={yearModelOption} />
              </div>
            </Col>
          </Row>
          <Row style={{ height: 293, padding: '20px 30px', paddingTop: 2 }} gutter={16}>
            <Col span={9} style={{ height: '100%' }}>
              <div className={`${styles.bottomLeft} ${styles.border}`}>
                <div className={styles.chartTitle}>
                  <h3>
                    年度生产统计<span>（单位：万只）</span>
                  </h3>
                  <div className={styles.line} style={{ width: 214 }} />
                </div>
                <EchartsBarVer data={yearProductionStatOption} />
              </div>
            </Col>
            <Col span={15} style={{ height: '100%' }}>
              <div className={`${styles.bottomRight} ${styles.border}`}>
                <div className={styles.chartTitle}>
                  <h3>
                    各厂商生产量统计<span>（单位：万只）</span>
                  </h3>
                  <div className={styles.line} style={{ width: 255 }} />
                </div>
                <EchartsBarVer data={factoryProductionStatOption} />
              </div>
            </Col>
          </Row>
        </Row>
      </Fragment>
    );
  }
}

export default Home;
