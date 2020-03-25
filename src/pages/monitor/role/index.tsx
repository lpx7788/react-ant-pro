import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Select, Input, Button, Row, Col, Table, Popconfirm, Tag, message } from 'antd';
const { Option } = Select;
import NewRole from './components/NewRole'
import Authorized from '@/utils/Authorized';
import PaginationItem from '@/components/Pagination';

interface RoleProps extends ConnectProps {
  loading: boolean;
  roleList: any;
  menuPermissionTree: any;
}

interface RoleState {
  parameter: any,
  roleTitlecolumns: Array<Object>,
  roleVisible: boolean,
  openType: string
  selectedRoleInfo: any
}

class RoleManagement extends React.Component<RoleProps, RoleState> {
  state: RoleState = {
    parameter: {
      keyword: ''
    },
    selectedRoleInfo: {},
    roleVisible: false,
    openType: 'btn',
    roleTitlecolumns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: '1',
        align: 'center',
        sorter: (a: any, b: any) => a.id - b.id,
      },
      {
        title: '角色',
        dataIndex: 'name',
        key: '2',
        align: 'center'
      },
      {
        title: '描述',
        dataIndex: 'remark',
        key: '4',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: '5',
        align: 'center',
        sorter: (a: any, b: any) => a.createTime - b.createTime,
        render: (record: any) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: '6',
        align: 'center',
        sorter: (a: any, b: any) => a.createTime - b.createTime,
        render: (record: any) => moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: '9',
        width: '300px',
        align: 'center',
        render: (row: any) =>
          <div>
            <Tag color="cyan" onClick={this.handleNewBtn.bind(this, 'pre', row)}>查看</Tag>
            <Authorized
              authority={['admin']} >
              <Tag color="cyan" onClick={this.handleNewBtn.bind(this, 'edit', row)} >修改</Tag>
              <Tag color="blue" onClick={this.handleNewBtn.bind(this, 'permission', row)}>权限分配</Tag>
              <Popconfirm placement="top" title={'确定删除吗'} onConfirm={this.handleDelete.bind(this, row)} okText="确定" cancelText="取消">
                <Tag color="blue" >删除</Tag>
              </Popconfirm>
            </Authorized>
          </div>
      }
    ],
  };

  UNSAFE_componentWillMount() {
    this.handleQueryPageList()
  }
  // 删除角色
  handleDelete(row: any) {
    let { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'role/deleteRoleRequest',
        payload: { id: row.id },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            message.success('操作成功');
          }
        },
      })
    }
  }

  //新增(编辑)用户弹窗打开
  handleNewBtn(type: any, row?: any) {
    let { dispatch } = this.props;
    // 权限分配
    if (type === 'permission') {
      if (dispatch) {
        dispatch({
          type: 'role/menuTreeRequest',
          payload: {
            roleId: row.id
          }
        })
      }
    }
    this.setState({
      roleVisible: true,
      selectedRoleInfo: row,
      openType: type
    })
  }

  // 关闭新增或者打开组件
  handleNewRole(val: boolean) {
    this.setState({
      roleVisible: val
    })
  }


  // 获取名称查询
  handleNameInput(e: any) {
    let parameter = this.state.parameter
    parameter['roleName'] = e.target.value
    this.setState({
      parameter: parameter
    })
  }

  // 搜索列名选择
  handleeSelectTitle() {

  }
  // 页面查询数据
  handleQueryPageList(pageNum?: number, pageSize?: number) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'role/fetchRoleListDatas',
        payload: {
          pageNum: pageNum ? pageNum : 1,
          pageSize: pageSize ? pageSize : 20,
        }
      })
    }
  }
  child: any = {}
  onRef = (ref: any) => {
    this.child = ref
  }

  render() {
    this.props.roleList.data = [
      {
        "code": "ADMIN",
        "createTime": 1510937819000,
        "id": 1,
        "name": "管理员",
        "remark": "hahahhahah",
        "updateTime": 1537349950000,
        "userId": 0
      }
    ]
    this.props.menuPermissionTree.returnObject = [

      {
        "checked": true,
        "children": [
          {
            "checked": true,
            "children": [],
            "id": 21,
            "name": "用户管理",
          }
        ],
        "id": 2,
        "name": "认证管理"
      },
      {
        "checked": false,
        "children": [],
        "id": 86,
        "name": "测试123"
      }

    ]

    let ids: any = [];
    const getIdsList = function getIds(arr: any) {
      arr.forEach((item: any) => {
        if (item.checked === true) {
          ids.push(item.id + "")
          if (item.children) {
            getIds(item.children)
          }
        }
      })
      return ids
    }
    getIdsList(this.props.menuPermissionTree.returnObject)
    let menuTress = {
      returnObject: this.props.menuPermissionTree.returnObject,
      ids: ids
    }
    return (
      <PageHeaderWrapper>
        <div className={styles.roleManagementPage}>
          <header className={styles.pageHeader}>
            <Row>
              <Col span={20}>
                <span>搜索</span>
                <Select className="mL20" defaultValue="用户名" style={{ width: '10%' }} onChange={this.handleeSelectTitle}>
                  <Option value="nickname">角色</Option>
                  <Option value="username">描述</Option>
                </Select>
                <Input className={`mL20 ${styles.name}`}  placeholder="请输入关键字" onChange={this.handleNameInput.bind(this)} />
                <Button type="primary" className="mL20" onClick={this.handleQueryPageList.bind(this)}>查询</Button>
                <Button className="mL20" type="primary" onClick={this.handleNewBtn.bind(this, 'new', '')} ghost>新增</Button>
              </Col>
            </Row>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
            <Table<any> columns={this.state.roleTitlecolumns} rowKey={record => record.id} dataSource={this.props.roleList.data} pagination={false} />
            <div className="mB10" >
              <PaginationItem ref={this.onRef} total={this.props.roleList.total} changePage={this.handleQueryPageList.bind(this)} />
            </div>
          </div>
          <NewRole roleInfoData={this.state.selectedRoleInfo} roleVisible={this.state.roleVisible} openType={this.state.openType} menuTreeData={menuTress} handleStatusClick={this.handleNewRole.bind(this)}></NewRole>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ role, loading }: ConnectState) => ({
  roleList: role.roleList,
  menuPermissionTree: role.menuPermissionTree,
  loading: loading.models.system,
}))(RoleManagement);
