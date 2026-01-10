import { Router } from 'express';
import BannerController from '@controllers/api/admin/BannerController';

const router = Router();

/**
 * @openapi
 * /a/banners:
 *   get:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Danh sách banner
 *     parameters:
 *      - in: "query"
 *        name: "page"
 *      - in: "query"
 *        name: "limit"
 *      - in: "query"
 *        name: "pageType"
 *        description: "all-courses hoặc my-courses"
 *      - in: "query"
 *        name: "status"
 *        description: "active hoặc inactive"
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get('/', BannerController.index);

/**
 * @openapi
 * /a/banners/{bannerId}:
 *   get:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Xem chi tiết banner
 *     parameters:
 *      - in: "path"
 *        name: "bannerId"
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
router.get('/:bannerId', BannerController.show);

/**
 * @openapi
 * /a/banners:
 *   post:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Tạo mới banner
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin banner"
 *        schema:
 *          type: "object"
 *          properties:
 *            page:
 *              type: "string"
 *              enum: ["all-courses", "my-courses"]
 *            title:
 *              type: "string"
 *            image:
 *              type: "string"
 *            url:
 *              type: "string"
 *            order:
 *              type: "number"
 *            status:
 *              type: "string"
 *              enum: ["active", "inactive"]
 *     responses:
 *       200:
 *         description: Return data.
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.post('/', BannerController.create);

/**
 * @openapi
 * /a/banners/{bannerId}:
 *   patch:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Cập nhật banner
 *     parameters:
 *      - in: "path"
 *        name: "bannerId"
 *      - in: "body"
 *        name: "body"
 *        description: "Thông tin banner"
 *        schema:
 *          type: "object"
 *          properties:
 *            page:
 *              type: "string"
 *              enum: ["all-courses", "my-courses"]
 *            title:
 *              type: "string"
 *            image:
 *              type: "string"
 *            url:
 *              type: "string"
 *            order:
 *              type: "number"
 *            status:
 *              type: "string"
 *              enum: ["active", "inactive"]
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
router.patch('/:bannerId', BannerController.update);

/**
 * @openapi
 * /a/banners/{bannerId}:
 *   delete:
 *     tags:
 *      - "[ADMIN] Banners"
 *     summary: Xoá banner
 *     parameters:
 *      - in: "path"
 *        name: "bannerId"
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
router.delete('/:bannerId', BannerController.delete);

export default router;

