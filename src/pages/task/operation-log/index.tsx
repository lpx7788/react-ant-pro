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

interface  OperationLogProps extends ConnectProps {
  loading: boolean;
}

interface OperationLogState {
  parameter: any,
  operationLogTitlecolumns:Array<Object>,
}
	
class OperationLog extends React.Component<OperationLogProps, OperationLogState> {
  state: OperationLogState = {
    parameter: {},
    operationLogTitlecolumns :[
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
        dataIndex: 'params',
      },
      {
        title: '异常信息',
        key: '4',
        dataIndex:'error',
        align:'center',
        width:'300px',
      },
      {
        title: '耗时',
        key: '5',
        align:'center',
        width:'300px',
        render:(row:any)=>  <Tag className={styles.tag} color="cyan">{row.times} ms</Tag>
      },
      {
        title: '执行时间',
        key: '6',
        dataIndex: 'createTime',
        align:'center',
      },
      {
        title: '状态',
        key: '7',
        align:'center',
        render: (record: any) => record.status==='0'? <Tag className={styles.tag} color="cyan">成功</Tag>:<Tag color="red">失败</Tag>
      },
      
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
  datas={"total":155883,"rows":[{"logId":158338,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":0,"createTime":"2019-11-25 14:11:30","createTimeFrom":null,"createTimeTo":null},{"logId":158337,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":0,"createTime":"2019-11-25 14:11:25","createTimeFrom":null,"createTimeTo":null},{"logId":158336,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":1,"createTime":"2019-11-25 14:11:20","createTimeFrom":null,"createTimeTo":null},{"logId":158335,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":0,"createTime":"2019-11-25 14:11:15","createTimeFrom":null,"createTimeTo":null},{"logId":158334,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":0,"createTime":"2019-11-25 14:11:10","createTimeFrom":null,"createTimeTo":null},{"logId":158333,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":1,"createTime":"2019-11-25 14:11:05","createTimeFrom":null,"createTimeTo":null},{"logId":158332,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":1,"createTime":"2019-11-25 14:11:00","createTimeFrom":null,"createTimeTo":null},{"logId":158331,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":0,"createTime":"2019-11-25 14:10:55","createTimeFrom":null,"createTimeTo":null},{"logId":158330,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":0,"createTime":"2019-11-25 14:10:50","createTimeFrom":null,"createTimeTo":null},{"logId":158329,"jobId":11,"beanName":"testTask","methodName":"test2","params":null,"status":"1","error":"java.lang.NoSuchMethodException: cc.mrbird.febs.job.task.TestTask.test2()","times":0,"createTime":"2019-11-25 14:10:45","createTimeFrom":null,"createTimeTo":null}]}
  
  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.operationLogPage}>
          <header className={styles.pageHeader}>
            <Row>
              <Col span={20}> 
                 <span>搜索</span>
                 <Select className="mL20" defaultValue="Bean名称"  style={{ width: '10%'}} onChange={this.handleeSelectTitle}>
                    <Option value="nickname">Bean名称</Option>
                    <Option value="username">方法名称</Option>
                    <Option value="mobile">方法参数</Option>
                  </Select>
                  <Input className={`mL20 ${styles.name}`} value={this.state.parameter.userName} placeholder="请输入关键字" onChange={this.handleNameInput.bind(this)} />
                  <Button type="primary" className="mL20"  onClick={this.handleQueryPageList.bind(this)}>查询</Button>
                </Col>
            </Row>
          </header>
          
          <div className={`mT20 border ${styles.pageContent}`}>
              <Table<any> onChange={this.handleUserTableChange.bind(this)}  columns={this.state.operationLogTitlecolumns} rowKey={record => record.id} dataSource={this.datas.rows} pagination={false}/>
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
}))(OperationLog);
