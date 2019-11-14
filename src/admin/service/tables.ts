/**
 * @desc service api
 */

import { baseUrl } from '@/common/config/env';
import axios from 'axios';

/**
 * 获取数据库中的所有表
 */
export const getAllTables = () => {
  return new Promise(async(resolve, reject) => {
    let res: any = await axios.get(baseUrl + '/tables/alltables');
    if (res.data.status === 200) {
      resolve(res.data.data);
    } else {
      reject(new Error('error'));
    }
  });
};

/**
 * 获取数据库中的所有表
 */
export const addTable = (params) => {
  return new Promise(async(resolve, reject) => {
    let res: any = await axios.post(baseUrl + '/tables/addTable', { params: params });
    if (res.data.status === 200) {
      resolve(res.data.data);
    } else {
      reject(new Error('error'));
    }
  });
};
/**
 * 根据表名获取表的内容和字段
 */
export const getTableMessage = (tableName) => {
  return new Promise(async(resolve, reject) => {
    let res: any = await axios.get(baseUrl + '/tables/tableMessage/' + tableName);
    if (res.data.status === 200) {
      resolve(res.data.data);
    } else {
      reject(new Error('error'));
    }
  });
};
