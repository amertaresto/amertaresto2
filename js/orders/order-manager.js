// js/orders/order-manager.js
// Order Management System dengan Firebase Integration

// Import Firebase dependencies
import { auth, db } from '../firebase-config.js';
import { 
    ref, 
    push, 
    set, 
    serverTimestamp, 
    get,
    query,
    orderByChild,
    equalTo,
    limitToLast
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// ================================
// ORDER CORE FUNCTIONS
// ================================

function generateOrderNumber() {
    return 'AMR' + Date.now();
}

async function getUserInfo() {
    const user = auth.currentUser;
    if (user) {
        try {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                return {
                    userId: user.uid,
                    email: user.email,
                    namaLengkap: snapshot.val().namaLengkap || user.displayName || 'User',
                    profileComplete: snapshot.val().profileComplete || false
                };
            }
        } catch (error) {
            console.error('Error getting user info:', error);
        }
    }
    return null;
}

function validateOrderData(orderData) {
    const errors = [];
    if (!orderData.customerInfo?.name?.trim()) errors.push('Nama pelanggan wajib diisi');
    if (!orderData.customerInfo?.tableNumber?.trim()) errors.push('Nomor meja wajib diisi');
    if (!orderData.items || orderData.items.length === 0) errors.push('Pesanan tidak boleh kosong');
    if (!orderData.pricing?.total || orderData.pricing.total <= 0) errors.push('Total pesanan tidak valid');
    return errors;
}

async function createOrderData(customerInfo, cartItems, pricing, promoCode = '') {
    const userInfo = await getUserInfo();
    const orderNumber = generateOrderNumber();

    // ✅ Pastikan nilai string agar aman diproses
    const customerName = String(customerInfo?.name ?? '').trim();
    const tableNumber = String(customerInfo?.tableNumber ?? '').trim();

    // 🛒 Proses item pesanan
    const processedItems = cartItems.map(item => ({
        id: item.id || '',
        name: item.name || '',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 0),
        notes: item.notes || '',
        category: item.category || '',
        image: item.image || ''
    }));

    return {
        orderNumber,
        customerInfo: {
            name: customerName,
            tableNumber: tableNumber,
            ...(userInfo && {
                email: userInfo.email,
                userId: userInfo.userId
            })
        },
        items: processedItems,
        pricing: {
            subtotal: Number(pricing.subtotal) || 0,
            discount: Number(pricing.discount) || 0,
            promoCode: promoCode || '',
            total: Number(pricing.total) || 0
        },
        status: 'pending',
        timestamps: {
            ordered: serverTimestamp(),
            confirmed: null,
            preparing: null,
            ready: null,
            completed: null
        },
        metadata: {
            source: 'web',
            deviceInfo: {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                language: navigator.language
            }
        }
    };
}
async function saveOrderToFirebase(orderData) {
    try {
        const validationErrors = validateOrderData(orderData);
        if (validationErrors.length > 0) throw new Error(validationErrors.join(', '));

        const newOrderRef = push(ref(db, 'orders'));
        await set(newOrderRef, orderData);

        return {
            success: true,
            orderId: newOrderRef.key,
            orderNumber: orderData.orderNumber,
            data: orderData
        };
    } catch (error) {
        console.error('Error saving order:', error);
        return { success: false, error: error.message };
    }
}

// ================================
// UI Notification Functions
// ================================

function showOrderSuccessNotification(orderData) {
    const n = document.createElement('div');
    n.className = 'order-success-notification';
    n.innerHTML = `
        <div class="notification-content">
            <div class="success-icon"><i class="fa fa-check-circle"></i></div>
            <div class="success-message">
                <h4>Pesanan Berhasil Disimpan!</h4>
                <p>Order #${orderData.orderNumber}</p>
                <small>Data pesanan telah dikirim ke dapur</small>
            </div>
        </div>`;
    n.style.cssText = `
        position:fixed;top:20px;right:20px;z-index:9999;
        background:#28a745;color:white;padding:20px;border-radius:10px;
        box-shadow:0 8px 32px rgba(40,167,69,0.3);opacity:0;transition:all .3s ease;`;
    document.body.appendChild(n);
    setTimeout(() => n.style.opacity = '1', 100);
    setTimeout(() => {
        n.style.opacity = '0';
        setTimeout(() => document.body.removeChild(n), 300);
    }, 4000);
}

function showOrderErrorNotification(errorMsg) {
    const n = document.createElement('div');
    n.className = 'order-error-notification';
    n.innerHTML = `
        <div class="notification-content">
            <div class="error-icon"><i class="fa fa-exclamation-triangle"></i></div>
            <div class="error-message">
                <h4>Gagal Menyimpan Pesanan</h4>
                <p>${errorMsg}</p>
                <small>Silakan coba lagi atau hubungi staf</small>
            </div>
        </div>`;
    n.style.cssText = `
        position:fixed;top:20px;right:20px;z-index:9999;
        background:#dc3545;color:white;padding:20px;border-radius:10px;
        box-shadow:0 8px 32px rgba(220,53,69,0.3);opacity:0;transition:all .3s ease;`;
    document.body.appendChild(n);
    setTimeout(() => n.style.opacity = '1', 100);
    setTimeout(() => {
        n.style.opacity = '0';
        setTimeout(() => document.body.removeChild(n), 400);
    }, 5000);
}

// ================================
// Cart Utility + Order Processing
// ================================

function getCart() {
    const cart = localStorage.getItem('amerta_cart');
    return cart ? JSON.parse(cart) : [];
}

function clearCart() {
    localStorage.removeItem('amerta_cart');
    const counter = document.getElementById('cartCount');
    if (counter) {
        counter.textContent = '0';
        counter.style.display = 'none';
    }
}

async function processOrder() {
    const name = document.getElementById('customerName')?.value.trim();
    const table = document.getElementById('tableNumber')?.value.trim();
    const cart = getCart();

    if (!name || !table || cart.length === 0) {
        alert('Mohon lengkapi nama, nomor meja, dan isi keranjang terlebih dahulu.');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;

    const customerInfo = { name, tableNumber };
    const pricing = { subtotal, discount: 0, total };

    try {
        const orderData = await createOrderData(customerInfo, cart, pricing);
        const result = await saveOrderToFirebase(orderData);

        if (result.success) {
            localStorage.setItem('amerta_receipt', JSON.stringify({
                orderId: result.orderId,
                orderNumber: result.orderNumber,
                customerName: name,
                tableNumber: table,
                timestamp: Date.now(),
                items: cart
            }));
            clearCart();
            showOrderSuccessNotification(orderData);
            setTimeout(() => window.location.href = 'receipt.html', 1000);
        } else {
            showOrderErrorNotification(result.error);
        }
    } catch (err) {
        console.error('Gagal proses order:', err);
        showOrderErrorNotification(err.message);
    }
}

// ================================
// Event Listener
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.order_btn');
    if (btn) btn.addEventListener('click', processOrder);
});

export {
  createOrderData,
  saveOrderToFirebase,
  showOrderSuccessNotification,
  showOrderErrorNotification,
  processOrder,
  getCart,
  clearCart
};
