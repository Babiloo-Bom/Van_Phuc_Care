export default (axios) => ({
    vnpay: (params) => axios.post('/u/payment/vnpay?origin=vanphuccare.gensi.vn', params).then((_) => _.data),
});
