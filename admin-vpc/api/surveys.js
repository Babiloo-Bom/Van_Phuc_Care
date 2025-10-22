export default (axios) => ({
    getAll: (params) => axios.get('/a/surveys', { params }).then((_) => _.data),
    getDetail: (surveyId) => axios.get(`/a/surveys/${surveyId}`).then((_) => _.data),
    create: (data) => axios.post('/a/surveys', data).then((_) => _.data),
    update: (surveyId, data) => axios.patch(`/a/surveys/${surveyId}`, data).then((_) => _.data),
    delete: (surveyId) => axios.delete(`/a/surveys/${surveyId}`).then((_) => _.data),
});
