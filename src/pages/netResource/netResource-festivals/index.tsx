import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment'
import { Button, Tooltip, Modal, Form, Input, Calendar } from 'antd'

interface Props extends ConnectProps {
    exchangeSetList: Array<any>
    tableData: Array<any>
}

class ExchangeSet extends React.Component<Props> {
    state = {

    }

    componentWillMount() {
        
    }

    dateCellRender(value:any){ //自定义渲染日期单元格，返回内容会被追加到单元格
        // console.log(value.date())
    }
    dateChange(value:any){ //日期变化回调
        console.log(value)
    }

    render() {
        
        return (
            <PageHeaderWrapper>
                <ConfigProvider locale={zhCN}>
                    <div className={styles.festivals}>
                        <Calendar dateCellRender={this.dateCellRender.bind(this)} onChange={this.dateChange.bind(this)}/>
                    </div>
                </ConfigProvider>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading }: ConnectState) => ({

}))(ExchangeSet);
