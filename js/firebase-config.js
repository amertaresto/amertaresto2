// js/firebase-config.js

// Import fungsi yang dibutuhkan dari Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
// Jika Anda berencana menggunakan Firestore nanti, tambahkan:
// import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Konfigurasi Firebase untuk aplikasi web Anda
// UPDATED: Konfigurasi dari Firebase Console project amerta-f7a32
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAguNidBALkGK-86dhVUR7bJMB3UKdC_cQ",
    authDomain: "amerta-f7a32.firebaseapp.com",
    // databaseURL - URL confirmed dari Firebase Console
    // CONFIRMED: https://amerta-f7a32-default-rtdb.firebaseio.com/
    databaseURL: "https://amerta-f7a32-default-rtdb.firebaseio.com/", // URL sudah benar ✅
    projectId: "amerta-f7a32",
    storageBucket: "amerta-f7a32.firebasestorage.app",
    messagingSenderId: "23304695835",
    appId: "1:23304695835:web:7e761d0590a918b64fc8be"
    // measurementId akan ditambahkan jika Google Analytics diaktifkan
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firebase yang akan digunakan
const analytics = getAnalytics(app); // Untuk Google Analytics (opsional)
const auth = getAuth(app);             // Untuk Firebase Authentication
const db = getDatabase(app);           // Untuk Firebase Realtime Database
const storage = getStorage(app);       // Untuk Firebase Storage (upload file)
// const firestore = getFirestore(app); // Jika menggunakan Firestore

// Ekspor instance layanan agar bisa diimpor di file JavaScript lain
export { app, analytics, auth, db, storage /*, firestore */ };