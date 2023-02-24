import s3 from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export default async (file) => {
    const { mimetype, buffer, size } = file;
    const key = `profile/${uuidv4()}`;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
    };

    try {
        await s3.send(new PutObjectCommand(params));
        return key
    }
    catch (error) {
        console.log(error);
        return null;
    }
}