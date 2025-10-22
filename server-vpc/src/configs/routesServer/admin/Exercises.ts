import { Router } from 'express';
import ExerciseController from '@controllers/api/admin/ExerciseController';

const router = Router();

/**
 * @openapi
 * /a/exercises:
 *   get:
 *     tags:
 *      - "[ADMIN] Exercise"
 *     summary: Danh sách exercise
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
router.get('/', ExerciseController.index);

/**
 * @openapi
 * /a/exercises/{exerciseId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Exercise"
 *     summary: Xem exercise
 *     parameters:
 *      - in: "path"
 *        name: "exerciseId"
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
router.get('/:exerciseId', ExerciseController.show);

/**
 * @openapi
 * /a/exercises:
 *   post:
 *     tags:
 *      - "[ADMIN] Exercise"
 *     summary: Tạo mới exercise
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            order:
 *              type: "number"
 *              description: "Thứ tự exercise"
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
router.post('/bulk-delete', ExerciseController.deleteMany);
router.post('/', ExerciseController.create);

/**
 * @openapi
 * /a/exercises/{exerciseId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Exercise"
 *     summary: Cập nhật exercise
 *     parameters:
 *      - in: "path"
 *        name: "exerciseId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin"
 *        schema:
 *          type: "object"
 *          properties:
 *            order:
 *              type: "number"
 *              description: "Thứ tự exercise"
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
router.patch('/:exerciseId', ExerciseController.update);

/**
 * @openapi
 * /a/exercises/{exerciseId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Exercise"
 *     summary: Xóa exercise
 *     parameters:
 *      - in: "path"
 *        name: "exerciseId"
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
router.delete('/:exerciseId', ExerciseController.delete);

export default router;
