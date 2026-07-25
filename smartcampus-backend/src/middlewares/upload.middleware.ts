import multer from 'multer';
import { AppError } from '../utils/AppError';

const imageStorage = multer.memoryStorage();

const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new AppError('Only image files are allowed', 400));
    return;
  }
  cb(null, true);
};

const profileImageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('profileImage');

export const uploadStudentImage = profileImageUpload;
export const uploadFacultyImage = profileImageUpload;

const spreadsheetStorage = multer.memoryStorage();

const spreadsheetFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/csv',
  ];
  const isSpreadsheet =
    allowed.includes(file.mimetype) || /\.(xlsx|xls|csv)$/i.test(file.originalname);

  if (!isSpreadsheet) {
    cb(new AppError('Only Excel (.xlsx, .xls) or CSV files are allowed', 400));
    return;
  }
  cb(null, true);
};

const importUpload = multer({
  storage: spreadsheetStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: spreadsheetFilter,
}).single('file');

export const uploadStudentImport = importUpload;
export const uploadFacultyImport = importUpload;
