import { Router } from 'express';
import CourseController from '@controllers/api/admin/CourseController';

const router = Router();

/**
 * @openapi
 * /a/courses:
 *   get:
 *     tags:
 *      - "[ADMIN] Course"
 *     summary: Danh sách course
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/', CourseController.index);

/**
 * @openapi
 * /a/courses/{courseId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Course"
 *     summary: Xem course
 *     parameters:
 *      - in: "path"
 *        name: "courseId"
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/:courseId', CourseController.show);

/**
 * @openapi
 * /a/courses:
 *   post:
 *     tags:
 *      - "[ADMIN] Course"
 *     summary: Tạo mới course
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            order:
 *              type: "number"
 *              description: "Thứ tự course"
 *            thumbnail:
 *              type: "string"
 *              description: ""
 *            link:
 *              type: "string"
 *              description: "Đường dẫn"
 *            title:
 *              type: "string"
 *              description: ""
 *            shortDescription:
 *              type: "string"
 *              description: ""
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.post('/', CourseController.create);

/**
 * @openapi
 * /a/courses/{courseId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Course"
 *     summary: Cập nhật course
 *     parameters:
 *      - in: "path"
 *        name: "courseId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            order:
 *              type: "number"
 *              description: "Thứ tự course"
 *            thumbnail:
 *              type: "string"
 *              description: ""
 *            link:
 *              type: "string"
 *              description: "Đường dẫn"
 *            status:
 *              type: "string"
 *              description: ""
 *              enum:
 *                - active
 *                - inactive
 *            title:
 *              type: "string"
 *              description: ""
 *            shortDescription:
 *              type: "string"
 *              description: ""
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.patch('/:courseId', CourseController.update);

/**
 * @openapi
 * /a/courses/{courseId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Course"
 *     summary: Xóa course
 *     parameters:
 *      - in: "path"
 *        name: "courseId"
 *     responses:
 *       200:
 *         description: Return data.
 *       404:
 *         description: Không tìm thấy dữ liệu
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.delete('/:courseId', CourseController.delete);

export default router;
