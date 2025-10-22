export default (axios) => ({
    updateProfile: (data) => axios.patch('/a/sessions', data).then((_) => _.data),

    // password
    updatePassword: (data) => axios.patch('/a/sessions/change_password', data).then((_) => _.data),
    forgotPassword: (data) => axios.post('/a/passwords/forgot_password', data).then((_) => _.data),
    verifyOtp: (data) => axios.post('/a/passwords/verify_otp', data).then((_) => _.data),
    newPassword: (email, token, data) => axios.post(`/a/passwords?email=${email}&token=${token}`, data).then((_) => _.data),
});
