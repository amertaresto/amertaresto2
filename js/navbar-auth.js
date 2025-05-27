// js/navbar-auth.js
// Script untuk mengelola navbar authentication state

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Elements
let userOptionElement;
let overlayMenuElement;

// Initialize navbar auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbarAuth();
});

function initializeNavbarAuth() {
    userOptionElement = document.querySelector('.User_option');
    overlayMenuElement = document.getElementById('myNav');
    
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            handleUserLoggedIn(user);
        } else {
            // User is signed out
            handleUserLoggedOut();
        }
    });
}

async function handleUserLoggedIn(user) {
    try {
        // Get user data from database
        const userRef = ref(db, 'users/' + user.uid);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        // Get display name (prioritize database name, fallback to email)
        const displayName = userData?.namaLengkap || user.displayName || user.email.split('@')[0];
        
        // Update navbar for logged in user
        updateNavbarForLoggedInUser(displayName, user.email);
        
        // Update overlay menu
        updateOverlayMenuForLoggedInUser(displayName);
        
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to basic user info
        const displayName = user.displayName || user.email.split('@')[0];
        updateNavbarForLoggedInUser(displayName, user.email);
        updateOverlayMenuForLoggedInUser(displayName);
    }
}

function handleUserLoggedOut() {
    // Update navbar for logged out user
    updateNavbarForLoggedOutUser();
    
    // Update overlay menu
    updateOverlayMenuForLoggedOutUser();
}

function updateNavbarForLoggedInUser(displayName, email) {
    if (userOptionElement) {
        userOptionElement.innerHTML = `
            <div class="user-info">
                <div class="user-greeting">
                    <i class="fa fa-user" aria-hidden="true"></i>
                    <span class="user-name">Halo, ${displayName}</span>
                </div>
                <div class="user-actions">
                    <a href="#" id="logoutBtn" class="logout-btn">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>
            <form class="form-inline">
                <a href="cart.html" class="btn nav_cart-btn" type="button">
                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                </a>
            </form>
        `;
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

function updateNavbarForLoggedOutUser() {
    if (userOptionElement) {
        userOptionElement.innerHTML = `
            <a href="login.html">
                <i class="fa fa-user" aria-hidden="true"></i>
                <span>Login</span>
            </a>
            <form class="form-inline">
                <a href="cart.html" class="btn nav_cart-btn" type="button">
                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                </a>
            </form>
        `;
    }
}

function updateOverlayMenuForLoggedInUser(displayName) {
    if (overlayMenuElement) {
        const overlayContent = overlayMenuElement.querySelector('.overlay-content');
        if (overlayContent) {
            overlayContent.innerHTML = `
                <div class="user-profile-menu">
                    <div class="user-info-overlay">
                        <i class="fa fa-user-circle" aria-hidden="true"></i>
                        <span class="user-name-overlay">${displayName}</span>
                    </div>
                    <hr style="border-color: #f4c87a; margin: 20px 0;">
                </div>
                <a href="index.html">Beranda</a>
                <a href="menu.html">Menu</a>
                <a href="blog.html">Berita Terkini</a>
                <a href="testimonial.html">Cerita Mereka di Amerta</a>
                <a href="#" id="profileBtn">Profil Saya</a>
                <a href="#" id="myOrdersBtn">Pesanan Saya</a>
                <hr style="border-color: #f4c87a; margin: 20px 0;">
                <a href="#" id="overlayLogoutBtn" class="logout-overlay">
                    <i class="fa fa-sign-out" aria-hidden="true"></i>
                    Logout
                </a>
            `;
            
            // Add event listeners
            const overlayLogoutBtn = document.getElementById('overlayLogoutBtn');
            const profileBtn = document.getElementById('profileBtn');
            const myOrdersBtn = document.getElementById('myOrdersBtn');
            
            if (overlayLogoutBtn) {
                overlayLogoutBtn.addEventListener('click', handleLogout);
            }
            
            if (profileBtn) {
                profileBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // TODO: Navigate to profile page when created
                    alert('Halaman profil akan segera tersedia!');
                });
            }
            
            if (myOrdersBtn) {
                myOrdersBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // TODO: Navigate to orders page when created
                    alert('Halaman pesanan akan segera tersedia!');
                });
            }
        }
    }
}

function updateOverlayMenuForLoggedOutUser() {
    if (overlayMenuElement) {
        const overlayContent = overlayMenuElement.querySelector('.overlay-content');
        if (overlayContent) {
            overlayContent.innerHTML = `
                <a href="index.html">Beranda</a>
                <a href="menu.html">Menu</a>
                <a href="blog.html">Berita Terkini</a>
                <a href="testimonial.html">Cerita Mereka di Amerta</a>
                <hr style="border-color: #f4c87a; margin: 20px 0;">
                <a href="login.html">
                    <i class="fa fa-sign-in" aria-hidden="true"></i>
                    Login
                </a>
                <a href="register.html">
                    <i class="fa fa-user-plus" aria-hidden="true"></i>
                    Daftar
                </a>
            `;
        }
    }
}

async function handleLogout(e) {
    e.preventDefault();
    
    // Confirm logout
    if (confirm('Apakah Anda yakin ingin logout?')) {
        try {
            await signOut(auth);
            console.log('User logged out successfully');
            
            // Show success message
            const toast = document.createElement('div');
            toast.className = 'logout-toast';
            toast.innerHTML = `
                <div class="alert alert-success" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 250px;">
                    <i class="fa fa-check-circle"></i>
                    Logout berhasil! Sampai jumpa lagi.
                </div>
            `;
            document.body.appendChild(toast);
            
            // Remove toast after 3 seconds
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Logout error:', error);
            alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
        }
    }
}

// Export functions if needed
export { handleLogout };