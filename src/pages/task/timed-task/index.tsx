import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input,Button, Row, Col, Table,Icon,Select,Dropdown,Menu ,Tag} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PaginationItem from '@/components/Pagination';
import HandleButton from '@/components/HandleButton'
const { Option } = Select;

interface TimedTaskProps extends ConnectProps {
  loading: boolean;
}

interface TimedTaskState {
  parameter: any,
  timedTaskTitlecolumns:Array<Object>,
}

class  TimedTask extends React.Component<TimedTaskProps, TimedTaskState> {
  state: TimedTaskState = {
    parameter: {},
    timedTaskTitlecolumns :[
      {
        title: 'Bean名称',
        dataIndex: 'beanName',
        key: '1',
        align:'center',
      },
      {
        title: '方法名称',
        dataIndex: 'methodName',
        key: '2',
        align:'center',
      },
      {
        title: '方法参数',
        key: '3',
        align:'center',
        dataIndex:'params'
      },
      {
        title: 'Cron表达式',
        key: '4',
        align:'center',
        width:'300px',
        dataIndex:'cronExpression'
      },
      {
        title: '备注',
        key: '5',
        align:'center',
        width:'300px',
        dataIndex:'remark'
      },
      {
        title: '状态',
        key: '6',
        align:'center',
        render: (record: any) => record.status==='0'? <Tag className={styles.tag} color="cyan">正常</Tag>:<Tag color="red">暂停</Tag>
      },
      {
        title: '创建时间',
        key: '8',
        align:'center',
        dataIndex: 'createTime',
        sorter: (a:any, b:any) => a.createTime - b.createTime,
        render: (record: any) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: '9',
        align:'center',
        dataIndex: 'createTime',
        render: (record: any) =>
        <Dropdown overlay={(
          <Menu>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                立即执行
              </a>
            </Menu.Item>
            <Menu.Item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                暂停任务
              </a>
            </Menu.Item>
          </Menu>
        )} placement="bottomCenter">
           <div><HandleButton icon="down"  /></div>
        </Dropdown>
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

  datas={"total":4,"rows":[{"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"cronExpression":"0/5 * * * * ?","status":"0","remark":"测试异常","createTime":"2018-02-26 19:15:30","createTimeFrom":null,"createTimeTo":null},{"jobId":3,"beanName":"testTask","methodName":"test","params":"hello world","cronExpression":"0/1 * * * * ?","status":"1","remark":"有参任务调度测试,每隔一秒触发","createTime":"2018-02-26 17:28:26","createTimeFrom":null,"createTimeTo":null},{"jobId":2,"beanName":"testTask","methodName":"test1","params":null,"cronExpression":"0/10 * * * * ?","status":"1","remark":"无参任务调度测试","createTime":"2018-02-25 01:06:23","createTimeFrom":null,"createTimeTo":null},{"jobId":1,"beanName":"testTask","methodName":"test","params":"mrbird","cronExpression":"0/1 * * * * ?1","status":"1","remark":"有参任务调度测试","createTime":"2018-02-25 00:26:14","createTimeFrom":null,"createTimeTo":null}]}
  
  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.timedTaskPage}>
          <header className={styles.pageHeader}>
            <Row>
              <Col span={20}> 
                 <span>搜索</span>
                 <Select className="mL20" defaultValue="Bean名称"  style={{ width: '10%'}} onChange={this.handleeSelectTitle}>
                    <Option value="nickname">Bean名称</Option>
                    <Option value="username">方法名称</Option>
                    <Option value="mobile">方法参数</Option>
                    <Option value="time">执行时间</Option>
                  </Select>
                  <Input className={`mL20 ${styles.name}`} value={this.state.parameter.userName} placeholder="请输入关键字" onChange={this.handleNameInput.bind(this)} />
                  <Button type="primary" className="mL20"  onClick={this.handleQueryPageList.bind(this)}>查询</Button>
                </Col>
            </Row>
          </header>
          <div className={`mT20 border ${styles.pageContent}`}>
              <Table<any> onChange={this.handleUserTableChange.bind(this)}  columns={this.state.timedTaskTitlecolumns} rowKey={record => record.id} dataSource={this.datas.rows} pagination={false}/>
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
}))( TimedTask);
