import CourseController from '@controllers/api/admin/CourseController';
import { Router } from 'express';
import { optionalAuth } from '@middlewares/passport';

const router = Router();

// Course routes
router.get('/', CourseController.getAllCourses);
router.post('/', CourseController.createCourse);
router.get('/id/:id', CourseController.getCourseById);

// Route này sẽ xử lý cả slug và ID (nếu là ObjectId) - CHỈ CHO GET
router.get('/:slug', optionalAuth, async (req, res, next) => {
  const { slug } = req.params;
  // Kiểm tra xem có phải ObjectId không
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
  
  if (isObjectId) {
    // Nếu là ObjectId, đổi tên param thành id để getCourseById đọc được
    req.params.id = slug;
    return CourseController.getCourseById(req, res);
  } else {
    // Nếu không phải ObjectId, gọi getCourseBySlug
    return CourseController.getCourseBySlug(req, res);
  }
});

router.put('/:slug/chapters', CourseController.updateCourseChapters);
router.put('/:id', CourseController.updateCourse);
router.patch('/:id', CourseController.updateCourse); // Thêm route PATCH
router.delete('/:id', CourseController.deleteCourse);

// Seed sample courses (no auth required for seeding)
router.post('/seed', CourseController.seedCourses);

export default router;