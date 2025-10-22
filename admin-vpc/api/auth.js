export default (axios) => ({
    updateProfile: (data) => axios.patch('/a/sessions', data).then((_) => _.data),

    // password
    updatePassword: (data) => axios.patch('/a/sessions/change_password', data).then((_) => _.data),
    forgotPassword: (data) => axios.post('/a/passwords/forgot_password', data).then((_) => _.data),
    verifyOtp: (data) => axios.post('/a/passwords/verify_otp', data).then((_) => _.data),
    newPassword: (email, token, data) => axios.post(`/a/passwords?email=${email}&token=${token}`, data).then((_) => _.data),

    // get infor request
    getActiveLogs: (params) => axios.get(`${process.env.API_HOST}/a/active-logs`, { params }).then((_) => _.data),
    writeLog: (data) => axios.post(`${process.env.API_HOST}/a/active-logs`, data).then((_) => _.data),
    logout: () => axios.patch(`${process.env.API_HOST}/a/active-logs/logout/`).then((_) => _.data),
    geoip: () => axios.get('https://get.geojs.io/v1/ip/geo.json').then((_) => _.data),
});
