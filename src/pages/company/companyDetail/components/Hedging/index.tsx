import React from 'react';
import { Radio, Button, Table, Icon, Menu, Dropdown } from 'antd';
import { ConnectState, ConnectProps } from '@/models/connect';
import { connect } from 'dva';
import styles from './index.less';
import RcViewer from 'rc-viewer';

interface Props extends ConnectProps {}

const tableManageMenu = (
  <Menu>
    <Menu.Item>停止使用</Menu.Item>
    <Menu.Item>恢复使用</Menu.Item>
    <Menu.Item>修改账户</Menu.Item>
  </Menu>
);
const tableProportionMenu = (
  <Menu>
    <Menu.Item>编辑</Menu.Item>
    <Menu.Item>删除</Menu.Item>
    <Menu.Item>设置策略</Menu.Item>
  </Menu>
);
class Hedging extends React.Component<Props> {
  state = {
    hedgingUrl: '',
    hedgingFile: null,
    tableManageTitle: [
      { title: '期货公司', dataIndex: 'id', align: 'center' },
      { title: '账户', dataIndex: 'companyName', align: 'center' },
      { title: '席位', dataIndex: 'companyIdentityName', align: 'center' },
      { title: '账户审核状态', dataIndex: 'userName', align: 'center' },
      { title: '连接情况', dataIndex: 'createDate', align: 'center' },
      { title: '账户使用状态', dataIndex: 'companyStatusName', align: 'center' },
      { title: '修改时间', dataIndex: 'companyStatusName', align: 'center' },
      {
        title: '操作',
        width: 100,
        render: (row: any) => (
          <Dropdown overlay={tableManageMenu}>
            <a className="ant-dropdown-link" href="#">
              操作
              <Icon type="down" />
            </a>
          </Dropdown>
        ),
        align: 'center',
      },
    ],
    tableProportionTitle: [
      { title: '套保品种', dataIndex: 'id', align: 'center' },
      { title: '采购保值比例', dataIndex: 'companyName', align: 'center' },
      { title: '销售保值比例', dataIndex: 'companyIdentityName', align: 'center' },
      { title: '套保账户', dataIndex: 'userName', align: 'center' },
      { title: '状态', dataIndex: 'createDate', align: 'center' },
      {
        title: '操作',
        width: 100,
        render: (row: any) => (
          <Dropdown overlay={tableProportionMenu}>
            <a className="ant-dropdown-link" href="#">
              操作
              <Icon type="down" />
            </a>
          </Dropdown>
        ),
        align: 'center',
      },
    ],
  };

  uploadHedging() {
    if (this.refs.uploadLicense) {
      this.refs.uploadLicense.click();
    }
  }
  uploadPic(e: any) {
    //上传
    let self = this;
    let file = e.target.files[0];
    //创建读取文件对象
    let reader = new FileReader();
    //读取文件
    reader.readAsDataURL(file);
    //在回调函数中修改Img的src属性
    reader.onload = function() {
      self.setState({
        hedgingUrl: reader.result,
        hedgingFile: file,
      });
    };
  }
  loadImage(file: any) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function() {
        let dataURL = reader.result;
        resolve(dataURL);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }

  render() {
    return (
      <div className={styles.hedging}>
        <div className={styles.hedgingItem}>
          <h3 className="inline">是否开通自动套保功能：</h3>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </div>
        <div className={`${styles.hedgingPic} ${styles.hedgingItem}`}>
          <h3>自动套保资料：</h3>
          <RcViewer>
            <img src={this.state.hedgingUrl} alt="" />
          </RcViewer>
          <div className="hidden">
            <input
              ref="uploadLicense"
              type="file"
              accept="image/*"
              onChange={this.uploadPic.bind(this)}
            />
          </div>
          <Button type="primary" icon="upload" onClick={this.uploadHedging.bind(this)}>
            上传
          </Button>
        </div>
        <div className={styles.hedgingItem}>
          <h3>套保账户管理</h3>
          <Table
            loading={this.props.loading}
            size="middle"
            rowKey={row => row.id}
            bordered
            columns={this.state.tableManageTitle}
            // dataSource={this.props.companyJoinData.list}
            pagination={false}
          />
        </div>
        <div className={styles.hedgingItem}>
          <h3>套保品种及比例</h3>
          <p>
            是否开启自动套保功能：
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </p>
          <Table
            loading={this.props.loading}
            size="middle"
            rowKey={row => row.id}
            bordered
            columns={this.state.tableProportionTitle}
            // dataSource={this.props.companyJoinData.list}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ loading }: ConnectState) => ({}))(Hedging);
