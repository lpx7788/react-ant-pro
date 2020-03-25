import React from 'react';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Form, Button,DatePicker, Checkbox, Row, Col, Input,message,Select} from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import moment from 'moment'
import UploadImg from '@/components/UploadImg';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { router } from 'umi';

// 主体部分
interface carouselAddProps extends ConnectProps {
  form: any,
  editAdvertisementDatas: any,
  openType: string,
  advertisementVisible: boolean,
  location:any
 
}

class CarouselAdd extends React.Component<carouselAddProps> {
  
  componentWillMount(){
    // console.log('this.props.location.state==,',this.props.location.state)
  }

  // 主题部分
  render() {
    return (
      <PageHeaderWrapper> 
        <FormItemEdit  key={('0') + Date.now()} dispatch={this.props.dispatch} editAdvertisementDatas={this.props.location.state.datas} openType={this.props.location.state.openType}  />
      </PageHeaderWrapper>
    );
  }
}

// form表单部分
interface CarouselFormState {
  coverPicType:any,
  advertisingPicture:string,
  playingTime:string,
  specifiedTimeArr:any,
  specifiedStartTime:any
  specifiedEndTime:any
  curChooseTime:any
}

interface CarouselFormProps extends ConnectProps {
  openType: string,
  form: any,
  editAdvertisementDatas: any,
  dispatch:any,
}

class FormItem extends React.Component<CarouselFormProps, CarouselFormState> {
  state: CarouselFormState = {
    coverPicType:'1',
    advertisingPicture:'',
    playingTime:'',
    specifiedTimeArr:[],
    specifiedStartTime:'',
    specifiedEndTime:'',
    curChooseTime:''
  };
  componentWillMount(){

    let specifiedTimeArr = []
    for (let i = 0; i < 24; i++) {
      specifiedTimeArr.push({key:i,value:i})
    }
    this.setState({
      specifiedTimeArr:specifiedTimeArr
    })
  }

  componentDidMount() {
    // console.log(this.props.editAdvertisementDatas)
    this.props.form.setFieldsValue({ 
      chooseTime: '1',
    })
    // console.log(this.refs);
    // this.refs.start= this.props.editAdvertisementDatas.specifiedStartTime
    // this.refs.end.value= this.props.editAdvertisementDatas.specifiedEndTime
    if(this.props.openType==='edit'){
      this.props.form.setFieldsValue({ 
        title:this.props.editAdvertisementDatas.title,
        advertisingUrl: this.props.editAdvertisementDatas.advertisingUrl,
        playingWeek: this.props.editAdvertisementDatas.playingWeek.split(','),
        chooseTime: this.props.editAdvertisementDatas.chooseTime,
        playingTime: [moment(this.props.editAdvertisementDatas.playingCreatDate),moment(this.props.editAdvertisementDatas.playingEndDate)],
      })
    }
  }
  
 // 图片或者链接
  onTypeChange(e:any){
     this.setState({
      coverPicType:e.target.value
     })
  }

  // 新增或者编辑提交
  advertisementUpdetasubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {

    let { dispatch } = this.props
    let playingTime = this.state.playingTime
    let playingWeek = values.playingWeek.join(',')
     let specifiedStartTime = this.state.specifiedStartTime
     let specifiedEndTime = this.state.specifiedEndTime
     specifiedStartTime =  specifiedStartTime<9?'0'+specifiedStartTime+':00':specifiedStartTime+':00' 
     specifiedEndTime =  specifiedEndTime<9?'0'+specifiedEndTime+':00':specifiedEndTime+':00' 
     let specifiedTime = specifiedStartTime +',' + specifiedEndTime

      if (!err && values) {
      let formData = new FormData();
      let openType = this.props.openType;
      switch(openType){
        case 'new':
          break;
        case 'edit':
          formData.append('Pid',  this.props.editAdvertisementDatas.id)
        break;
       }
     
        formData.append('title', values.title)
        formData.append('chooseTime', values.chooseTime)
        formData.append('playingTime', playingTime)
        formData.append('advertisingUrl',values.advertisingUrl)
        formData.append('advertisingPicture',this.state.advertisingPicture)
        formData.append('specifiedTime',specifiedTime) //指定时间段
        formData.append('playingWeek',playingWeek)

        if(dispatch){
          dispatch({
            type: 'advertisement/addAdvertisementRequest',
            payload:formData,
            callback:(res:any)=>{
              if(res.errorCode==='0000'){
                message.success('操作成功');
               router.push({
                 pathname:'/start-page'
               })
              }
            }
          })
        }
      }
    });
  }
  
  // 获取上传的图片
  getImageFile(urlObj:any){
    this.setState({
      advertisingPicture:urlObj[0]
    })
  }
  
  handleRangePicker(datas:any,value:any){
   this.setState({
    playingTime:value.join(',')
   })
  }

  getSpecifiedStartTime(value:string){
    this.setState({
      specifiedStartTime:value
    })
  }
  getSpecifiedEndTime(value:string){
    this.setState({
      specifiedEndTime:value
    })
  }
  chooseTimeSelect(value:any){
    // console.log(value)
    this.setState({
      curChooseTime:value
    })
  }
  // 表单部分
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{background:'#fff',padding:'20px'}}>
        <Form labelCol={{ span: 2 }} wrapperCol={{ span: 14 }} onSubmit={this.advertisementUpdetasubmit.bind(this)}>
          <Form.Item label="广告标题：">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入广告标题' }],
            })(
              <Input style={{ width: 400 }}  placeholder="请输入按钮名称"  />
          )}
          </Form.Item>
          <Form.Item label="启动页图片：" style={{marginBottom:0}}>
            {getFieldDecorator('advertisingPicture',{
              rules: [{ required: true, message: '请输入启动页图片' }],
            })(
              <div> 
                <UploadImg initPicUrl= {this.props.editAdvertisementDatas?this.props.editAdvertisementDatas.advertisingPicture:''} preview adaption card btnType="primary" btnIcon="upload"
                handleChange={this.getImageFile.bind(this)}></UploadImg>
              </div>
            )}
          </Form.Item>
          
          <Form.Item label="H5链接：">
            {getFieldDecorator('advertisingUrl')(
              <Input style={{ width: 400 }}  placeholder="请输入H5链接"  />
            )}
          </Form.Item>
    
          <Form.Item label="开始/结束日期：">
            {getFieldDecorator('playingTime',{
              rules: [{ required: true, message: '开始/结束日期' }],
            })(
              <RangePicker style={{ width: 400 }} onChange={this.handleRangePicker.bind(this)}  placeholder={['开始日期', '结束日期']} />
            )}
          </Form.Item>

          <Form.Item label="星期选择：">
            {getFieldDecorator('playingWeek', {
              rules: [{  type: "array",required: true, message: '星期选择' }],
            })(
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                <Col span={2}>
                  <Checkbox value="1">星期一</Checkbox>
                </Col>
                <Col span={2}>
                  <Checkbox value="2">星期二</Checkbox>
                </Col>
                <Col span={2}>
                  <Checkbox value="3">星期三</Checkbox>
                </Col>
                <Col span={2}>
                  <Checkbox value="4">星期四</Checkbox>
                </Col>
                <Col span={2}>
                  <Checkbox value="5">星期五</Checkbox>
                </Col>
                <Col span={2}>
                  <Checkbox value="6">星期六</Checkbox>
                </Col>
                <Col span={2}>
                  <Checkbox value="7">星期日</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            )}
          </Form.Item>

          <Form.Item label="时段选择:">
            {getFieldDecorator('chooseTime')(
              <Select  style={{ width: 400 }} onChange={this.chooseTimeSelect.bind(this)} >
                <Option value="1">全天</Option>
                <Option value="2">白天（09：00 - 21：00）</Option>
                <Option value="3">夜晚（21：00 - 00：00 和 00：00 - 09：00）</Option>
                <Option value="4">指定时段</Option>
            </Select>
            )}
          </Form.Item>
          {this.state.curChooseTime==='4'||this.props.editAdvertisementDatas.chooseTime==='4'?
          <Form.Item label="时段选择:">
            {getFieldDecorator('specifiedTime')(
              <>
                <Select
                  showSearch
                  style={{ width: 150 }}
                  placeholder="请选择开始时间"
                  value={this.state.specifiedStartTime?this.state.specifiedStartTime:this.props.editAdvertisementDatas.specifiedStartTime}
                  onChange={this.getSpecifiedStartTime.bind(this)}
                  optionFilterProp="children">
                  {
                    this.state.specifiedTimeArr ?
                    this.state.specifiedTimeArr.map((item:any)=> (
                      <Option key={item.key} value={item.value}>{item.value<9?'0'+item.value+':00':item.value+':00'}</Option>
                    )) : ''
                  }
                </Select>
                <Select
                  showSearch
                  style={{ width: 150,marginLeft:'20px' }}
                  placeholder="请选择结束时间"
                  onChange={this.getSpecifiedEndTime.bind(this)}
                  value={this.state.specifiedEndTime?this.state.specifiedEndTime:this.props.editAdvertisementDatas.specifiedEndTime}
                  optionFilterProp="children">
                  {
                    this.state.specifiedTimeArr ?
                    this.state.specifiedTimeArr.map((item:any)=> (
                      <Option key={item.key} disabled={Number(item.value)+1<=this.state.specifiedStartTime} value={Number(item.value)+1}>{item.value<9?'0'+(Number(item.value)+1)+':00':(Number(item.value)+1)+':00'}</Option>
                    )) : ''
                  }
                </Select>
            </>
            )}
          </Form.Item>:''}
          <Form.Item style={{height:'61'}}></Form.Item>
          <Form.Item style={{marginLeft:'100px'}}>
            <Button htmlType="submit" type="primary">
               确认提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );    
  }
}

const FormItemEdit: any = Form.create()(FormItem);
export default connect(({ loading }: ConnectState) => ({
}))(CarouselAdd);