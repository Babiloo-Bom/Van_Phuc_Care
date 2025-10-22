import path from 'path';
import multer from 'multer';
import { Request } from 'express';

const memoryStorage = multer.memoryStorage();

const questionZipStorage = multer.diskStorage({
  destination: path.join(__dirname, '../../tmp'),
  filename: (req: Request, file, callback) => {
    callback(null, `questions_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const withoutSavingUploader = multer({ storage: memoryStorage });
const questionZipUploader = multer({ storage: questionZipStorage });

export {
  withoutSavingUploader,
  questionZipUploader,
};
