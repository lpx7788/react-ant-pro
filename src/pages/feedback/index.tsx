import React from 'react';
import styles from './style.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import PaginationItem from '@/components/Pagination';
import {Table, Button, Input } from 'antd';
const { Search } = Input;
interface FeedbackProps extends ConnectProps {
  loading: boolean;
  FeedbackDataList: any;
}

interface FeedbackState {
  parameter: object
  tableListtitle: Array<object> 
  totalPage: number
}

class Feedback extends React.Component<FeedbackProps, FeedbackState> {
  state: FeedbackState = {
    totalPage: 0, //总页数
    parameter: {
      pageNum: 1,
      pageSize: 20,
      queryKey: '',
    },
    //table标题
    tableListtitle: [
      { title: '反馈时间', width: 200, dataIndex: 'createDate', align: 'center' },
      { title: '用户姓名', width: 200, dataIndex: 'name', align: 'center' },
      { title: '手机号码', width: 200, dataIndex: 'phone', align: 'center' },
      { title: '类型', width: 200, dataIndex: 'typeName', align: 'center' },
      { title: '备注', dataIndex: 'remark', align: 'center' },
    ],
  };

  UNSAFE_componentWillMount() {
    this.getPageDatas()
  }

  getPageDatas() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'feedback/fetchDatas',
        payload: this.state.parameter
      })
    }
  }

  //setState参数值
  handleParameter(value: any, dataName: string) {
    let parameter = this.state.parameter;
    parameter[dataName] = value;
    this.setState({
      parameter: parameter,
    });
    this.getPageDatas();
  }

  //搜索
  handleSearch(val: string) {
    let value = val;
    this.handleParameter(value, 'queryKey');
  }

  //分页
  onPageChange = (e: Number) => {
    
  };

  render() {

    return (
      <div className={styles.FeedbackPpage}>
        <header className={styles.pageHeader} >
          <Search className={`mR20 ${styles.search}`} placeholder="请输入用户/手机号码" onSearch={value => this.handleSearch(value)} enterButton />
          <Button icon="download" type="primary">导出</Button>
        </header>
        <div className={`mT20 ${styles.pageContent}`}>
          <div>
            <Table<any>
              loading={this.props.loading}
              size="middle"
              pagination={false}
              rowKey={record => record.phone}
              bordered
              columns={this.state.tableListtitle}
              dataSource={this.props.FeedbackDataList.list}
            />
            <section className={`m20 ${styles.paginationBtn} ${this.state.totalPage !== 0 ? 'show' : 'hidden'}`}>
            {/* <PaginationItem total={this.props.FeedbackDataList.total} pageSize={this.state.parameter.pageSize} changePage={this.onPageChange.bind(this)}/> */}
              {/* <Pagination
                size="small"
                total={this.state.totalPage}
                onChange={this.onPageChange}
                showSizeChanger={true}
              /> */}
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ feedback, loading }: ConnectState) => ({
  FeedbackDataList: feedback.FeedbackDataList,
  loading: loading.models.feedback,
}))(Feedback);
