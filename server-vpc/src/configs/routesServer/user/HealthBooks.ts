import { Router } from 'express';
import multer from "multer";
import HealthBookController from "@controllers/api/user/HealthBookController";
import { userPassport } from "@middlewares/passport";

const router = Router();

// All routes require authentication
const auth = userPassport.authenticate("jwt", { session: false });

// Configure multer for memory storage (avatar upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Get user's healthbooks
router.get("/", auth, HealthBookController.index);

// Create new healthbook (with optional avatar upload)
router.post("/", auth, upload.single("avatar"), HealthBookController.create);

// Get current user's healthbook (must be before /:id to match first)
router.get("/me", auth, HealthBookController.getCurrentHealthBook);

// Update healthbook (with optional avatar upload)
router.patch("/:id", auth, upload.single("avatar"), HealthBookController.update);

// Get healthbook detail by ID
router.get('/:id', auth, HealthBookController.show);

// Get all records for a healthbook (also handles date query param)
router.get('/:id/records', auth, (req, res) => {
  // If date query param exists, route to getRecordByDate
  if (req.query.date) {
    return HealthBookController.getRecordByDate(req, res);
  }
  return HealthBookController.getRecords(req, res);
});

// Get list of record dates for a given range (YYYY-MM-DD strings)
router.get('/:id/records/dates', auth, HealthBookController.getRecordDates);

// Create or update record (upsert by date)
router.post('/:id/records', auth, HealthBookController.upsertRecord);

// Delete record
router.delete('/:id/records/:recordId', auth, HealthBookController.deleteRecord);

export default router;
