import multer from "multer";

import path from "node:path";
import crypto from "node:crypto";

const TMP_FOLDER = path.resolve(__dirname, "tmp");
const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER: multer.Options = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename: (req, file, cb) => {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}.${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};

export { TMP_FOLDER, UPLOAD_FOLDER, MULTER };
