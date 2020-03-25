import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Input, Row, Col,Icon,message, Table,Tag,Tooltip,Modal} from 'antd';
const { Search } = Input;
import Authorized from '@/utils/Authorized';
import HandleButton from '@/components/HandleButton'
import PaginationItem from '@/components/Pagination';
interface  UsersProps extends ConnectProps {
  loading: boolean;
}

interface  UsersState{
  parameter:  any
  userId:  any
  menuTitlecolumns:Array<Object>,
}

class Users extends React.Component<UsersProps,UsersState> {
  state:  UsersState = {
    parameter: {
      keyword:''
    },
    userId:"",
    menuTitlecolumns :[
      {
        title: '用户名',
        key: '1',
        align:'center',
        render:(row:any)=>this.state.userId === row.id?
        <div><span>{row.username}</span> <Tag className={styles.tag} color="magenta">current</Tag></div>:
        <span>{row.username}</span>
      },
      {
        title: '登录时间',
        key: '2',
        dataIndex: 'loginTime',
        align:'center',
      },
      {
        title: '登录IP',
        key: '3',
        dataIndex: 'ip',
        align:'center',
      },
      {
        title: '登录地点',
        key: '4',
        dataIndex:'loginAddress',
        align:'center',
      }, 
      {
        title: '操作',
        key: '9',
        align:'center',
        render: (row:any) =>   
        <div>   
        <Authorized    
          authority={['admin']} noMatch={<p>没有权限</p>}>
           {/* <Tooltip placement="top" title={'踢出'}>
               <Icon type="logout" className="red" onClick={this.handleLoginOut.bind(this)}/>
          </Tooltip> */}
              <div className="handle_btn">
            <span>
              <HandleButton icon="logout"  title="编辑" handleClick={this.handleLoginOut.bind(this)} />
            </span>
          </div>
        </Authorized> 
       </div>
      }
    ],
  };
 
  handleLoginOut(){
    let {dispatch} = this.props
    Modal.confirm({
      title: '确定踢出该用户?',
      content: ' 当您点击确定按钮后，该用户的登录将会马上失效',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (dispatch) {
          dispatch({
            type:'role/deleteRoleRequest',
            payload: {},
            callback: (res: any) => {
              if (res.errorCode&&res.errorCode === '0000') {
                message.success('操作成功');
              }
            },
          })
        }
      },
    });
  }

  UNSAFE_componentWillMount(){
    this.handleQueryPageList()
    let userId = JSON.parse(localStorage.getItem('userData'))?JSON.parse(localStorage.getItem('userData')).returnObject.userId:''
    this.setState({
      // userId: userId
      userId: 'xuVNSwUxEW4yrdla51ma'
    })
  }

  // 页面查询数据
  handleQueryPageList(pageNum?: number, pageSize?: number){
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'application/applicationListDatasRequest',
        payload: {
          pageNum: pageNum ? pageNum : 1,
          pageSize: pageSize ? pageSize : 20,
        },
      })
    }
  }

  child: any = {}
  onRef = (ref: any) => {  
    this.child = ref
  }
  // 搜索
  handleSearch(val: string) {
    console.log(val)
  }
  datas ={"data":[
    {"id":"xuVNSwUxEW4yrdla51ma","username":"scott","ip":"192.168.0.141","loginTime":"2019-11-21 16:22:49","loginAddress":"内网IP|0|0|内网IP|内网IP"},
    {"id":"Bd47uzOiKxswIWN8LjD6","username":"mrbird","ip":"192.168.0.141","loginTime":"2019-11-21 16:44:38","loginAddress":"内网IP|0|0|内网IP|内网IP"}]}
    
  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.UsersPage}>
          <header className={styles.pageHeader}>
            <Row>
              <Col span={20}> 
              <Search className={`mR20 mT20 ${styles.search}`} placeholder="请输入用户名" onSearch={value => this.handleSearch(value)} enterButton />
                </Col>
            </Row>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
            <Table<any> columns={this.state.menuTitlecolumns} size="middle"  rowKey={record => record.id} dataSource={this.datas.data} pagination={false} />
            <div  className="mB10" >
               <PaginationItem ref={this.onRef} total={10} changePage={this.handleQueryPageList.bind(this)} />
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({application, loading }: ConnectState) => ({
  applicationList: application.applicationList,
  loading: loading.models.application,
}))(Users);