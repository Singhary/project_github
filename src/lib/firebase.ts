// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "dotenv/config";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { env } from "../env.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "gen-lang-client-0775968171.firebaseapp.com",
    projectId: "gen-lang-client-0775968171",
    storageBucket: "gen-lang-client-0775968171.firebasestorage.app",
    messagingSenderId: "879039107119",
    appId: "1:879039107119:web:bf5f24b654cc8fc24e76da",
    measurementId: "G-QCZRRP3F98"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void,
) {
  if (!file) return;

  return new Promise((resolve, reject) => {
    try {
      const uniqueFileName = `${Date.now()}.${file.name}`;
      const storageRef = ref(storage, uniqueFileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          setProgress && setProgress(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        },
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
