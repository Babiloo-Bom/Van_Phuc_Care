export default (axios) => ({
    getAll: (params) => axios.get('/a/courses', { params }).then((_) => _.data),
    getDetail: (courseId) => axios.get(`/a/courses/${courseId}`).then((_) => _.data),
    getRecomnentCourses: (params) => axios.get('/u/courses?origin=vanphuccare.gensi.vn', { params }).then((_) => _.data),
});
