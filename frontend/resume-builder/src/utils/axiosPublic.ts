import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosPublic = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Accept": "application/json",
  },
});

export default axiosPublic;