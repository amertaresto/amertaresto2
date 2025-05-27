// js/reservasi-logic.js

// Import Firebase services
import { auth, db } from './firebase-config.js';
import { ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Handle reservasi form
const reservationForm = document.getElementById('reservationForm');
const reservationStatus = document.getElementById('reservationStatus');

if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check if user is logged in
        if (!auth.currentUser) {
            showStatus('error', 'Anda harus login terlebih dahulu untuk membuat reservasi. <a href="login.html">Login di sini</a>');
            return;
        }

        // Get form data
        const formData = {
            nama: document.getElementById('resName').value.trim(),
            email: document.getElementById('resEmail').value.trim(),
            telepon: document.getElementById('resPhone').value.trim(),
            tanggal: document.getElementById('resDate').value,
            waktu: document.getElementById('resTime').value,
            jumlahOrang: parseInt(document.getElementById('resPax').value),
            pilihanMeja: document.getElementById('resTableChoice').value,
            permintaanKhusus: document.getElementById('resSpecialRequest').value.trim()
        };

        // Validation
        if (!formData.nama || !formData.email || !formData.telepon || 
            !formData.tanggal || !formData.waktu || !formData.jumlahOrang || 
            !formData.pilihanMeja) {
            showStatus('error', 'Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        // Validate date (tidak boleh tanggal yang sudah lewat)
        const reservationDate = new Date(formData.tanggal + 'T' + formData.waktu);
        const now = new Date();
        if (reservationDate <= now) {
            showStatus('error', 'Tanggal dan waktu reservasi harus di masa mendatang!');
            return;
        }

        try {
            showStatus('info', 'Sedang memproses reservasi...');

            // Create reservation data that matches our validation rules
            const reservationData = {
                userId: auth.currentUser.uid, // Required by security rules
                nama: formData.nama,          // Required by validation rules
                email: formData.email,        // Required by validation rules
                telepon: formData.telepon,
                tanggal: formData.tanggal,    // Required by validation rules
                waktu: formData.waktu,        // Required by validation rules
                jumlahOrang: formData.jumlahOrang, // Required by validation rules
                pilihanMeja: formData.pilihanMeja,
                permintaanKhusus: formData.permintaanKhusus,
                status: 'pending', // pending, confirmed, cancelled
                createdAt: serverTimestamp(),
                userEmail: auth.currentUser.email // Untuk referensi
            };

            // Push to database (generates unique key)
            const reservationsRef = ref(db, 'reservations');
            const newReservationRef = push(reservationsRef);
            
            await set(newReservationRef, reservationData);

            // Success
            showStatus('success', 
                `Reservasi berhasil dibuat! ID Reservasi: ${newReservationRef.key}. ` +
                'Kami akan menghubungi Anda untuk konfirmasi.'
            );
            reservationForm.reset();

        } catch (error) {
            console.error('Reservation error:', error);
            let errorMessage = 'Gagal membuat reservasi. Silakan coba lagi.';
            
            if (error.code === 'PERMISSION_DENIED') {
                errorMessage = 'Akses ditolak. Pastikan Anda sudah login dengan benar.';
            }
            
            showStatus('error', errorMessage);
        }
    });
}

// Show status messages
function showStatus(type, message) {
    if (reservationStatus) {
        const className = type === 'success' ? 'alert-success' : 
                         type === 'error' ? 'alert-danger' : 'alert-info';
        
        reservationStatus.innerHTML = `<div class="alert ${className}">${message}</div>`;
        reservationStatus.scrollIntoView({ behavior: 'smooth' });
        
        // Auto hide after 5 seconds for success/info messages
        if (type !== 'error') {
            setTimeout(() => {
                reservationStatus.innerHTML = '';
            }, 5000);
        }
    }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    const authRequiredElements = document.querySelectorAll('.auth-required');
    const loginPromptElements = document.querySelectorAll('.login-prompt');
    
    if (user) {
        // User logged in
        authRequiredElements.forEach(el => el.style.display = 'block');
        loginPromptElements.forEach(el => el.style.display = 'none');
        
        // Pre-fill email if available
        const emailField = document.getElementById('resEmail');
        if (emailField && !emailField.value) {
            emailField.value = user.email;
        }
    } else {
        // User not logged in
        authRequiredElements.forEach(el => el.style.display = 'none');
        loginPromptElements.forEach(el => el.style.display = 'block');
    }
});

// Export functions if needed
export { showStatus };