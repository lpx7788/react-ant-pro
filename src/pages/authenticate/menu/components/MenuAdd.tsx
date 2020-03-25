import React from 'react';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Drawer, Form, Button, message, Input, Select, Radio } from 'antd';
import styles from './style.less';

const { Option } = Select;

// 主体部分
interface MenuAddProps extends ConnectProps {
  form: any,
  editMenuDatas: any,
  openType: string,
  menuVisible: boolean,
  menuList: any
  handleStatusClick: (value: any) => void;
}
class MenuAdd extends React.Component<MenuAddProps> {
  // 关闭窗口
  onClose = () => {
    this.props.handleStatusClick(false);
  };

  menuTitle = (str: string) => {
    let title = '';
    const datasType = this.props.editMenuDatas.type
    switch (str) {
      case 'btn':
        title = '新增按钮'
        break
      case 'menu':
        title = '新增菜单'
        break
      case 'edit':
        title = `编辑${datasType === '0' ? '菜单' : '按钮'}信息`
        break
      case 'pre':
        title = '预览'
        break
    }

    return title
  }

  // 主题部分
  render() {
    return (
      <div className={styles.menuAdd}>
        <Drawer
          title={this.menuTitle(this.props.openType)}
          width={700}
          onClose={this.onClose}
          visible={this.props.menuVisible}>
          <FormItemEdit key={(this.props.editMenuDatas.id || '0') + Date.now()} dispatch={this.props.dispatch} curFormMenuDatas={this.props.editMenuDatas} openType={this.props.openType} chidMenuList={this.props.menuList} handleClose={this.onClose} />
        </Drawer>
      </div>
    );
  }
}

// form表单部分
interface childMenuFormState {
  typeValue:any
}

interface childMenuFormProps extends ConnectProps {
  handleClose: () => void
  openType: string,
  form: any,
  curFormMenuDatas: any,
  chidMenuList: any,
  dispatch:any
}

class FormItem extends React.Component<childMenuFormProps, childMenuFormState> {
  state: childMenuFormState = {
    typeValue: '1',
  };

  componentDidMount() {
    this.props.form.setFieldsValue({
      typeValue: this.props.curFormMenuDatas.type ? this.props.curFormMenuDatas.type : '1',
    })
    const { type } = this.props.curFormMenuDatas // 1菜單 2按鈕
    switch (type) {
      case 1:
        this.props.form.setFieldsValue({
          name: this.props.curFormMenuDatas.name,
          typeValue: `${this.props.curFormMenuDatas.type}`,
          parentId: this.props.curFormMenuDatas.parentId,
          path: this.props.curFormMenuDatas.path,
          url: this.props.curFormMenuDatas.url,
          sort: this.props.curFormMenuDatas.sort,
        })
      break;
      case 2:
        this.props.form.setFieldsValue({
          name: this.props.curFormMenuDatas.name,
          typeValue: `${this.props.curFormMenuDatas.type}`,
          parentId: this.props.curFormMenuDatas.parentId,
        })
      break;
    }
  }

  // 菜单或者按钮
  onTypeChange(e:any) {
     this.setState({
      typeValue: e.target.value,
     })
     this.props.form.setFieldsValue({
      name: '',
      parentId: '',
    })
  }

  // 新增或者编辑提交
  menuUpdetasubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      //  新增成功发起请求
      const { dispatch } = this.props
      let payload = {};
      if (!err && values) {
        // 按钮
        const { typeValue } = this.state;
         switch (typeValue) {
           case '2':
            payload = {
              id: this.props.curFormMenuDatas.id ? this.props.curFormMenuDatas.id : '',
              name: values.name,
              type: this.state.typeValue,
              parentId: values.parentId,
            }
          break;
          case '1':
            payload = {
              id: this.props.curFormMenuDatas.id ? this.props.curFormMenuDatas.id : '',
              name: values.name,
              type: this.state.typeValue,
              parentId: values.parentId,
              url: values.url,
              path: values.path,
              sort: values.sort,
            }
            break;
         }

        if (dispatch) {
          dispatch({
            type: 'menu/updateMenuRequest',
            payload,
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

  onClose() {
    this.props.handleClose()
  }

  // 表单部分
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.menuItem}>
        <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} onSubmit={this.menuUpdetasubmit.bind(this)}>
        <Form.Item label="新增类型：">
            {getFieldDecorator('typeValue', {
                  rules: [{ required: true, message: '请输入按钮类型' }],
                })(
              <Radio.Group disabled={this.props.openType === 'pre'} onChange={this.onTypeChange.bind(this)}>
                <Radio value="1">菜单</Radio>
                <Radio value="2">按钮</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {this.state.typeValue === '2' || ((this.props.openType === 'edit' || this.props.openType === 'pre') && this.props.curFormMenuDatas.type === 2) ?
              <Form.Item label="按钮名称：">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入按钮名称' }],
                })(
                    this.props.openType == 'pre' ? <span>{this.props.curFormMenuDatas.name}</span> : <Input placeholder="请输入按钮名称" />,
                )}
              </Form.Item>
            :
            this.state.typeValue === '1' || ((this.props.openType === 'edit' || this.props.openType === 'pre') && this.props.curFormMenuDatas.type === 1) ?
              <>
                <Form.Item label="菜单名称：">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入菜单名称' }],
                  })(
                    this.props.openType == 'pre' ? <span>{this.props.curFormMenuDatas.name}</span> : <Input placeholder="请输入菜单名称" />,
                  )}
                </Form.Item>
                <Form.Item label="组件地址：">
                  {getFieldDecorator('path', {
                    rules: [{ required: true, message: '请输入组件地址' }],
                  })(
                    this.props.openType == 'pre' ? <span>{this.props.curFormMenuDatas.name}</span> : <Input placeholder="请输入组件地址" />,
                  )}
                </Form.Item>
                <Form.Item label="菜单URL：">
                  {getFieldDecorator('url', {
                    rules: [{ required: true, message: '请输入菜单URL' }],
                  })(
                    this.props.openType == 'pre' ? <span>{this.props.curFormMenuDatas.name}</span> : <Input placeholder="请输入菜单URL"/>,
                  )}
                </Form.Item>
                <Form.Item label="菜单排序：">{getFieldDecorator('sort')(
                   this.props.openType == 'pre' ? <span>{this.props.curFormMenuDatas.name}</span> : <Input placeholder="请输入菜单排序"/>,
                )}</Form.Item>
              </>
              : ''
          }
        <Form.Item label="上级菜单：">{getFieldDecorator('parentId')(
           <Select
           showSearch
           style={{ width: 320 }}
           placeholder="请选择上级菜单"
           optionFilterProp="children"
           disabled={this.props.openType === 'pre'} >
           {
            this.props.chidMenuList ?
              this.props.chidMenuList.map((item:any) => (
                <Option key={item.parentId} value={item.parentId}>{item.name}</Option>
            )) : ''
           }
         </Select>,
        )}</Form.Item>
         {this.props.openType === 'pre' ? '' :
          <Form.Item style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            marginBottom: '0',
          }} wrapperCol={{ span: 24 }}>
            <Button onClick={this.onClose.bind(this)} style={{ marginRight: 8 }}>
              取消
                </Button>
            <Button htmlType="submit" type="primary">
              提交
                </Button>
          </Form.Item>}
        </Form>
      </div>
    );
  }
}

const FormItemEdit: any = Form.create()(FormItem);
export default connect(({ loading }: ConnectState) => ({
  // loading: loading.models.system,
}))(MenuAdd);
