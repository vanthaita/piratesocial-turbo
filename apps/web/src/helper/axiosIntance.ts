import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router'; // assuming you are using Next.js for routing

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 30000,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    // const accessToken = await Cookies.get('access_token');
    // if (accessToken) {
    //   config.headers.Cookie = `access_token=${accessToken}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    const originalRequest = config;
    // Check if the response is 401 (Unauthorized) and retry flag is not set
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Get the refresh token
        const refreshToken = await Cookies.get('refresh_token');
        if (refreshToken) {
          // Send POST request to refresh the token using the refresh token
          const res = await axiosInstance.post('auth/check-token', {
            refresh_token: refreshToken,
          });
          // Extract new access token from response
          const newAccessToken = res.data.data.access_token;
          await Cookies.set('access_token', newAccessToken);
          originalRequest.headers.Cookie = `access_token=${newAccessToken}`;
          return axiosInstance(originalRequest); // Retry the original request with new token
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        const router = useRouter(); 
        router.push('/'); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Reject for other errors
  }
);

export default axiosInstance;
