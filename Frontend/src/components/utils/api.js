import axios from 'axios';
import { API_BASE } from '../../config';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    // default headers can be set here
  },
  withCredentials: true,
});

export default api;
