/** *用户信息弹窗** */
import React from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Modal, Avatar, Row, Col, Icon } from 'antd';
import styles from './UserInfo.less';

interface UserInfoProps extends ConnectProps {
  userMessageStatus:boolean,
  userInfoData:any,
  handleModalClick: (value: boolean) => void;
}

 class UserInfo extends React.Component<UserInfoProps> {
  // 关闭窗口
  onClose = () => {
    this.props.handleModalClick(false);
  };

  render() {
    return (
      <Modal
        className={styles.userInfo}
        width="660px"
        title="用户信息"
        onCancel={this.onClose.bind(this)}
        visible={this.props.userMessageStatus}
        footer="">
          <Row>
            <Col span={6}>
                <div ><Avatar size={80} icon="user" /></div>
            </Col>
            <Col span={9}>
                <p><Icon type="user" />用户名：{this.props.userInfoData.nickname}</p>
                <p><Icon type="fire" />账户：{this.props.userInfoData.username}</p>
                <p><Icon type="star" />角色：{this.props.userInfoData.roleName ? this.props.userInfoData.roleName : '暂无角色'}</p>

            </Col>
            <Col span={9}>
                <p><Icon type="skin" />性别：{this.props.userInfoData.sex === '1' ? '男' : '女'}</p>
                <p><Icon type="phone"/>电话：{this.props.userInfoData.mobile ? this.props.userInfoData.mobile : '暂未绑定电话'}</p>
                <p><Icon type="clock-circle" />创建时间：{this.props.userInfoData.createTime}</p>
            </Col>
          </Row>
      </Modal>
    );
  }
}

export default connect(({ loading }: ConnectState) => ({}))(UserInfo);
