import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import styles from '../basic.less';
import EChartsHollowPie from '../../components/EChartsHollowPie';
import EchartsBarVer from '../../components/EchartsBarVer';

@connect(({}) => {
  return {};
})
class Home extends Component {
  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const areaStatOpiton = {
      color: ['#3BA0FF', '#36CBCB', '#4DCB73', '#FAD337', '#F2637B', ''],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [
          {
            name: '北京',
          },
          {
            name: '上海',
          },
          {
            name: '广州',
          },
          {
            name: '西安',
          },
          {
            name: '武汉',
          },
        ],
        icon: 'circle',
        // formatter: (name) => {
        //   let total = 0;
        //   let target;
        //   for (let i = 0, l = legendDatas.length; i < l; i++) {
        //     total += legendDatas[i].value;
        //     if (legendDatas[i].name === name) {
        //       target = legendDatas[i].value;
        //     }
        //   }
        //   return name + ' | ' + target + '瓶';
        // },
        textStyle: {
          fontSize: 14,
          padding: [8, 0],
        },
      },
      series: [
        {
          name: '产品统计',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            align: 'left',
            normal: {
              formatter(v) {
                let text = Math.round(v.percent) + '%' + '' + v.name;
                if (text.length <= 8) {
                  return text;
                } else if (text.length > 8 && text.length <= 16) {
                  return (text = `${text.slice(0, 8)}\n${text.slice(8)}`);
                } else if (text.length > 16 && text.length <= 24) {
                  return (text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16)}`);
                } else if (text.length > 24 && text.length <= 30) {
                  return (text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(
                    16,
                    24
                  )}\n${text.slice(24)}`);
                } else if (text.length > 30) {
                  return (text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(
                    16,
                    24
                  )}\n${text.slice(24, 30)}\n${text.slice(30)}`);
                }
              },
              textStyle: {
                // fontSize : 8
              },
            },
          },
          data: [
            { value: 250, name: '北京' },
            { value: 180, name: '上海' },
            { value: 300, name: '广州' },
            { value: 202, name: '西安' },
            { value: 160, name: '武汉' },
          ],
        },
      ],
    };
    const yearProductionStat = {
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
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70],
          type: 'bar',
          barCategoryGap: '50%',
          markPoint: {
            symbol: 'pin', // 标记类型
            symbolSize: 40, // 图形大小
            itemStyle: {
              normal: {
                label: {
                  show: true,
                },
              },
            },
            data: [
              // 配置项
              { value: 120, xAxis: 0, yAxis: 120 },
              { value: 200, xAxis: 1, yAxis: 200 },
              { value: 150, xAxis: 2, yAxis: 150 },
              { value: 80, xAxis: 3, yAxis: 80 },
              { value: 70, xAxis: 4, yAxis: 70 },
              { value: 110, xAxis: 5, yAxis: 110 },
              { value: 130, xAxis: 6, yAxis: 130 },
              { value: 120, xAxis: 7, yAxis: 120 },
              { value: 200, xAxis: 8, yAxis: 200 },
              { value: 150, xAxis: 9, yAxis: 150 },
              { value: 80, xAxis: 10, yAxis: 80 },
              { value: 70, xAxis: 11, yAxis: 70 },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
          },
        },
      ],
    };
    return (
      <Fragment>
        <Card
          bordered={false}
          className={styles.contentCard}
          title={
            <div>
              <span className={styles.titleLine} />
              合格证扫码统计
            </div>
          }
        >
          <Row gutter={48}>
            <Col span={12}>
              <Card
                bodyStyle={{ width: '100%', height: 600 }}
                title={`合格证扫码量统计（${new Date().getMonth() + 1}月份）`}
                bordered={false}
                className={styles.prodStatContent}
              >
                <EChartsHollowPie data={areaStatOpiton} />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                bodyStyle={{ width: '100%', height: 600 }}
                title={`合格证扫码量统计（${new Date().getFullYear()}月份）`}
                bordered={false}
                className={styles.prodStatContent}
              >
                <EchartsBarVer data={yearProductionStat} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}

export default Home;
