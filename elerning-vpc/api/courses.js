export default (axios) => ({
    getAll: (params) => axios.get('/u/courses?origin=vanphuccare.gensi.vn', { params }).then((_) => _.data),
    getMyCourse: (params) => axios.get('/a/courses', { params }).then((_) => _.data),
    getReviews: (courseId) => axios.get(`/u/feedbacks?courseId=${courseId}&origin=vanphuccare.gensi.vn`).then((_) => _.data),
    getDetail: (courseId) => axios.get(`/u/courses/${courseId}?origin=vanphuccare.gensi.vn`).then((_) => _.data),
    getProcessing: (courseId) => axios.get(`/a/processings/${courseId}?origin=vanphuccare.gensi.vn`).then((_) => _.data),
    getChapter: (data) => axios.post('/u/courses/chapter', data).then((_) => _.data),
    create: (data) => axios.post('/u/courses', data).then((_) => _.data),
    update: (courseId, data) => axios.patch(`/u/courses/${courseId}`, data).then((_) => _.data),
    delete: (courseId) => axios.delete(`/u/courses/${courseId}`).then((_) => _.data),
});
