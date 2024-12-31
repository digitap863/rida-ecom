import "dotenv/config";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";


const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESSKEYID,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESSKEY,
    },
});

export const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now()}>${file.originalname}`);
            // cb(null, `products/${Date.now()}_${file.originalname}`);
        },
    }),
    limits: {
        fieldSize: 20 * 1024 * 1024, // 20MB for text fields
        fileSize: 10 * 1024 * 1024    // 10MB for files
    }
});
export const deleteFile = async (filename) => {
    try {
        const deleteParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
        };
        const result = await s3.send(new DeleteObjectCommand(deleteParams));
        return result;
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};