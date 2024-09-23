import { logout } from '../slices/authSlice';

export const performLogout = () => (dispatch) => {
  localStorage.removeItem('token');
  
  dispatch(logout());
};
