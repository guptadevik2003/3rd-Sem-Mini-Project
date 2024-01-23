import axios from 'axios';
// const baseURL = 'http://192.168.100.11:6969';
const baseURL = 'https://damn-server-production.up.railway.app';

export const AxiosServer = axios.create({ baseURL });
