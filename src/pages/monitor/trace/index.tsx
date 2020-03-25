import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Icon,message, Table,Tag} from 'antd';
import PaginationItem from '@/components/Pagination';

interface  TraceProps extends ConnectProps {
  loading: boolean;
  menuList:any;
}

interface  TraceState {
  parameter:  any
  traceTitlecolumns:Array<Object>,
}

class Trace extends React.Component< TraceProps,  TraceState> {
  state:  TraceState = {
    parameter: {
      keyword:''
    },
    traceTitlecolumns :[
      {
        title: '请求时间',
        dataIndex: 'time',
        key: '1',
        align:'center'
      },
      {
        title: '请求方法',
        key: '2',
        align:'center',
        filters: [{ text: 'GET', value: '1' }, { text: 'POST', value: '2' },{text:'PUT',value:'3'},{text:'DELETE',value:'4'}],
        render: (record: any) => <Tag color="#87d068">{record.method}</Tag>
      },
      {
        title: '请求URL',
        key: '3',
        align:'center',
       dataIndex:'url' 
      }, 
      {
        title: '响应状态',
        key: '4',
        align:'center',
        render: (record: any) => <Tag color="green">{record.status}</Tag>  
      },
      {
        key: '5',
        title: '请求耗时',
        align:'center',
        render: (record: any) => <Tag color="green">{record.elapsedTime}</Tag> 
      },

    ],
  };


  // 点击刷新
  handleRefresh(row:any){
    let {dispatch} = this.props
    if (dispatch) {
      dispatch({
        type: 'menu/deleteMenuRequest',
        payload: {id:row.id},
        callback: (res: any) => {
          if (res.errorCode&&res.errorCode === '0000') {
            message.success('操作成功');
          }
        },
      })
    }
  }

  UNSAFE_componentWillMount(){
    this.handleQueryPageList()
  }
  
  // 页面查询数据
  handleQueryPageList(){
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'menu/fetchMenuListDatas',
      })
    }
  }

  child: any = {}
  onRef = (ref: any) => {  
    this.child = ref
  }
  render() {
    this.props.menuList.returnObject = [
      {
          "time": "2019-11-22 10:46:10",
          "method": "GET",
          "id": 1,
          "url": "	http://192.168.0.230:9527/actuator/metrics/process.cpu.usage",
          "status": '200',
          "elapsedTime": "5 ms",
      },
      {
        "time": "2019-11-22 10:46:10",
        "method": "POST",
        "id": 2,
        "url": "	http://192.168.0.230:9527/actuator/metrics/process.cpu.usage",
        "status": '200',
        "elapsedTime": "5 ms",
    },
  ]

    return (
      <PageHeaderWrapper>
        <div className={styles.tracePage}>
          <header className={styles.pageHeader}>
          <p className={styles.tips}><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /><span className='m5'>{`共追踪到${ '234' }条近期HTTP请求记录`}</span>
          <span className='mL20 mainColor' onClick={this.handleRefresh.bind(this)}>点击刷新</span> </p>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
            <Table<any>  locale={{filterConfirm: '确定',filterReset: '重置'}} columns={this.state.traceTitlecolumns} size="middle"  rowKey={record => record.id} dataSource={this.props.menuList.returnObject} pagination={false} />
          </div>
          <div  className="mB10" >
               <PaginationItem ref={this.onRef} total={10} changePage={this.handleQueryPageList.bind(this)} />
            </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ menu, loading }: ConnectState) => ({
  menuList: menu.menuList,
  loading: loading.models.menu,
}))(Trace);
