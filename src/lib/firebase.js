// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD2aHJuAtdRDlAsZEGfWb3uUcSn_IkEvsk",
    authDomain: "food-forum-5c4b9.firebaseapp.com",
    projectId: "food-forum-5c4b9",
    storageBucket: "food-forum-5c4b9.appspot.com",
    messagingSenderId: "261737728876",
    appId: "1:261737728876:web:8c140ab5443b13d1d44149",
    measurementId: "G-N120J7WN36"
};

const app = initializeApp(firebaseConfig);

// Only import analytics in browser
let analytics = null;
if (typeof window !== "undefined") {
    import("firebase/analytics").then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
    });
}

export const storage = getStorage(app); 