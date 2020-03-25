import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Table } from 'antd';
import PaginationItem from '@/components/Pagination';

interface Props extends ConnectProps {
    companyCode: string
    loading: boolean
    tableData: Array<any>
    onChange: (pageNum?: number, pageSize?: number) => void
}

interface State {
    companyCode: string
    customerData: Array<any>
    tableTitle: Array<any>
}

class Customers extends React.Component<Props>{
    state: State = {
        companyCode: '',
        customerData: [],
        tableTitle: [
            { title: '公司全称', dataIndex: 'companyName', align: 'center' },
            { title: '联系人', dataIndex: 'companyContacts', align: 'center' },
            { title: '联系电话', dataIndex: 'companyContactNumber', align: 'center' },
            {
                title: '采购额度', render: (row: any) => (
                    <div>
                        {
                            row.purchaseList&&row.purchaseList!=="[]"?row.purchaseList.map((item:any,index: number) => {
                                return (<div className={(index%2==0)?styles.greyBoard:''} key={item.contractCode}>{(item.contractName?item.contractName:item.contractCode) + ': ' + item.availableQuotaNum}</div>)
                            }):""
                        }
                    </div>
                ), align: 'left'
            },
            { title: '销售额度', render: (row: any) => (
                <div>
                    {
                        row.salesList&&row.salesList!=="[]"?row.salesList.map((item:any,index: number) => {
                            return (<div className={(index%2==0)?styles.greyBoard:''} key={item.contractCode}>{item.contractName?item.contractName:item.contractCode + ':' + item.availableQuotaNum}</div>)
                        }):""
                    }
                </div>
            ), align: 'left' },
        ],
    }

    UNSAFE_componentWillMount() {

    }

    render() {

        return (
            <div className={styles.customers}>
                <Table
                    loading={this.props.loading}
                    size="middle"
                    rowKey={row => row.index}
                    bordered
                    columns={this.state.tableTitle}
                    dataSource={this.props.tableData.customers}
                    pagination={false}
                />
                <PaginationItem total={this.props.tableData.total} changePage={this.props.onChange.bind(this)} />
            </div>
        )
    }
}

export default connect(({ loading }: ConnectState) => ({
    loading: loading.models.company
}))(Customers);
