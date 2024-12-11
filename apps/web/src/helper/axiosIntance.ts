import axios from 'axios';

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
    // const accessToken = await getAccessToken();
    // if (accessToken) {
    //   config.headers.Cookie = `access_token=${accessToken.accessToken}`;
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
        // const refreshToken = await getRefreshToken();
        // if (refreshToken) {
        //   // Send POST request to refresh the token using the refresh token
        //   const res = await axiosInstance.post('auth/check-token', {
        //     refresh_token: refreshToken.refreshToken,
        //   });
        //   // Extract new access token from response
        //   const newAccessToken = res.data.data.access_token;
        //   await storeTokens(newAccessToken);

        //   // Update the original request with the new access token and retry
        //   originalRequest.headers.Cookie = `access_token=${newAccessToken}`;
        //   return axiosInstance(originalRequest); // Retry the original request
        // }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError); // Handle failed token refresh
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;