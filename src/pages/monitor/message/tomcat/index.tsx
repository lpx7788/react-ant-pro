import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Icon,message, Table,Tag} from 'antd';
import PaginationItem from '@/components/Pagination';

interface TomcatProps extends ConnectProps {
  loading: boolean;
  menuList:any;
}

interface TomcatState {
  parameter:  any
  tomcatTitlecolumns:Array<Object>,
}

class Tomcat extends React.Component<TomcatProps,TomcatState> {
  state:TomcatState = {
    parameter: {
      keyword:''
    },
    tomcatTitlecolumns :[
      {
        title: '参数',
        key: '1',
        render: (record: any) => <Tag color="#87d068">{record.parameter}</Tag>
      },
      {
        title: '描述',
        key: '2',
        dataIndex: 'description',
      },
      {
        title: '当前值',
        key: '3',
       dataIndex:'current' 
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
        "parameter": "jvm",
        "description": "	JVM 最大内存",
        "id": 1,
        "current": "5197.500 MB",
      },
      {
        "parameter": "jvm.buffer",
        "description": "JVM 当前活跃线程数量",
        "id": 2,
        "current": "5197.500 MB",
    },
  ]

    return (
      <PageHeaderWrapper>
        <div className={styles.tomcatPage}>
          <header className={styles.pageHeader}>
          <p className={styles.tips}><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /><span className='m5'>{`数据获取时间 ${ ' 2019年11月22日 14时06分39秒' }`}</span>
          <span className='mL20 mainColor' onClick={this.handleRefresh.bind(this)}>点击刷新</span> </p>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
            <Table<any>  locale={{filterConfirm: '确定',filterReset: '重置'}} columns={this.state.tomcatTitlecolumns} size="middle"  rowKey={record => record.id} dataSource={this.props.menuList.returnObject} pagination={false} />
          </div>
          <div className="mB10" >
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
}))(Tomcat);
