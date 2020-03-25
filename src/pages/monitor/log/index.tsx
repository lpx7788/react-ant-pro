import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input,Button, Row, Col, Table,Tag,Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PaginationItem from '@/components/Pagination';
const { Option } = Select;

interface  LogProps extends ConnectProps {
  loading: boolean;
}

interface LogState {
  parameter: any,
  logTitlecolumns:Array<Object>,
}

class Log extends React.Component<LogProps, LogState> {
  state: LogState = {
    parameter: {},
    logTitlecolumns :[
      {
        title: '操作人',
        dataIndex: 'username',
        key: '1',
        align:'center',
      },
      {
        title: '操作描述',
        dataIndex: 'operation',
        key: '2',
        align:'center',
      },
      {
        title: '耗时',
        key: '3',
        align:'center',
        sorter: (a:any, b:any) => a.nickname - b.nickname,
        render:(row:any)=> <Tag className={styles.tag} color="cyan">{row.time}s</Tag>
      },
      {
        title: '执行方法',
        key: '4',
        align:'center',
        width:'300px',
        render:(row:any)=> <div className={styles.method} >{row.method}</div>
      },
      {
        title: '方法参数',
        key: '5',
        align:'center',
        width:'300px',
        render:(row:any)=> <div className={styles.params} >{row.params}</div>
      },
      {
        title: 'IP地址',
        key: '6',
        dataIndex: 'ip',
        align:'center',
      },
      {
        title: '操作地点',
        dataIndex: 'location',
        key: '7',
        align:'center'
      },
      {
        title: '操作时间',
        key: '8',
        align:'center',
        dataIndex: 'createTime',
        sorter: (a:any, b:any) => a.createTime - b.createTime,
        render: (record: any) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    ],
  };

  UNSAFE_componentWillMount(){
    this.handleQueryPageList()
  }

  // 页面查询数据
  handleQueryPageList(pageNum?: number, pageSize?: number){
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/queryUserList',
        payload: {
          pageNum: pageNum ? pageNum : 1,
          pageSize: pageSize ? pageSize : 20,
        }
      })
    }
  }

  // 获取名称查询
  handleNameInput(e:any){
    let parameter = this.state.parameter
    parameter['userName'] =  e.target.value
    this.setState({
      parameter:parameter
    })
  }
  
  // 搜索列名选择
  handleeSelectTitle(){}

  child: any = {}
  onRef = (ref: any) => {  
    this.child = ref
  }
  handleUserTableChange(pagination:any, filters:any, sorter:any, extra:any){
    // this.handleQueryPageList();
  }
  datas={"total":43,"rows":[{"id":1843,"username":"scott","operation":"新增菜单/按钮","time":8,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=141, parentId=1, menuName=tyty, path=null, component=null, perms=tutu, icon=null, type=1, orderNum=null, createTime=Mon Oct 28 13:46:40 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-28 13:46:40","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1850,"username":"scott","operation":"新增菜单/按钮","time":8,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=147, parentId=0, menuName=gdg, path=dgdf, component=fdg, perms=fgdf, icon=border-bottom, type=0, orderNum=null, createTime=Thu Oct 31 15:19:35 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-31 15:19:35","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1849,"username":"mrbird","operation":"修改部门","time":9,"method":"cc.mrbird.febs.system.controller.DeptController.updateDept()","params":" dept: \"Dept(deptId=1, parentId=0, deptName=开发部, orderNum=1.0, createTime=null, modifyTime=Thu Oct 31 14:35:47 CST 2019, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-31 14:35:47","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1851,"username":"scott","operation":"新增菜单/按钮","time":9,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=148, parentId=0, menuName=haah, path=haa, component=hah, perms=ahah, icon=left-circle, type=0, orderNum=null, createTime=Thu Oct 31 15:20:11 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-31 15:20:12","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1841,"username":"scott","operation":"新增菜单/按钮","time":11,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=139, parentId=1, menuName=哈哈, path=http://192.168.0.230:8004/#/system/haha, component=system/haha, perms=管理员, icon=enter, type=0, orderNum=54435.0, createTime=Mon Oct 28 11:04:37 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-28 11:04:37","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1845,"username":"scott","operation":"新增菜单/按钮","time":11,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=143, parentId=129, menuName=1111, path=null, component=null, perms=admin, icon=null, type=1, orderNum=null, createTime=Mon Oct 28 14:08:05 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-28 14:08:06","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1847,"username":"scott","operation":"新增菜单/按钮","time":11,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=145, parentId=1, menuName=8899, path=system/user, component=system/user/User, perms=null, icon=, type=0, orderNum=null, createTime=Mon Oct 28 14:39:20 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-28 14:39:20","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1844,"username":"scott","operation":"新增菜单/按钮","time":13,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=142, parentId=129, menuName=111, path=null, component=null, perms=admin, icon=null, type=1, orderNum=null, createTime=Mon Oct 28 14:03:21 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-28 14:03:21","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1842,"username":"scott","operation":"新增菜单/按钮","time":14,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=140, parentId=1, menuName=234324, path=null, component=null, perms=23423, icon=null, type=1, orderNum=null, createTime=Mon Oct 28 13:42:46 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-28 13:42:46","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"},{"id":1846,"username":"scott","operation":"新增菜单/按钮","time":14,"method":"cc.mrbird.febs.system.controller.MenuController.addMenu()","params":" menu: \"Menu(menuId=144, parentId=1, menuName=7788, path=/system/user, component=/system/user/User, perms=, icon=null, type=0, orderNum=null, createTime=Mon Oct 28 14:38:09 CST 2019, modifyTime=null, createTimeFrom=null, createTimeTo=null)\"","ip":"192.168.0.141","createTime":"2019-10-28 14:38:09","createTimeFrom":null,"createTimeTo":null,"location":"内网IP|0|0|内网IP|内网IP"}]}
  render() {    
    return (
      <PageHeaderWrapper>
        <div className={styles.LogPage}>
          <header className={styles.pageHeader}>
            <Row>
              <Col span={20}> 
                 <span>搜索</span>
                 <Select className="mL20" defaultValue="用户名"  style={{ width: '10%'}} onChange={this.handleeSelectTitle}>
                    <Option value="nickname">操作人</Option>
                    <Option value="username">操作描述</Option>
                    <Option value="mobile">操作地点</Option>
                  </Select>
                  <Input className={`mL20 ${styles.name}`} value={this.state.parameter.userName} placeholder="请输入关键字" onChange={this.handleNameInput.bind(this)} />
                  <Button type="primary" className="mL20"  onClick={this.handleQueryPageList.bind(this)}>查询</Button>
                </Col>
            </Row>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
              <Table<any> onChange={this.handleUserTableChange.bind(this)}  columns={this.state.logTitlecolumns} rowKey={record => record.id} dataSource={this.datas.rows} pagination={false}/>
              <div  className="mB10" >
                 <PaginationItem ref={this.onRef} total={this.datas.total} changePage={this.handleQueryPageList.bind(this)} />
              </div>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  userList: user.userList,
  loading: loading.models.user,
}))(Log);
