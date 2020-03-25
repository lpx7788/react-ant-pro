import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment'
// import { Button, Tooltip, Modal, Form, Input } from 'antd'

interface Props extends ConnectProps {
    exchangeSetList: Array<any>
    tableData: Array<any>
}

class ExchangeSet extends React.Component<Props> {
    state = {
        
    }

    componentWillMount() {
        
    }

    render() {
        
        return (
            <PageHeaderWrapper>
                <div className={styles.timeSharingplan}>
                
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading }: ConnectState) => ({

}))(ExchangeSet);
