// js/cart-firebase.js
// Firebase Cart Integration for Amerta Restaurant

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Pre-fill customer name if logged in
            const customerNameField = document.getElementById('customerName');
            if (customerNameField && user.displayName) {
                customerNameField.value = user.displayName;
            }
        }
    });

    // Initialize cart display
    renderCartItems();
});

// Render cart items from localStorage
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty_cart">
                <p>Keranjang Anda kosong</p>
                <a href="menu.html" class="btn btn-primary mt-3">Lihat Menu</a>
            </div>
        `;
        updateOrderSummary();
        return;
    }

    let cartHTML = '';
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart_item" data-index="${index}">
                <div class="item_details">
                    <h5>${item.name}</h5>
                    <p class="item_price">Rp ${formatNumber(item.price)}</p>
                    ${item.notes ? `<p class="item_notes"><small>Catatan: ${item.notes}</small></p>` : ''}
                </div>
                <div class="item_controls">
                    <div class="qty_controls">
                        <button class="qty_btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="number" class="qty_input" value="${item.quantity}" readonly>
                        <button class="qty_btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove_btn" onclick="removeItem(${index})">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    updateOrderSummary();
}

// Update item quantity
window.updateQuantity = function(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

// Remove item from cart
window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
    
    // Show toast notification
    showToast('Item dihapus dari keranjang');
}

// Update order summary
function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Update subtotal display
    document.querySelector('.summary_row:nth-child(1) span:last-child').textContent = `Rp ${formatNumber(subtotal)}`;
    
    // Get discount amount
    const discountElement = document.querySelector('.summary_row:nth-child(2) span:last-child');
    const discountText = discountElement.textContent.replace(/[^0-9]/g, '');
    const discount = parseInt(discountText) || 0;
    
    // Calculate total
    const total = subtotal - discount;
    document.querySelector('.summary_row.total span:last-child').textContent = `Rp ${formatNumber(total)}`;
}

// Apply promo code
window.applyPromoCode = function() {
    const promoInput = document.querySelector('.promo_input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    const promoCodes = {
        'AMERTA10': 10000,
        'NEWCUSTOMER': 15000,
        'WEEKEND': 20000,
        'STUDENT': 8000
    };
    
    if (promoCodes[promoCode]) {
        const discount = promoCodes[promoCode];
        document.querySelector('.summary_row:nth-child(2) span:last-child').textContent = `-Rp ${formatNumber(discount)}`;
        showToast(`Kode promo berhasil! Diskon Rp ${formatNumber(discount)}`);
        updateOrderSummary();
    } else if (promoCode === '') {
        showToast('Silakan masukkan kode promo', 'error');
    } else {
        showToast('Kode promo tidak valid', 'error');
    }
}

// Process order and save to Firebase
window.processOrder = async function() {
    const customerName = document.getElementById('customerName').value.trim();
    const tableNumber = document.getElementById('tableNumber').value.trim();
    
    // Validate inputs
    if (!customerName || !tableNumber) {
        showToast('Silakan lengkapi nama dan nomor meja', 'error');
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showToast('Keranjang Anda kosong', 'error');
        return;
    }
    
    // Get order details
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountText = document.querySelector('.summary_row:nth-child(2) span:last-child').textContent;
    const discount = parseInt(discountText.replace(/[^0-9]/g, '')) || 0;
    const total = subtotal - discount;
    
    // Check if user is logged in
    const user = auth.currentUser;
    
    try {
        // Create order object
        const order = {
            customerName: customerName,
            tableNumber: tableNumber,
            items: cart,
            subtotal: subtotal,
            discount: discount,
            total: total,
            status: 'pending',
            createdAt: serverTimestamp(),
            userId: user ? user.uid : null,
            userEmail: user ? user.email : null
        };
        
        // Save to Firebase
        const ordersRef = ref(db, 'orders');
        const newOrderRef = push(ordersRef);
        await set(newOrderRef, order);
        
        // Generate order ID
        const orderId = newOrderRef.key;
        
        // Clear cart
        localStorage.removeItem('cart');
        updateCartCount();
        
        // Show success message
        showSuccessModal(orderId, customerName);
        
    } catch (error) {
        console.error('Error saving order:', error);
        showToast('Gagal memproses pesanan. Silakan coba lagi.', 'error');
    }
}

// Show success modal
function showSuccessModal(orderId, customerName) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Pesanan Berhasil!</h5>
                    </div>
                    <div class="modal-body text-center">
                        <i class="fa fa-check-circle text-success" style="font-size: 60px;"></i>
                        <h4 class="mt-3">Terima kasih, ${customerName}!</h4>
                        <p>Pesanan Anda telah diterima dengan nomor:</p>
                        <h5 class="text-primary">${orderId.substring(1, 8).toUpperCase()}</h5>
                        <p class="mt-3">Tim kami akan segera memproses pesanan Anda.</p>
                    </div>
                    <div class="modal-footer">
                        <a href="menu.html" class="btn btn-secondary">Pesan Lagi</a>
                        <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
    
    // Redirect after 5 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 5000);
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast HTML
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // Add toast to body
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show toast
    const toastElement = document.querySelector('.toast:last-child');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Format number with thousand separator
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Initialize cart count on page load
updateCartCount();
