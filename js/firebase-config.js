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
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWXUCXt4D9Q7OLbLuzdqTiQ7sHaYKc6EA",
  authDomain: "amertarestoran.firebaseapp.com",
  projectId: "amertarestoran",
  storageBucket: "amertarestoran.firebasestorage.app",
  messagingSenderId: "1049560935168",
  appId: "1:1049560935168:web:b36dc7d71bd195378521e5",
  measurementId: "G-JPHVHRXP71"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firebase yang akan digunakan
const analytics = getAnalytics(app); // Untuk Google Analytics (opsional)
const auth = getAuth(app);           // Untuk Firebase Authentication
const db = getDatabase(app);         // Untuk Firebase Realtime Database
const storage = getStorage(app);     // Untuk Firebase Storage (upload file)
// const firestore = getFirestore(app); // Jika menggunakan Firestore

// Ekspor instance layanan agar bisa diimpor di file JavaScript lain
export { app, analytics, auth, db, storage /*, firestore */ };
