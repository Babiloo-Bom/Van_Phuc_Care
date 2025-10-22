import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import dayjs from 'dayjs';

class UploadController {
  public async uploadFirebase (req: Request, res: Response) {
    try {
      const fileAttributes: any = [];
      const files: any[] = req.files as any[];
      await initializeApp({
        apiKey: 'AIzaSyB5KHkEd6N1mjcQDW_JAOEyul26_JL9qbo',
        authDomain: 'gensi-8df36.firebaseapp.com',
        projectId: 'gensi-8df36',
        storageBucket: 'gensi-8df36.appspot.com',
        messagingSenderId: '463049570884',
        appId: '1:463049570884:web:7f5bf4635ffcab2f865a11',
        measurementId: 'G-K0YZ0Y689Z',
      });
      const storage = await getStorage();
      for (const file of files) {
        const attribute: any = {};
        const storageRef = await ref(storage, `${dayjs().format('YYYYMMDDHHmmss')}_${file.originalname}`);
        const metadata = {
          contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        attribute.source = downloadURL;
        attribute.originalname = file.originalname;
        attribute.size = file.size;
        attribute.type = file.mimetype.split('/')[0];
        fileAttributes.push(attribute);
      }
      sendSuccess(res, { fileAttributes });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new UploadController();
