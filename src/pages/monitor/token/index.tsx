import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Select,Input,Button, Row, Col,message, Table,Tag,Popconfirm} from 'antd';
const { Option } = Select;
import ApplicationAdd from './components/ApplicationAdd'
import Authorized from '@/utils/Authorized';
import PaginationItem from '@/components/Pagination';
interface  TokenManageProps extends ConnectProps {
  loading: boolean;
  applicationList:any;
  allApplicationList:any;
}

interface  TokenManageState{
  parameter:  any
  menuTitlecolumns:Array<Object>,
  applicationVisible:boolean,
  openType:string
  editInfoDatas:any,
}

class TokenManage extends React.Component<TokenManageProps,TokenManageState> {
  state:  TokenManageState = {
    parameter: {
      keyword:''
    },
    editInfoDatas:{},
    applicationVisible:false,
    openType:'',
    menuTitlecolumns :[
      {
        title: '用户名',
        dataIndex: 'clientId',
        key: '1',
        align:'center'
      },
      {
        title: 'token 到期时间',
        key: '2',
        dataIndex: 'clientName',
        align:'center',
      },
      {
        title: '授权类型',
        key: '3',
        dataIndex: 'clientSecret',
        align:'center',
      },
      {
        title: '所属应用 ',
        key: '4',
        dataIndex:'webServerRedirectUri',
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
          <Popconfirm placement="top" title={'请选择创建类型'} onConfirm={this.handleDelete.bind(this,row)} okText="确定" cancelText="取消">
                <Tag color="blue" >删除</Tag>
          </Popconfirm>  
        </Authorized> 
       </div>
      }
    ],
  };

  // 删除角色
  handleDelete(row:any){
    let {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'application/deleteApplicationRequest',
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
    this.getApplicationNameList()
  }
  
  //获取应用名字列表
  getApplicationNameList(){
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'application/findAllApplicationNameRequest',
      })
    }
  }

  handleeSelectTitle(){}

  // 新增（编辑）
  handleNewBtn(type:string,row?:any){
    this.setState({
      editInfoDatas:row,
      applicationVisible:true,
      openType: type
    })
  }
  
  //预览
  handlePreview(type:string,row?:any){
    this.setState({
      editInfoDatas:row,
      applicationVisible:true,
      openType: type
    })
  }

  // 关闭新增或者打开组件
  handleStatusClick(val:boolean){
    this.setState({
      applicationVisible:val
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

  // 获取名称查询
  handleNameInput(e:any){
    let parameter = this.state.parameter
    parameter['keyword'] =  e.target.value
    this.setState({
      parameter:parameter
    })
  }

  child: any = {}
  onRef = (ref: any) => {  
    this.child = ref
  }
  render() {
    this.props.applicationList.returnObject = [
      {
          "id": 1,
          "createTime": null,
          "updateTime": null,
          "clientId": "dms",
          "clientName": "运营后台",
          "resourceIds": "",
          "clientSecret": "$2a$10$06msMGYRH8nrm4iVnKFNKOoddB8wOwymVhbUzw/d3ZixD7Nq8ot72",
          "clientSecretStr": "dms",
          "scope": "all",
          "authorizedGrantTypes": "authorization_code,password,refresh_token,client_credentials",
          "webServerRedirectUri": null,
          "authorities": "",
          "accessTokenValiditySeconds": 18000,
          "refreshTokenValiditySeconds": 28800,
          "additionalInformation": "{}",
          "autoapprove": "true"
      },
      {
          "id": 11,
          "createTime": null,
          "updateTime": null,
          "clientId": "asdf",
          "clientName": "zzzzz44444",
          "resourceIds": "",
          "clientSecret": "$2a$10$R.BpvsO6rmql2QFlNFWrvOoFAJPL89XTEFb2ANkMv8XSvJ3nz8Nom",
          "clientSecretStr": "ffff",
          "scope": "all",
          "authorizedGrantTypes": "authorization_code,password,refresh_token,client_credentials",
          "webServerRedirectUri": "http://127.0.0.1",
          "authorities": "",
          "accessTokenValiditySeconds": 18000,
          "refreshTokenValiditySeconds": 28800,
          "additionalInformation": "{}",
          "autoapprove": "true"
      }
  ]

  this.props.allApplicationList.returnObject =  [
        {
            "id": 1,
            "createTime": null,
            "updateTime": null,
            "clientId": "dms",
            "clientName": "运营后台",
            "resourceIds": "",
            "clientSecret": "$2a$10$06msMGYRH8nrm4iVnKFNKOoddB8wOwymVhbUzw/d3ZixD7Nq8ot72",
            "clientSecretStr": "dms",
            "scope": "all",
            "authorizedGrantTypes": "authorization_code,password,refresh_token,client_credentials",
            "webServerRedirectUri": null,
            "authorities": "",
            "accessTokenValiditySeconds": 18000,
            "refreshTokenValiditySeconds": 28800,
            "additionalInformation": "{}",
            "autoapprove": "true"
        },
        {
            "id": 11,
            "createTime": null,
            "updateTime": null,
            "clientId": "asdf",
            "clientName": "zzzzz",
            "resourceIds": "",
            "clientSecret": "$2a$10$R.BpvsO6rmql2QFlNFWrvOoFAJPL89XTEFb2ANkMv8XSvJ3nz8Nom",
            "clientSecretStr": "ffff",
            "scope": "all",
            "authorizedGrantTypes": "authorization_code,password,refresh_token,client_credentials",
            "webServerRedirectUri": "http://127.0.0.1",
            "authorities": "",
            "accessTokenValiditySeconds": 18000,
            "refreshTokenValiditySeconds": 28800,
            "additionalInformation": "{}",
            "autoapprove": "true"
        }
    ]
    
    return (
      <PageHeaderWrapper>
        <div className={styles.ApplicationPage}>
          <header className={styles.pageHeader}>
            <Row>
              <Col span={20}> 
                 <span>搜索</span>
                 <Select className="mL20" defaultValue="用户名" style={{ width: '10%'}} onChange={this.handleeSelectTitle}>
                    <Option value="nickname">名称</Option>
                    <Option value="username">类型</Option>
                  </Select>
                  <Input className={`mL20 ${styles.name}`}   placeholder="请输入关键字" onChange={this.handleNameInput.bind(this)} />
                  <Button type="primary" className="mL20"  onClick={this.handleQueryPageList.bind(this)}>查询</Button>
                  <Button className="mL20" type="primary" onClick={this.handleNewBtn.bind(this,'','')} ghost>新增</Button>
                </Col>
            </Row>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
            <Table<any> columns={this.state.menuTitlecolumns}  rowKey={record => record.id} dataSource={this.props.applicationList.returnObject} pagination={false} />
            <div  className="mB10" >
               <PaginationItem ref={this.onRef} total={10} changePage={this.handleQueryPageList.bind(this)} />
            </div>
          </div>
          <ApplicationAdd editInfoDatas={this.state.editInfoDatas} applicationVisible={this.state.applicationVisible} openType={this.state.openType} applicationNameList={this.props.allApplicationList.returnObject} handleStatusClick={this.handleStatusClick.bind(this)}></ApplicationAdd>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({application, loading }: ConnectState) => ({
  applicationList: application.applicationList,
  allApplicationList: application.allApplicationList,
  loading: loading.models.application,
}))(TokenManage);