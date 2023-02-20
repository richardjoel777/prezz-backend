import admin from 'firebase-admin'
import gooogleAppCred from "../config/prezz-c204b-firebase-adminsdk-vqyt4-31876e74fc.json" assert { type: "json" };

// console.log(gooogleAppCred)

admin.initializeApp({
    credential: admin.credential.cert(gooogleAppCred)
});

export default admin.messaging()