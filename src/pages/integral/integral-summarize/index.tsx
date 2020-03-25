import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Input, message } from 'antd'
import PaginationItem from '@/components/Pagination';
import apiManager from '@/services/apiManager'
import env from '@/../config/env'

const { Search } = Input;

class IntegralDetail extends React.Component<Props> {
    state = {
        searchKey: '',
        exportUrl: '',
        exportLoading: false,
    }

    componentWillMount() {
        this.setState({
            exportUrl: env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName + apiManager.integralUsers_export
        })
        this.queryIntegralUsers()
    }

    queryIntegralUsers(pageNum?: number, pageSize?: number) {
        if (this.props.dispatch) {
            this.props.dispatch({
                type: 'integral/queryIntegralUsers',
                payload: {
                    pageNum: pageNum ? pageNum : 1,
                    pageSize: pageSize ? pageSize : 20,
                    condition: this.state.searchKey,
                }
            })
        }
    }
    dateChange(date: any, dateString: string) {
        let self = this
        this.setState({
            queryTime: dateString
        },function(){
            self.queryIntegralUsers()
        })
    }
    searchChange(e:any){
        let self = this
        this.setState({
            searchKey: e.target.value 
        },function(){
            if(self.state.searchKey===""){
                self.queryIntegralUsers()
            }
        })
    }
    searchQuery(){
        this.queryIntegralUsers()
    }
    exportData(){
        let self = this
        message.info('数据导出中，请耐等候');
        this.setState({
            exportLoading: true
        })
        setTimeout(() => {
            self.setState({
                exportLoading: false
            })
        }, 1500);
    }

    render() {
        let tableTitle = [
            {
                title: '买手姓名',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
            },
            {
                title: '手机号码',
                dataIndex: 'userPhone',
                key: 'userPhone',
                align: 'center',
            },
            {
                title: '当前剩余积分',
                dataIndex: 'availableIntegral',
                key: 'availableIntegral',
                align: 'center',
            },
            {
                title: '即将获得积分',
                dataIndex: 'aboutToIntegral',
                key: 'aboutToIntegral',
                align: 'center',
            },
            {
                title: '兑换使用积分',
                dataIndex: 'residueIntegral',
                key: 'residueIntegral',
                align: 'center',
            },
            {
                title: '系统扣除积分',
                dataIndex: 'systemDeduct',
                key: 'systemDeduct',
                align: 'center',
            },
            {
                title: '已兑换次数',
                dataIndex: 'num',
                key: 'num',
                align: 'center',
            }
        ]
        return (
            <PageHeaderWrapper>
                <div className={styles.integralUsers}>
                    <div className="flex-between">
                        <Search style={{ width: '300px'}} onChange={this.searchChange.bind(this)} onSearch={this.searchQuery.bind(this)} placeholder="输入手机号码、用户名搜索" enterButton/>
                        <Button type="primary" href={this.state.exportUrl} loading={this.state.exportLoading} onClick={this.exportData.bind(this)}>导出</Button>
                    </div>
                    <div className="mT20">
                        <Table<any>
                            loading={this.props.loading}
                            size="middle"
                            rowKey={row => row.id}
                            bordered
                            dataSource={this.props.tableData && this.props.tableData.list}
                            columns={tableTitle}
                            pagination={false}
                        />
                        <PaginationItem total={this.props.tableData && this.props.tableData.total} changePage={this.queryIntegralUsers.bind(this)} />
                    </div>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading, integral }: ConnectState) => ({
    tableData: integral.integralUserList,
    loading: loading.models.integral,
}))(IntegralDetail);
