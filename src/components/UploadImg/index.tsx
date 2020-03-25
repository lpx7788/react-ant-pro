import React from 'react'
import styles from './index.less'
import { Button, Icon,Spin } from 'antd';
import RcViewer from 'rc-viewer'
import { AnyAaaaRecord } from 'dns';

// Form表单中使用，请添加一个父级div

interface UploadImgState { //定义state的数据类型
    picUrl: string,
    picFile: any
    imgOnError: boolean
    loading: boolean
    multipleList: Array<any>
}
interface Props { //定义props的数据类型
    btnType?: any //按钮类型
    btnIcon?: string //按钮图标
    btnText?: string //按钮文案
    width?: string //容器宽度 默认100px
    height?: string //容器高度 默认100px
    preview?: any //是否可以放大预览
    accept?: string //允许上传的图片类型
    card?: any //卡片式，只能上传图片jpg、jpeg、png
    adaption?: any //图片宽高自适应，比例不变
    initPicUrl?: string //设置默认图片
    multiple?: any //多文件上传
    handleChange: (data: any) => void; //上传图片后触发，得到图片信息
}
export default class UploadImg extends React.Component<Props> {
    state: UploadImgState = {
        picUrl: '',
        picFile: null,
        imgOnError: false,
        loading: true,
        multipleList: [],
    }

    componentWillMount() {
        if (this.props.initPicUrl) {
            this.setState({
                picUrl: this.props.initPicUrl,
                imgOnError: false
            })
        }
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.initPicUrl !== this.props.initPicUrl) {
            this.setState({
                picUrl: nextProps.initPicUrl,
                imgOnError: false
            })
        }
    }

    async uploadPic(e: any) { //上传授权书、营业执照
        if(this.props.card){ //card模式显示预览图片
            let file = e.target.files[0];
            try {
                let src = await this.loadImage(file)
                this.setState({
                    picUrl: src,
                    picFile: file,
                    imgOnError: false
                })
                this.props.handleChange([file])
            } catch{ }
        }else{
            if(this.props.multiple){
                let arr = this.state.multipleList
                for(let i in e.target.files){
                    if(i!=='length'&&i!=='item') arr.push(e.target.files[i])
                }
                this.setState({
                    multipleList: arr
                })
                this.props.handleChange(arr)
            }else{
                this.setState({
                    multipleList: [e.target.files[0]]
                })
                this.props.handleChange([e.target.files[0]])
            }
        }
    }
    loadImage(file: any) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.onload = function () {
                let dataURL = reader.result
                resolve(dataURL)
            }
            reader.onerror = function () {
                reject(reader.error)
            }
            reader.readAsDataURL(file)
        })
    }
    clickUpload() {
        if (this.refs.uploadInput) {
            this.refs.uploadInput.click()
        }
    }
    onError(){
        this.setState({
            imgOnError: true,
            loading: false
        })
    }
    onLoad(){
        this.setState({
            loading: false
        })
    }
    deleteFile(idx:any){
        this.state.multipleList.splice(idx,1)
        this.setState({
            multipleList: this.state.multipleList
        })
    }

    render() {
        return (
            <div className={this.props.card?`${styles.uploadImg} inline_b`:styles.uploadImg}>
                <Spin spinning={this.state.loading}>
                    <div
                        className={this.state.picUrl === "" ? 'hidden' : `${styles.imgContent}`}
                        style={{ width: this.props.width ? this.props.width : '100px', height: this.props.height ? this.props.height : '100px' }}
                        onClick={this.props.card && !this.props.preview ? this.clickUpload.bind(this) : function () { }}>
                            <RcViewer className={!this.state.imgOnError&&this.props.preview ? '' : 'hidden'} style={{ width: this.props.width ? this.props.width : '100px', height: this.props.height ? this.props.height : '100px' }}>
                                < img src={this.state.picUrl} alt="" className={this.props.adaption ? `${styles.adaption}` : ''} onError={this.onError.bind(this)} onLoad={this.onLoad.bind(this)}/>
                            </RcViewer>
                            < img className={!this.state.imgOnError&&this.props.preview ? 'hidden' : (this.props.adaption ? `${styles.adaption}` : '')} src={this.state.picUrl} alt="" onError={this.onError.bind(this)} onLoad={this.onLoad.bind(this)}/>
                        <div className={this.state.picUrl && this.props.preview && this.props.card ? `${styles.card_btn}` : 'hidden'} onClick={this.clickUpload.bind(this)}>
                            <div className={styles.corner}></div>
                            <Icon type="edit" />
                        </div>
                        <svg className={this.state.imgOnError?styles['img_error_icon']:'hidden'} t="1573804803756" viewBox="0 0 1156 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="712" width="50" height="50"><path d="M1012.514758 0H144.472255A145.378985 145.378985 0 0 0 0 145.378985v725.383707a145.378985 145.378985 0 0 0 144.774498 145.076741H1012.514758a145.378985 145.378985 0 0 0 144.472255-145.076741v-725.383707A145.378985 145.378985 0 0 0 1012.514758 0z m72.236127 788.250295l-173.789846-222.14876a57.42621 57.42621 0 0 0-94.904368-7.253837l-126.942149 127.546635-24.4817 24.4817-50.77686 51.079103-36.269185-46.545455-172.580874-222.14876a54.101535 54.101535 0 0 0-86.743801 0l-246.025974 297.709563V145.378985a68.306966 68.306966 0 0 1 63.773317-72.538371h876.505313a77.978749 77.978749 0 0 1 72.236127 72.538371zM836.004723 249.652893a109.109799 109.109799 0 1 0 0 154.446281 109.109799 109.109799 0 0 0 0-154.446281z" fill="#A9A9A9" p-id="713"></path><path d="M687.603306 668.864227l75.560803 84.930342-147.192444 270.205431h-187.088548l211.570248-207.943329-25.690673-54.101535 72.840614-93.090909z" fill="#FFFFFF" p-id="714"></path></svg>
                    </div>
                </Spin>
                <Button className={this.props.card ? 'hidden' : ''} type={this.props.btnType} icon={this.props.btnIcon} onClick={this.clickUpload.bind(this)}>{this.props.btnText ? this.props.btnText : '上传'}</Button>
                <div className={this.state.picUrl === "" && this.props.card ? 'upload_card' : 'upload_card hidden'}>
                    <div className={styles.upload_card}>
                        <span onClick={this.clickUpload.bind(this)}>
                            <i aria-label="图标: plus" className="anticon anticon-plus">
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                                    <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
                                </svg>
                            </i>
                        </span>
                    </div>
                </div>
                <div className={styles.multiple} style={this.props.card?{display:'none'}:{}}>
                    {this.state.multipleList.map((item:any,idx:any) => {
                        return (
                            <div className={styles.multiple_item} key={idx}>
                                <span className={styles.multiple_item_l}>
                                    <Icon type="paper-clip" /><span className={styles.multiple_item_content}>{item.name}</span>
                                </span>
                                <span className={styles.multiple_item_handle}>
                                    <Icon type="delete" theme="filled" onClick={this.deleteFile.bind(this,idx)}/>
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div className="hidden">
                    <input ref="uploadInput" type="file" multiple={this.props.multiple} accept={this.props.card?'image/png,image/jpg,image/jpeg':(this.props.accept ? this.props.accept : '')} onChange={this.uploadPic.bind(this)} />
                </div>
            </div>
        )
    }
}