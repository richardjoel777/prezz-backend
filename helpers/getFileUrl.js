import s3 from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// Get file url using key

export default async (key) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    };

    try {
        const url = await s3.getSignedUrl("getObject", params);
        return url;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}