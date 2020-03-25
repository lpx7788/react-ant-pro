import React from 'react'
import { Pagination } from 'antd';
import styles from './index.less';

interface PaginationState { //定义state的数据类型
    pageNum: number
    pageSize: number
}
interface Props { //定义props的数据类型
    total: number,
    changePage:  (value: any, dataName: any) => void;
}
export default class PaginationItem extends React.Component<Props> {
    state: PaginationState = {
        pageNum: 1,
        pageSize: 20
    }
    onChange(page:any, pageSize:any){
        this.setState({
            pageNum: page
        })
        this.props.changePage(page, pageSize)
    }
    onShowSizeChange(current:any, size:any){
        this.setState({
            pageNum: 1,
            pageSize: size
        })
        this.props.changePage(1, size)
    }
    reset(){ //重置当前页为第一页
        this.setState({
            pageNum: 1
        })
    }
    render(){
        return(
            <div className={styles.paginationItem}>
                <div className="fr">
                    <Pagination 
                    showTotal={total => `共${total}条`}
                    showSizeChanger
                    current={this.state.pageNum}
                    total={this.props.total}
                    pageSize={this.state.pageSize}
                    onChange={this.onChange.bind(this)}
                    showQuickJumper
                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                    />
                </div>
            </div>
        )
    }
}