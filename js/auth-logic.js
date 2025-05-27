// js/auth-logic.js

// Impor instance auth dan db dari firebase-config.js
import { auth, db } from './firebase-config.js';

// Impor fungsi Firebase Authentication yang dibutuhkan
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    // Anda mungkin juga memerlukan updateProfile jika ingin langsung set displayName saat registrasi
    // import { updateProfile } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Impor fungsi Firebase Realtime Database yang dibutuhkan untuk menyimpan data pengguna
import { ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// --- LOGIKA UNTUK HALAMAN LOGIN (login.html) ---
const loginForm = document.getElementById('loginForm');
const loginErrorDiv = document.getElementById('loginError'); // Pastikan elemen ini ada di login.html

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah form submit default

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Sembunyikan pesan error sebelumnya
        if (loginErrorDiv) loginErrorDiv.style.display = 'none';

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Login berhasil
                const user = userCredential.user;
                console.log("User logged in:", user.uid, user.email);

                // Redirect ke halaman utama atau halaman profil setelah login
                // Anda bisa menyimpan halaman sebelumnya di localStorage jika ingin redirect kembali
                window.location.href = 'index.html';
            })
            .catch((error) => {
                // Login gagal
                console.error("Login error:", error.code, error.message);
                if (loginErrorDiv) {
                    let errorMessage = "Login gagal. Periksa email dan password Anda.";
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                        errorMessage = "Email atau password salah.";
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = "Format email tidak valid.";
                    }
                    loginErrorDiv.textContent = errorMessage;
                    loginErrorDiv.style.display = 'block';
                }
            });
    });
}

// --- LOGIKA UNTUK HALAMAN REGISTER (register.html) ---
const registerForm = document.getElementById('registerForm');
const registerErrorDiv = document.getElementById('registerError');     // Pastikan elemen ini ada
const registerSuccessDiv = document.getElementById('registerSuccess'); // Pastikan elemen ini ada

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah form submit default

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Sembunyikan pesan sebelumnya
        if (registerErrorDiv) registerErrorDiv.style.display = 'none';
        if (registerSuccessDiv) registerSuccessDiv.style.display = 'none';

        // Validasi input sederhana
        if (!name || !email || !password || !confirmPassword) {
            if (registerErrorDiv) {
                registerErrorDiv.textContent = "Semua field wajib diisi!";
                registerErrorDiv.style.display = 'block';
            }
            return;
        }
        if (password !== confirmPassword) {
            if (registerErrorDiv) {
                registerErrorDiv.textContent = "Password dan konfirmasi password tidak cocok!";
                registerErrorDiv.style.display = 'block';
            }
            return;
        }
        if (password.length < 6) {
            if (registerErrorDiv) {
                registerErrorDiv.textContent = "Password minimal 6 karakter!";
                registerErrorDiv.style.display = 'block';
            }
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Registrasi berhasil
                const user = userCredential.user;
                console.log("User registered:", user.uid, user.email);

                // Tunggu sedikit untuk memastikan auth state ready
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Pastikan user masih authenticated
                if (!auth.currentUser) {
                    throw new Error("Authentication state lost");
                }

                // Opsional: Update profil pengguna di Firebase Authentication (misal, nama tampilan)
                // updateProfile(user, { displayName: name })
                //  .then(() => console.log("Display name updated in Auth"))
                //  .catch((error) => console.error("Error updating display name in Auth:", error));

                try {
                    // Simpan data pengguna tambahan ke Realtime Database
                    // Data harus sesuai dengan validation rules: namaLengkap, email wajib ada
                    const userRef = ref(db, 'users/' + user.uid);
                    const userData = {
                        namaLengkap: name,
                        email: user.email, // Wajib untuk validation rule
                        createdAt: serverTimestamp(), // Timestamp server untuk waktu pembuatan akun
                        profileComplete: true, // Flag untuk menandai profil sudah lengkap
                        uid: user.uid // Tambahkan untuk debugging
                        // Tambahkan field lain jika ada dari form registrasi (misal, nomorTelepon)
                    };
                    
                    console.log("Attempting to save user data:", userData);
                    console.log("Current auth user:", auth.currentUser?.uid);
                    
                    await set(userRef, userData);
                    console.log("User data saved to Realtime Database");
                    if (registerSuccessDiv) {
                        registerSuccessDiv.textContent = "Registrasi berhasil! Anda akan diarahkan ke halaman login dalam beberapa detik.";
                        registerSuccessDiv.style.display = 'block';
                    }
                    // Kosongkan form
                    registerForm.reset();
                    // Redirect ke halaman login setelah beberapa detik
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 3000); // Tunggu 3 detik
                    
                } catch (dbError) {
                    console.error("Error saving user data to Realtime Database:", dbError);
                    console.error("Error code:", dbError.code);
                    console.error("Error message:", dbError.message);
                    
                    // User tetap terdaftar di Firebase Auth, tapi data tambahan gagal disimpan.
                    if (registerErrorDiv) {
                        let errorMessage = "Registrasi berhasil, tapi ada masalah menyimpan data profil. ";
                        
                        if (dbError.code === 'PERMISSION_DENIED') {
                            errorMessage += "Akses ditolak ke database. Silakan hubungi administrator.";
                        } else {
                            errorMessage += "Silakan coba update profil Anda nanti.";
                        }
                        
                        registerErrorDiv.textContent = errorMessage;
                        registerErrorDiv.style.display = 'block';
                    }
                }
            })
            .catch((error) => {
                // Registrasi gagal
                console.error("Registration error:", error.code, error.message);
                if (registerErrorDiv) {
                    let errorMessage = "Registrasi gagal. Silakan coba lagi.";
                    if (error.code === 'auth/email-already-in-use') {
                        errorMessage = "Email ini sudah terdaftar. Silakan gunakan email lain atau login.";
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = "Format email tidak valid.";
                    } else if (error.code === 'auth/weak-password') {
                        errorMessage = "Password terlalu lemah. Gunakan minimal 6 karakter.";
                    }
                    registerErrorDiv.textContent = errorMessage;
                    registerErrorDiv.style.display = 'block';
                }
            });
    });
}