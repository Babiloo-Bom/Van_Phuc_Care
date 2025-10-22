export default (axios) => ({
    updateProfile: (data) => axios.patch('/a/sessions', data).then((_) => _.data),

    // password
    updatePassword: (data) => axios.patch('/a/sessions/change_password', data).then((_) => _.data),
    forgotPassword: (data) => axios.post('/a/sessions/forgot_password', data).then((_) => _.data),
    verifyOtp: (data) => axios.post('/a/sessions/verify_otp', data).then((_) => _.data),
    newPassword: (data) => axios.post('/a/sessions/reset_password', data).then((_) => _.data),
});
