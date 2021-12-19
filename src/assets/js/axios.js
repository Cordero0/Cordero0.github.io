import axios from "axios";
import qs from "qs";
import { message } from 'ant-design-vue';

// axios.defaults.baseURL = ''  //正式
axios.defaults.baseURL = 'https://www.fastmock.site/mock/219f2a4d01e826eeff1491024c86c2ba/servers-control' //测试
// axios.defaults.baseURL = 'http://localhost:53000' //测试

//post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
//设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status == 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
      message.error('Request error!'+error);
    }
);
export default {
    post(url, data, headers) {
        return new Promise((resolve, reject) => {
            axios({
                    method: 'post',
                    url,
                    data: qs.stringify(data),
                    headers:headers
                })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                });
        })
    },

    get(url, data, headers) {
        return new Promise((resolve, reject) => {
            axios({
                    method: 'get',
                    url,
                    params: data,
                    headers:headers
                })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};