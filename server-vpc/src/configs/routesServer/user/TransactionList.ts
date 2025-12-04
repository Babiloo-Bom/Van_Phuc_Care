import { Router } from 'express';
import TransactionListController from '@controllers/api/user/TransactionListController';
import { userPassport } from "@middlewares/passport";

const router = Router();

router.get("/", userPassport.authenticate("jwt", { session: false }), TransactionListController.list);

export default router;
