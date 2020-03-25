import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Table } from 'antd';
// import PaginationItem from '@/components/Pagination';

interface Props extends ConnectProps {
    companyCode: string
    tableData: Array<any>
    onChange: (pageNum?: number, pageSize?: number) => void
}

interface State {
    companyCode: string
    staffsData: Array<any>
    tableTitle: Array<any>
}

class Staffs extends React.Component<Props>{
    state: State = {
        companyCode: '',
        staffsData: [],
        tableTitle: [
            { title: '员工姓名', dataIndex: 'userName', align: 'center' },
            { title: '手机号码', dataIndex: 'userPhone', align: 'center' },
            { title: '权限', dataIndex: 'roleCodeExp', align: 'center' },
            { title: '是否允许点价', dataIndex: 'allowPricingExp', align: 'center' },
            { title: '业务方向', dataIndex: 'businessDirectionExp', align: 'center' },
        ],
    }

    UNSAFE_componentWillMount() {

    }

    render() {

        return (
            <div className={styles.staffs}>
                <Table
                    loading={this.props.loading}
                    size="middle"
                    rowKey={row => row.index}
                    bordered
                    columns={this.state.tableTitle}
                    dataSource={this.props.tableData}
                    pagination={false}
                />
                {/* <PaginationItem total={this.state.tableData.total} changePage={this.queryStaffs.bind(this)} /> */}
            </div>
        )
    }
}

export default connect(({ loading }: ConnectState) => ({
    loading: loading.models.company
}))(Staffs);
