export default (axios) => ({
    getAcessPost: (params) => axios.get('/a/analystic/access-post', { params }).then((_) => _.data),
    getAnalysticAcess: (params) => axios.get('/a/analystic/demographics', { params }).then((_) => _.data),
    getConsultations: (params) => axios.get('/a/analystic/consultations', { params }).then((_) => _.data),
    getExamination: (params) => axios.get('/a/analystic/examination-schedules', { params }).then((_) => _.data),
    getPage: (params) => axios.get('/a/analystic/pages', { params }).then((_) => _.data),
    getView: (params) => axios.get('/a/analystic/views', { params }).then((_) => _.data),
});
