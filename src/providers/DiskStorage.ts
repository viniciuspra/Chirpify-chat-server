import fs from "node:fs";
import path from "node:path";

import { TMP_FOLDER, UPLOAD_FOLDER } from "../configs/upload";

export default class DiskStorage {
  async saveFile(file: string): Promise<string> {
    await fs.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOAD_FOLDER, file),
      (err) => {
        if (err) throw err;
      }
    );

    return file;
  }

  async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(UPLOAD_FOLDER, file);

    try {
      await fs.stat(filePath, (err, stats) => {
        if (err) return;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting the file: ", err);
            return;
          }

          console.log("File deleted successfully!");
        });
      });
    } catch (err) {
      console.error("Error checking the file: ", err);
    }
  }
}
