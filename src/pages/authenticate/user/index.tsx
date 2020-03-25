import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Button, Row, Col, Popconfirm, Table, Tag, Select, Modal, message, Tooltip, } from 'antd';
import NewUser from './components/NewUser/NewUser'
import UserInfo from './components/UserInfo/UserInfo'
import ResetPassword from './components/ResetPassword/resetPassword'
import moment from 'moment';
import PaginationItem from '@/components/Pagination';
import Authorized from '@/utils/Authorized';
import HandleButton from '@/components/HandleButton';
import 'moment/locale/zh-cn';

const { Option } = Select;

interface UserProps extends ConnectProps {
  loading: boolean;
  userList:any;
  userRolesList:any
}

interface UserState {
  parameter: {
    createDateStart: any,
    createDateEnd: any,
    userName:any,
    department:any
  },
  userMessageStatus:boolean,
  resetPwdModaleStatus:boolean,
  userTitlecolumns:Record<string, any>[],
  userVisible:boolean,
  openType:string
  selectedUserInfor:any
}

class UserManagement extends React.Component<UserProps, UserState> {
  state: UserState = {
    parameter: {
      createDateStart: '',
      createDateEnd: '',
      userName: '',
      department: undefined,
    },
    selectedUserInfor: {},
    userMessageStatus: false,
    resetPwdModaleStatus: false,
    userVisible: false,
    openType: 'new',
    userTitlecolumns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: '1',
        align: 'center',
        sorter: (a:any, b:any) => a.id - b.id,
      },
      {
        title: '用户名',
        dataIndex: 'nickname',
        key: '2',
        align: 'center',
        sorter: (a:any, b:any) => a.nickname - b.nickname,
      },
      {
        title: '账户',
        dataIndex: 'username',
        key: '3',
        align: 'center',
      },
      {
        title: '性别',
        key: '4',
        align: 'center',
        filters: [{ text: '男', value: '1' }, { text: '女', value: '2' }],
        render: (record: any) => (record.sex === 1 ? '男' : '女'),
      },
      {
        title: '电话',
        dataIndex: 'mobile',
        key: '5',
        align: 'center',
      },
      {
        title: '创建时间',
        key: '7',
        align: 'center',
        dataIndex: 'createTime',
        sorter: (a:any, b:any) => a.createTime - b.createTime,
        render: (record: any) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        align: 'center',
        key: '9',
        width: '300px',
        render: (row:any) =>
        <div className="handle_btn">
          <HandleButton icon="eye" title="查看" className="bgMain" handleClick={this.handlePreview.bind(this, row)}/>
          <Authorized
            authority={['admin']}>
            <HandleButton icon="redo" title="重置密码" className="bgGreen" handleClick={this.handleReset.bind(this, row)}/>
            <HandleButton icon="edit" title="修改" className="bgMain" handleClick={this.handleNewBtn.bind(this, 'edit', row)}/>
            <Popconfirm placement="top" title="确定删除吗" onConfirm={this.handleDelete.bind(this, row)} okText="确定" cancelText="取消">
              <div className="inline">
                <HandleButton icon="delete" title="删除" className="bgRed"/>
              </div>
            </Popconfirm>
          </Authorized>
        </div>,
      },
    ],
  };

  UNSAFE_componentWillMount() {
    this.getRolesList();
    this.handleQueryPageList()
  }

  handleReset(row:any) {
    this.setState({
      resetPwdModaleStatus: true,
      selectedUserInfor: row,
    })
  }

  closeResetPwdModal() {
    this.setState({
      resetPwdModaleStatus: false,
    })
  }

  // 删除用户
  handleDelete(row:any) {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'user/deleteUserRequest',
        payload: { id: row.id },
        callback: (res: any) => {
          if (res.errorCode === '0000') {
            message.success('操作成功');
          }
        },
      })
    }
  }

  // 获取角色列表
  getRolesList() {
      const { dispatch } = this.props
      if (dispatch) {
        dispatch({
          type: 'user/queryUserRoles',
        })
      }
  }

  // 新增用户弹窗打开
  handleNewBtn(type:string, row?:any) {
    this.setState({
      userVisible: true,
      selectedUserInfor: row,
      openType: type,
    })
  }

  // 预览(打开)用户信息
  handlePreview(row:any) {
   this.setState({
     selectedUserInfor: row,
     userMessageStatus: true,
   })
  }

  // 关闭用户信息
  closeUserInfoModal(val:boolean) {
   this.setState({
     userMessageStatus: val,
   })
  }

  // 关闭新增或者打开组件
  handleStatusClick(val:boolean) {
    this.setState({
      userVisible: val,
    })
  }

  // 页面查询数据
  handleQueryPageList(pageNum?: number, pageSize?: number) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/queryUserList',
        payload: {
          pageNum: pageNum || 1,
          pageSize: pageSize || 20,
        },
      })
    }
  }

  // 获取名称查询
  handleNameInput(e:any) {
    const { parameter } = this.state
    parameter.userName = e.target.value
    this.setState({
      parameter,
    })
  }

  // 搜索列名选择
  handleeSelectTitle() {

  }

  child: any = {}

  onRef = (ref: any) => {
    this.child = ref
  }

  handleUserTableChange(pagination:any, filters:any, sorter:any, extra:any) {
    // this.handleQueryPageList();
  }

  render() {
    this.props.userList.data = [
      {
          createTime: 1572944515000,
          del: false,
          enabled: true,
          headImgUrl: '',
          id: 28,
          mobile: '16602062387',
          newPassword: '',
          nickname: '张三三',
          oldPassword: '',
          openId: '',
          password: '$2a$10$co0GFDvr5AJaBpDo3k7qSuyPod2GoIaXz3jwuUNgDhHJOEwDBbKc2',
          roleId: '',
          roles: [
              {
                  code: 'ADMIN',
                  createTime: 1510937819000,
                  id: 1,
                  name: '管理员',
                  updateTime: 1537349950000,
                  userId: 28,
              },
          ],
          sex: 1,
          type: 'BACKEND',
          updateTime: 1572944872000,
          username: 'zhangsan',
      },
      {
          createTime: 1572944379000,
          del: false,
          enabled: true,
          headImgUrl: '',
          id: 27,
          mobile: '16602062387',
          newPassword: '',
          nickname: '张三',
          oldPassword: '',
          openId: '',
          password: '$2a$10$J0dzlKx6MeMfQC/dUCnDYuuZbVmybXg6kTxFxyv8kdkdg8r4wckPa',
          roleId: '',
          roles: [
              {
                  code: 'ADMIN',
                  createTime: 1510937819000,
                  id: 1,
                  name: '管理员',
                  updateTime: 1537349950000,
                  userId: 27,
              },
          ],
          sex: 0,
          type: 'BACKEND',
          updateTime: 1572944379000,
          username: 'laaa',
      },
      {
          createTime: 1510937819000,
          del: false,
          enabled: true,
          headImgUrl: '',
          id: 1,
          mobile: '18888888888',
          newPassword: '',
          nickname: '管理员',
          oldPassword: '',
          openId: '123',
          password: '$2a$10$TJkwVdlpbHKnV45.nBxbgeFHmQRmyWlshg94lFu2rKxVtT2OMniDO',
          roleId: '',
          roles: [
              {
                  code: 'ADMIN',
                  createTime: 1510937819000,
                  id: 1,
                  name: '管理员',
                  updateTime: 1537349950000,
                  userId: 1,
              },
          ],
          sex: 0,
          type: 'APP',
          updateTime: 1546967147000,
          username: 'admin',
      },
     ]
    this.props.userRolesList.returnObject = [
      {
          code: 'ADMIN',
          id: 1,
          name: '管理员',
      },
      {
        code: 'user',
        id: 2,
        name: 'user',
    },
  ]
  // console.log(this.props.userRolesList.returnObject);

    return (
      <PageHeaderWrapper>
        <div className={styles.userManagementPage}>
          <header className={styles.pageHeader}>
            <Row>
              <Col span={20}>
                 <span>搜索</span>
                 <Select className="mL20" defaultValue="用户名" style={{ width: '10%' }} onChange={this.handleeSelectTitle}>
                    <Option value="nickname">用户名</Option>
                    <Option value="username">账户</Option>
                    <Option value="mobile">电话</Option>
                  </Select>
                  <Input className={`mL20 ${styles.name}`} value={this.state.parameter.userName} placeholder="请输入关键字" onChange={this.handleNameInput.bind(this)} />
                  <Button type="primary" className="mL20" onClick={this.handleQueryPageList.bind(this)}>查询</Button>
                  <Authorized
                      authority={['admin']}>
                      <Button className="mL20" type="primary" onClick={this.handleNewBtn.bind(this, 'new', '')} ghost>新增</Button>
                  </Authorized>
                </Col>
            </Row>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
              <Table<any> locale={{ filterConfirm: '确定', filterReset: '重置' }} size="middle" onChange={this.handleUserTableChange.bind(this)} columns={this.state.userTitlecolumns} rowKey={record => record.id} dataSource={this.props.userList.data} pagination={false}/>
              <div className="mB10" >
                 <PaginationItem ref={this.onRef} total={this.props.userList.total} changePage={this.handleQueryPageList.bind(this)} />
              </div>
          </div>
        </div>
        <ResetPassword userInfoData={this.state.selectedUserInfor} reSetModaleStatus={this.state.resetPwdModaleStatus} handleModalClick={this.closeResetPwdModal.bind(this)}/>
          <NewUser rolesList={this.props.userRolesList.returnObject} userDefaultInfoData={this.state.selectedUserInfor} userVisible={this.state.userVisible} openType={this.state.openType} handleStatusClick={this.handleStatusClick.bind(this)}></NewUser>
          <UserInfo userInfoData={this.state.selectedUserInfor} userMessageStatus={this.state.userMessageStatus} handleModalClick={this.closeUserInfoModal.bind(this)}></UserInfo>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  userList: user.userList,
  userRolesList: user.userRolesList,
  loading: loading.models.user,
}))(UserManagement);
