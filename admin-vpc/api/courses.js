export default (axios) => ({
    getAll: (params) => axios.get('/a/courses', { params }).then((_) => _.data),
    getDetail: (courseId) => axios.get(`/a/courses/${courseId}`).then((_) => _.data),
    create: (data) => axios.post('/a/courses', data).then((_) => _.data),
    update: (courseId, data) => axios.patch(`/a/courses/${courseId}`, data).then((_) => _.data),
    delete: (courseId) => axios.delete(`/a/courses/${courseId}`).then((_) => _.data),
    openCourse: (params) => axios.patch('/a/courses/open-coures', params).then((_) => _.data),

    getExercises: (id) => axios.get(`/a/exercises/${id}`).then((_) => _.data),
    createExercise: (params) => axios.post('/a/exercises/', params).then((_) => _.data),
    updateExercise: (id, params) => axios.patch(`/a/exercises/${id}`, params).then((_) => _.data),
    
    deleteLesson: (lessonId) => axios.delete(`/a/lessons/${lessonId}`).then((_) => _.data),
});
