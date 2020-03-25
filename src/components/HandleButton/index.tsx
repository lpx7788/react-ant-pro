import React from 'react';
import { Button, Tooltip } from 'antd';
import styles from './index.less';

interface HandleButtonProps {
    icon?: string; //图标
    text?: string; //文案
    shapes?: string; //形状，默认圆形
    classCode?: string; //添加类名（不设置则自动匹配底色）
    title?: string; //提示文案，不设置则不显示
    mouseEnterDelay?: number; //鼠标移入后延时多少才显示，默认1秒
    handleClick?: () => void; //点击触发的事件
}

class HandleButton extends React.Component<HandleButtonProps>{
    state = {
        options: {
            'eye': 'bgMain', //查看
            'edit': 'bgMain', //修改、编辑
            'delete': 'bgRed', //删除
            'redo': 'bgGreen', //重置、修改
            'deployment-unit': 'bgCyan', //分配
            'vertical-align-top': 'bgBlueSky', //上移
            'vertical-align-bottom': 'bgGreen', //下移
            'check': 'bgGreen', //确认
            'close': 'bgRed', //关闭
            'car': 'bgBlueSky', //车
            'plus-circle': 'bgMain', //加
            'stop':'bgRed', //停止
            'key':'bgMain', //修改密码
            'logout':'bgRed', //踢出
            'down' : 'bgBlueSky'//向下
        },
    }

    componentWillMount(){
        
    }

    handle(){
        if(this.props.handleClick){
            this.props.handleClick()
        }
    }
    
    render() {
        return (
            <Tooltip title={this.props.title} mouseEnterDelay={this.props.mouseEnterDelay?this.props.mouseEnterDelay:0.5}>
                    <Button
                        size="small"
                        className={`${this.props.classCode?this.props.classCode:(this.state.options[this.props.icon?this.props.icon:0]?this.state.options[this.props.icon?this.props.icon:0]:'')}`}
                        shape={this.props.shapes?(this.props.shapes==='square'?'':this.props.shapes):"circle"}
                        onClick={this.handle.bind(this)}
                        icon={this.props.icon}
                    >
                    {this.props.text}
                    </Button>
            </Tooltip>
        );
    }
};

export default HandleButton;
