import api from './api';
const baseURL = process.env.REACT_APP_API_URL + "/api";
//login request
const register = async (userData) => {
  try {
    const response = await api.post(`${baseURL}/auth/register`  , userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// register request
const login = async (userData) => {
  try {
    const response = await api.post(`${baseURL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

 

export { register, login  };
