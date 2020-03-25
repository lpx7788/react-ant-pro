import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Select,Input,Button, Row, Col,Icon,message, Table,Tag,Popconfirm} from 'antd';
const { Option } = Select;
import MenuAdd from './components/MenuAdd'
import Authorized from '@/utils/Authorized';
import HandleButton from '@/components/HandleButton'
interface  MenuProps extends ConnectProps {
  loading: boolean;
  menuList:any;
  onesmenuList:any;
}

interface  MenuState {
  parameter:  any
  menuTitlecolumns:Array<Object>,
  menuVisible:boolean,
  openType:string
  editMenuDatas:any,
}

class MenuManagement extends React.Component< MenuProps,  MenuState> {
  state:  MenuState = {
    parameter: {
      keyword:''
    },
    editMenuDatas:{},
    menuVisible:false,
    openType:'',
    menuTitlecolumns :[
      {
        title: '名称',
        dataIndex: 'name',
        key: '1',
        align:'center'
      },
      {
        title: '图标',
        key: '2',
        align:'center',
        render: (record: any) =>  <Icon type={record.icon} /> 
      },
      {
        title: '类型',
        key: '3',
        align:'center',
        render: (record: any) => record.type === 1 ? <Tag color="cyan">菜单</Tag> : <Tag color="magenta">按钮</Tag> 
      }, 
      {
        title: '地址',
        dataIndex: 'path',
        key: '4',
        align:'center',
      },
      {
        title: '权限',
        align:'center',
        key: '5', render: () => 'menu:view' },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: '7',
        align:'center',
      },
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        key: '8',
        align:'center',
      },
      {
        title: '操作',
        key: '9',
        width:'220px',
        align:'center',
        render: (row:any) =>   
        <div className="handle_btn">   
        <Authorized    
        authority={['admin']} noMatch={<p>没有权限</p>}>
          <HandleButton icon="eye" title="查看" handleClick={this.handleNewBtn.bind(this, 'pre', row)}/>
          <HandleButton icon="edit" title="修改" handleClick={this.handleNewBtn.bind(this, 'edit', row)}/>
          <Popconfirm placement="top" title={'请选择创建类型'} onConfirm={this.handleDelete.bind(this,row)} okText="确定" cancelText="取消">
            <div className="inline">
              <HandleButton icon="delete" title="删除"/>
            </div>
          </Popconfirm>  
        </Authorized> 
       </div>
      }
    ],
  };

  handleReset(){
  }

  // 删除菜单
  handleDelete(row:any){
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
    this.getOneMenu()
  }
  
  getOneMenu(){
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'menu/findOnesMenuRequest',
      })
    }
  }

  handleeSelectTitle(){

  }

  // 新增（编辑）
  handleNewBtn(type:string,row?:any){
    this.setState({
      editMenuDatas:row,
      menuVisible:true,
      openType: type
    })
  }
  
  //预览
  handlePreview(type:string,row?:any){
    this.setState({
      editMenuDatas:row,
      menuVisible:true,
      openType: type
    })
  }

  // 关闭新增或者打开组件
  handleStatusClick(val:boolean){
    this.setState({
      menuVisible:val
    })
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
    this.props.menuList.returnObject = [
      {
          "checked": false,
          "children": [
              {
                  "checked": false,
                  "children": [],
                  "css": "layui-icon-friends",
                  "icon": "",
                  "id": 21,
                  "name": "按钮",
                  "parentId": 2,
                  "path": "/authenticate/user",
                  "url": "/authenticate/user",
                  'type':2,
                  'sort':1
              }
          ],
          "css": "layui-icon-set",
          "icon": "windows",
          "id": 2,
          "name": "认证管理",
          "parentId": -1,
          "path": "/authenticate",
          "url": "javascript:;",
          'type':1,
          'sort':1
      },
      {
          "checked": false,
          "children": [],
          "css": "11",
          "icon": "",
          "id": 86,
          "name": "测试123",
          "parentId": -1,
          "path": "123",
          "url": "123",
          'type':1,
          'sort':1
      }
  ]
  this.props.onesmenuList.returnObject = [
    {
        "checked": false,
        "children": [],
        "css": "layui-icon-set",
        "icon": "windows",
        "id": 2,
        "name": "认证管理",
        "parentId": -1,
        "path": "/authenticate",
        "url": "javascript:;"
    },
    {
        "checked": false,
        "children": [],
        "css": "layui-icon-friends",
        "icon": "",
        "id": 21,
        "name": "用户管理",
        "parentId": 2,
        "path": "/authenticate/user",
        "url": "/authenticate/user"
    },
  ]
    return (
      <PageHeaderWrapper>
        <div className={styles.menuManagementPage}>
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
            <Table<any> size="middle"  columns={this.state.menuTitlecolumns} rowKey={record => record.id} dataSource={this.props.menuList.returnObject} pagination={false} />
          </div>
          <MenuAdd editMenuDatas={this.state.editMenuDatas} menuVisible={this.state.menuVisible} openType={this.state.openType} menuList={this.props.onesmenuList.returnObject} handleStatusClick={this.handleStatusClick.bind(this)}></MenuAdd>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ menu, loading }: ConnectState) => ({
  menuList: menu.menuList,
  onesmenuList: menu.onesmenuList,
  loading: loading.models.menu,
}))(MenuManagement);
