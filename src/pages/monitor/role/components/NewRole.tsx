import React from 'react';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import styles from './style.less';
import { Drawer, Form, Button, Tree, Input, message } from 'antd';
const { TextArea } = Input;
const { TreeNode } = Tree;

// 主体部分
interface NewRoleProps extends ConnectProps {
  form: any,
  openType: string,
  roleVisible: boolean,
  menuTreeData: any
  roleInfoData: any
  handleStatusClick: (value: any) => void;
}
class NewRole extends React.Component<NewRoleProps> {
  // 关闭窗口
  onClose = () => {
    this.props.handleStatusClick(false);
  };

  render() {
    let openType = this.props.openType
    let titleName = ''

    switch (openType) {
      case 'new':
        titleName = '新增'
        break;
      case 'edit':
        titleName = '编辑'
        break;
      case 'permission':
        titleName = '权限分配'
        break;
    }

    return (
      <div className={styles.menuAdd}>
        <Drawer
          title={titleName}
          width={700}
          onClose={this.onClose}
          visible={this.props.roleVisible}
          className={this.props.openType}>
          <FormItemEdit openType={this.props.openType} dispatch={this.props.dispatch} key={(this.props.roleInfoData.roleId || '0') + Date.now()} roleFormInfoData={this.props.roleInfoData} menuTreeData={this.props.menuTreeData} handleClose={this.onClose} />
        </Drawer>
      </div>
    );
  }
}

// form表单部分
interface ChildFormProps extends ConnectProps {
  handleClose: () => void
  form: any,
  menuTreeData: any
  roleFormInfoData: any
  openType: string,
  dispatch:any
}

interface ChildFormState {
  expandedKeys: Array<any>
  autoExpandParent: boolean
  defaultExpandParent: boolean
  checkedKeys: Array<any>
  selectedKeys: Array<any>
}

class FormItem extends React.Component<ChildFormProps, ChildFormState> {
  state: ChildFormState = {
    expandedKeys: [],
    autoExpandParent: true,
    defaultExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
  };

  componentDidMount() {
    let openType: string = this.props.openType
    switch(openType){
      case 'pre':
        this.props.form.setFieldsValue({ //设置编辑表单默认值
          name: this.props.roleFormInfoData.name,
          remark: this.props.roleFormInfoData.remark,
        })
        this.setState({
          expandedKeys: this.props.menuTreeData.ids,
          checkedKeys: this.props.menuTreeData.ids
        })
        break;
      case 'edit' :
        this.props.form.setFieldsValue({ //设置编辑表单默认值
          name: this.props.roleFormInfoData.name,
          remark: this.props.roleFormInfoData.remark,
        })
      break;
      case 'permission':
        this.setState({
          expandedKeys: this.props.menuTreeData.ids,
          checkedKeys: this.props.menuTreeData.ids
        })
      break;
    }
  }
  
  // 新增或者修改角色或者权限分配
  roleUpdetasubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      let { dispatch } = this.props
      if (!err && values) {
        let payload = {}
        let fetchUrl = ''
        if (this.props.openType === 'permission') {
          payload = {
            roleId: this.props.roleFormInfoData.id,
            menuIds: this.state.checkedKeys
          }
          fetchUrl = 'role/rolePermissionRequest'
        } else if (this.props.openType === 'new' || this.props.openType === 'edit') {
          payload = {
            id: this.props.roleFormInfoData.id ? this.props.roleFormInfoData.id : '',
            remark: values.remark,
            name: values.name,
          }
          fetchUrl = 'role/updateRoleRequest'
        }
        // console.log(payload)
        if (dispatch) {
          dispatch({
            type: fetchUrl,
            payload: payload,
            callback: (res: any) => {
              if (res.errorCode === '0000') {
                message.success('操作成功');
                this.props.handleClose()
              }
            },
          })
        }
      }
    });
  }

  onExpand = (expandedKeys: Array<any>) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys: any) => {
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys: any, info: any) => {
    this.setState({ selectedKeys });
  };

  renderTreeNodes = (data: Array<any>) =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.name} key={item.id + ""} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.id + ""} {...item} />;
  });

  onClose(){
    this.props.handleClose()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} onSubmit={this.roleUpdetasubmit.bind(this)}>
        {this.props.openType !== 'permission' ?
          <>
            <Form.Item label="角色名称:">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入角色名称' }],
              })(
                this.props.openType == 'pre' ? <span>{this.props.roleFormInfoData.name}</span> : <Input />
              )
              }
            </Form.Item>
            <Form.Item label="角色描述：">
              {getFieldDecorator('remark', {
                rules: [{ required: true, message: '请输入角色名称' }],
              })(
                this.props.openType == 'pre' ? <span>{this.props.roleFormInfoData.remark}</span> : <TextArea />
              )}
            </Form.Item>
          </> : ''
        }
        {this.props.openType == 'pre' ?
          <div>
            <Form.Item label="创建时间：">
              {getFieldDecorator('createTime', {
                rules: [{ required: true, message: '请输入角色名称' }],
              })(
                <span>{this.props.roleFormInfoData.createTime}</span>
              )}

            </Form.Item>
            <Form.Item label="修改时间：">
              {getFieldDecorator('modifyTime', {
                rules: [{ required: true, message: '请输入角色名称' }],
              })(
                <span>{this.props.roleFormInfoData.createTime}</span>
              )}
            </Form.Item>
          </div>
          : ''
        }
        {
          this.props.openType === 'permission' ||this.props.openType == 'pre' ?
          <Form.Item label="权限选择：">{getFieldDecorator('checkedKeys')(
              <Tree
                checkable
                disabled={this.props.openType==='pre'?true:false}
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                defaultExpandParent={this.state.defaultExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}>
                {this.renderTreeNodes(this.props.menuTreeData.returnObject)}
              </Tree>
            )}</Form.Item> : ""
        }
        {this.props.openType === 'pre' ? "" :
          <Form.Item style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            marginBottom: '0'
          }} wrapperCol={{ span: 24 }}>

            <Button onClick={this.onClose.bind(this)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button htmlType="submit" type="primary">
              提交
            </Button>
          </Form.Item>
        }
      </Form>
    );
  }
}

const FormItemEdit: any = Form.create()(FormItem);

export default connect(({ loading }: ConnectState) => ({
  // menuTreeData: system.menuTreeData,
  // loading: loading.models.system,
}))(NewRole);