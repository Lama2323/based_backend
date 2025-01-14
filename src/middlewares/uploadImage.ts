import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

// Cấu hình multer để lưu file vào bộ nhớ (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Kiểm tra định dạng file
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG and JPG/JPEG are allowed.'));
    }
  },
});

// Middleware để upload và nén ảnh
const uploadImage = (fieldName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Sử dụng multer để upload file
    upload.single(fieldName)(req, res, async (err) => {
      if (err) {
        // Xử lý lỗi từ multer (bao gồm cả lỗi fileFilter)
        return next(err);
      }

      // Kiểm tra xem có file nào được upload không
      if (!req.file) {
        return next(new Error('No file uploaded.'));
      }

      try {
        // Nén ảnh bằng sharp
        const compressedImageBuffer = await sharp(req.file.buffer)
          .resize({ width: 800, height: 600, fit: 'inside' })
          .png({ quality: 60 }) // Nén PNG với chất lượng 80%
          .jpeg({ quality: 60 }) // Nén JPEG với chất lượng 80%
          .toBuffer();

        // Lưu buffer đã nén vào req.file.buffer để sử dụng ở middleware tiếp theo
        req.file.buffer = compressedImageBuffer;
        // Lưu filename vào req.file
        req.file.filename = `compressed-${Date.now()}-${req.file.originalname}`;
        // Tiếp tục middleware tiếp theo
        next();
      } catch (sharpError) {
        // Xử lý lỗi từ sharp
        next(sharpError);
      }
    });
  };
};

export default uploadImage;