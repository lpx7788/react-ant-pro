import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <div className="center" style={{ paddingTop: 48, paddingBottom: 24 }}>
        Copyright©.{new Date().getFullYear()} 广州众咖信息科技服务有限公司 All Rights Reserved
      </div>
    );
  }
}
