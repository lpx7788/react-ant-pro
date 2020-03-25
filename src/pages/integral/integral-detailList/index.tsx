import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Tooltip, Modal, Form, Input, DatePicker,message } from 'antd'
import PaginationItem from '@/components/Pagination';
import AntdRadioGroup from '@/components/AntdRadioGroup';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import apiManager from '@/services/apiManager'
import env from '@/../config/env'

const { Search } = Input;
const { RangePicker } = DatePicker;

class IntegralDetail extends React.Component<Props> {
    state = {
        tableTitle: [],
        tableMiddle: [
            {
                title: '用户手机号码',
                dataIndex: 'userPhone',
                key: 'userPhone',
                align: 'center',
            },
            {
                title: '类型',
                dataIndex: 'integralType',
                key: 'integralType',
                align: 'center',
            },
            {
                title: '相关订单号',
                dataIndex: 'integralCode',
                key: 'integralCode',
                align: 'center',
            }
        ],
        status: '1',
        groupArr: [
            { value: '1', textName: '收入明细', key: 1 },
            { value: '2', textName: '支出明细', key: 2 },
            { value: '3', textName: '即将获得明细', key: 3 },
        ],
        searchKey: '',
        queryTime: [],
        exportUrl: '',
        exportLoading: false,
    }

    componentWillMount() {
        this.setState({
            exportUrl: env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName + apiManager.integraldetail_export + '?status=1'
        })
        this.queryIntegralDetailList()
    }

    queryIntegralDetailList(pageNum?: number, pageSize?: number) {
        if (this.props.dispatch) {
            this.props.dispatch({
                type: 'integral/queryIntegralDetailList',
                payload: {
                    pageNum: pageNum ? pageNum : 1,
                    pageSize: pageSize ? pageSize : 20,
                    condition: this.state.searchKey,
                    creatDate: this.state.queryTime[0],
                    endDate: this.state.queryTime[1],
                    state: this.state.status
                }
            })
        }
    }
    tabsChange(idx: any) {
        let self = this
        this.setState({
            status: idx,
            exportUrl: env[process.env.API_ENV ? process.env.API_ENV : 'dev'].apiHostName + apiManager.integraldetail_export + '?status=' + idx
        }, function () {
            self.queryIntegralDetailList()
        })
    }
    dateChange(date: any, dateString: string) {
        let self = this
        this.setState({
            queryTime: dateString
        },function(){
            self.queryIntegralDetailList()
        })
    }
    searchChange(e:any){
        let self = this
        this.setState({
            searchKey: e.target.value 
        },function(){
            if(self.state.searchKey===""){
                self.queryIntegralDetailList()
            }
        })
    }
    searchQuery(){
        this.queryIntegralDetailList()
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
                title: this.state.status === '1' ? '收入时间' : (this.state.status === '2' ? '支出时间' : '下单时间'),
                key: 'lastupdateTime',
                render: (row: any) => moment(this.state.status === '1' ? row.lastupdateTime : (this.state.status === '2' ? row.createTime : row.createTime), ).format('YYYY-MM-DD HH:mm:ss'),
                align: 'center',
            },
            {
                title: '用户手机号码',
                dataIndex: 'userPhone',
                key: 'userPhone',
                align: 'center',
            },
            {
                title: '类型',
                // dataIndex: 'integralType',
                key: 'integralType',
                render: (row: any) => <div>{row.integralType === 1 ? '交易赠送' : (row.integralType === 2 ? '系统退还' : (row.integralType === 3 ? '积分兑换' : (row.integralType === 4 ? '其他赠送' : '系统扣除')))}</div>,
                align: 'center',
            },
            {
                title: '相关订单号',
                dataIndex: 'integralCode',
                key: 'integralCode',
                align: 'center',
            },
            {
                title: this.state.status === '1' ? '获得积分数' : (this.state.status === '2' ? '支出积分数' : '预计可获得积分数'),
                dataIndex: 'integralNum',
                key: 'integralNum',
                align: 'center',
            },
            {
                title: this.state.status === '2' ? '兑换物品' : '获得条件',
                // dataIndex: 'exchangeItemName',
                className: this.state.status !== '1' ? '' : 'hidden',
                key: 'exchangeItemName',
                render: (row: any) => {
                    return (
                        <div>
                            <div className={this.state.status === '2' ? '' : 'hidden'}>{row.exchangeItemName}</div>
                            <div className={this.state.status === '3' ? '' : 'hidden'}>{row.integralSource == '1' ? '点价下单成交获得积分' : (row.integralSource == '2' ? '确定价下单成交获得积分' : (row.integralSource == '3' ? '点价下单成交，且达到指导价获得积分' : '确定价下单成交，且达到指导价获得积分'))}</div>
                        </div>
                    )
                },
                align: 'center',
            },
            {
                title: '兑换数量',
                dataIndex: 'exchangeItemNum',
                className: this.state.status === '2' ? '' : 'hidden',
                key: 'exchangeItemNum',
                align: 'center',
            }
        ]
        return (
            <PageHeaderWrapper>
                <ConfigProvider locale={zhCN}>
                    <div className={styles.detailList}>
                        <div className="flex-between">
                            <div>
                                <AntdRadioGroup
                                    value={this.state.status}
                                    groupArr={this.state.groupArr}
                                    change={this.tabsChange.bind(this)}
                                />
                                <RangePicker style={{marginLeft: '20px'}} onChange={this.dateChange.bind(this)} />
                                <Search style={{ width: '300px',marginLeft: '20px'}} onChange={this.searchChange.bind(this)} onSearch={this.searchQuery.bind(this)} placeholder="输入积分订单号、手机号搜索" enterButton/>
                            </div>
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
                            <PaginationItem total={this.props.tableData && this.props.tableData.total} changePage={this.queryIntegralDetailList.bind(this)} />
                        </div>
                    </div>
                </ConfigProvider>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading, integral }: ConnectState) => ({
    tableData: integral.integralDetailList,
    loading: loading.models.integral,
}))(IntegralDetail);
