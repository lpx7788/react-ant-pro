/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { Base64 } from 'js-base64';
// import env from '../../config/env';
import device from '@/utils/device';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    // const errorText = codeMessage[response.status] || response.statusText;
    // const { status, url } = response;
    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
  } else if (!response) {
    // notification.error({
    //   description: '您的网络发生异常，无法连接服务器',
    //   message: '网络异常',
    // });
  }
  return response;
};

const client = Base64.encode(`${device.clientId}:${device.clientSecret}`);
const request = extend({
  // prefix:process.env.API_ENV?env[process.env.API_ENV].apiHostName:'',
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 50000,
});

request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  const headers = {
    // 'Content-Type': 'application/json;charset=UTF-8',
    Authorization: token ? `Bearer ${token}` : `Basic ${client}`,
    access_token: 'b9ed03821a8f4e08929282ba4f71c893_e93df35aeec7438386135ef54db09914',
    version: 'localhost1',
  };
  return {
    url,
    options: { ...options, headers },
  };
});

request.interceptors.response.use(async (response, options) => {
  const data = response ? await response.clone().json() : '';
  if (data.errorCode && data.errorCode === 0) {
    return response;
  }
    // notification.error({
    //   message: '错误',
    //   description: data.errorMsg,
    // });
    return response;
});
export default request;
