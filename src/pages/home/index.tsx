import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Card, DatePicker, Button, Spin } from 'antd';
import AntdRadioGroup from '@/components/AntdRadioGroup';
const { RangePicker } = DatePicker;

interface HomeProps extends ConnectProps {
  loading: boolean;
  HomeDataList: any;
}
interface HomeState {
  parameter: {
    dateKey: any,
    createDateStart: any,
    createDateEnd: any
  }
  groupArr: Array<object>
}

class Home extends React.Component<HomeProps, HomeState> {
  state: HomeState = {
    groupArr: [
      { value: 'today', textName: '今天', key: 1 },
      { value: 'yesterday', textName: '昨天', key: 2 },
      { value: 'lastWeek', textName: '最近一周', key: 3 },
      { value: 'lastMonth', textName: '最近30天', key: 4 },
      { value: 'lastThreeMonth', textName: '最近90天', key: 5 },
      { value: 'all', textName: '累计', key: 6 },
    ],
    parameter: {
      dateKey: 'today',
      createDateStart: '',
      createDateEnd: ''
    },
  };

  UNSAFE_componentWillMount() {
    this.getPageDatas()
  }

  // 获取页面数据
  getPageDatas() {
    const { dispatch } = this.props;
  
    let payload = this.state.parameter;
    let dateKey = payload.dateKey
    let dateNum ;
    
    if (payload.dateKey === "lastWeek") {
     dateKey = "dateNum";
     dateNum = 7;
    }
    else if (payload.dateKey === "lastMonth") {
     dateKey = "dateNum";
     dateNum = 30;
    }
    else if (payload.dateKey === "lastThreeMonth") {
     dateKey = "dateNum";
     dateNum = 90;
    }
    else if (payload.dateKey === "all") {
     dateKey = "";
     dateNum = 90;
    }
    else {
     dateNum = 0;
    }

    let datas ={
      dateKey:dateKey,
      dateNum:dateNum,
      createDateStart:payload.createDateStart,
      createDateEnd: payload.createDateEnd
    }
    if (dispatch) {
      dispatch({
        type: 'home/fetchDatas',
        payload: datas
      })
    }
  }

  //修改日期
  handleTImeChange = (e: String) => {
    let parameter = this.state.parameter
    parameter['dateKey'] = e
    parameter['createDateStart'] = ''
    parameter['createDateEnd'] = ''
    this.setState({
      parameter: parameter
    });
    this.getPageDatas();
  };

  //获取时间戳
  handleRangePicker(date: object, dateStrings: [string, string]) {
    let parameter = this.state.parameter
    parameter['dateKey'] = ''
    parameter['createDateStart'] = new Date(dateStrings[0]).getTime()
    parameter['createDateEnd'] = new Date(dateStrings[1]).getTime()
    this.setState({
      parameter: parameter
    });
    this.getPageDatas();
  }

  // 刷新
  handleRefresh() {
    let parameter = this.state.parameter
    parameter['dateKey'] = 'today'
    parameter['createDateStart'] = ''
    parameter['createDateEnd'] = ''
    this.setState({
      parameter: parameter
    });
  }

  render() {
    return (
      <div className={styles.homePageContent}>
        <div >
          <AntdRadioGroup value={this.state.parameter.dateKey} groupArr={this.state.groupArr} change={this.handleTImeChange} />
          <RangePicker className={`mL20 mR20`} onChange={this.handleRangePicker.bind(this)} placeholder={['开始日期', '结束日期']} />
          <Button type="primary" icon="sync" onClick={this.handleRefresh.bind(this)}>刷新</Button>
        </div>
        <div className="pageContent">
          <div className={`border ${styles.contentItem}`}>
            <div className='content'>
              <h2 className={`mT20 ${styles.contentTitle}`}>基本数据</h2>
              <section className={styles.item}>
                <div className={`border ${styles.cardListItem}`} key={1} >
                  <Card title={'App登录数'} bordered={false}>
                    <p className={`fontW500  ${styles.number}`}>880</p>
                    <p className={`fontW500 red ${styles.persen}`}>19.00%</p>
                  </Card>
                </div>

                <div className={`border ${styles.cardListItem}`} key={2} >
                  <Card title={'Web登录数'} bordered={false}>
                    <p className={`fontW500  ${styles.number}`}>880</p>
                    <p className={`fontW500 red ${styles.persen}`}>19.00%</p>
                  </Card>
                </div>

                {this.props.HomeDataList ?
                  this.props.HomeDataList.map((item: any, index: any) => {
                    return (
                      index >= 0 && index <= 3 ?
                        <div className={`border ${styles.cardListItem}`} key={index} >
                          <Card title={item.common} bordered={false}>
                            <p className={`fontW500  ${styles.number}`}>{item.count}</p>
                            <p className={`fontW500 red ${styles.persen}`}>{item.percentage}</p>
                          </Card>
                        </div> : ""
                    );
                  }) : ''}

              </section>
            </div>
            <Spin tip="Loading..." className={this.props.loading? 'show' : 'hidden'}></Spin>
            <div className='content'>
              <h2 className={styles.contentTitle}>交易数据-现货商城</h2>
              <section className={styles.item}>
                {this.props.HomeDataList ?
                  this.props.HomeDataList.map((item: any, index: any) => {
                    return (
                      index > 3 && index <= 10 ?
                        <div className={`border ${styles.cardListItem}`} key={index} >
                          <Card title={item.common} bordered={false}>
                            <p className={`fontW500  ${styles.number}`}>{item.count}</p>
                            <p className={`fontW500 red ${styles.persen}`}>{item.percentage}</p>
                          </Card>
                        </div> : ""
                    );
                  }) : ''}
              </section>
            </div>
            <div className='content'>
              <h2 className={styles.contentTitle}>交易数据-求购大厅</h2>
              <section className={styles.item}>
                {this.props.HomeDataList ?
                  this.props.HomeDataList.map((item: any, index: any) => {
                    return (
                      index >= 11 && index <= 17 ?
                        <div className={`border ${styles.cardListItem}`} key={index} >
                          <Card title={item.common} bordered={false}>
                            <p className={`fontW500  ${styles.number}`}>{item.count}</p>
                            <p className={`fontW500 red ${styles.persen}`}>{item.percentage}</p>
                          </Card>
                        </div> : ""
                    );
                  }) : ''}
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ home, loading }: ConnectState) => ({
  HomeDataList: home.HomeDataList,
  loading: loading.models.home,
}))(Home);
