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
// ORDER DATA STRUCTURE
// ================================

/**
 * Struktur data pesanan di Firebase:
 * orders/
 *   ├── [orderId]/
 *   │   ├── orderNumber: "AMR1748115096057"
 *   │   ├── customerInfo/
 *   │   │   ├── name: "test"
 *   │   │   ├── tableNumber: "2"
 *   │   │   ├── email: "test@gmail.com" (jika login)
 *   │   │   └── userId: "uid" (jika login)
 *   │   ├── items: []
 *   │   ├── pricing/
 *   │   │   ├── subtotal: 114000
 *   │   │   ├── discount: 0
 *   │   │   ├── promoCode: ""
 *   │   │   └── total: 114000
 *   │   ├── status: "pending"
 *   │   ├── timestamps/
 *   │   │   ├── ordered: serverTimestamp()
 *   │   │   ├── confirmed: null
 *   │   │   ├── preparing: null
 *   │   │   ├── ready: null
 *   │   │   └── completed: null
 *   │   └── metadata/
 *   │       ├── source: "web"
 *   │       └── deviceInfo: {}
 */

// ================================
// ORDER FUNCTIONS
// ================================

/**
 * Generate unique order number
 * Format: AMR + timestamp
 */
function generateOrderNumber() {
    return 'AMR' + Date.now();
}

/**
 * Get user info if logged in
 */
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

/**
 * Validate order data before saving
 */
function validateOrderData(orderData) {
    const errors = [];
    
    if (!orderData.customerInfo?.name?.trim()) {
        errors.push('Nama pelanggan wajib diisi');
    }
    
    if (!orderData.customerInfo?.tableNumber?.trim()) {
        errors.push('Nomor meja wajib diisi');
    }
    
    if (!orderData.items || orderData.items.length === 0) {
        errors.push('Pesanan tidak boleh kosong');
    }
    
    if (!orderData.pricing?.total || orderData.pricing.total <= 0) {
        errors.push('Total pesanan tidak valid');
    }
    
    return errors;
}

/**
 * Create order data structure
 */
async function createOrderData(customerInfo, cartItems, pricing, promoCode = '') {
    const userInfo = await getUserInfo();
    const orderNumber = generateOrderNumber();
    
    // Process cart items
    const processedItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        notes: item.notes || '',
        category: item.category || '',
        image: item.image || ''
    }));
    
    const orderData = {
        orderNumber: orderNumber,
        customerInfo: {
            name: customerInfo.name.trim(),
            tableNumber: customerInfo.tableNumber.trim(),
            ...(userInfo && {
                email: userInfo.email,
                userId: userInfo.userId
            })
        },
        items: processedItems,
        pricing: {
            subtotal: pricing.subtotal,
            discount: pricing.discount || 0,
            promoCode: promoCode || '',
            total: pricing.total
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
    
    return orderData;
}

/**
 * Save order to Firebase
 */
async function saveOrderToFirebase(orderData) {
    try {
        // Validate data first
        const validationErrors = validateOrderData(orderData);
        if (validationErrors.length > 0) {
            throw new Error('Validation failed: ' + validationErrors.join(', '));
        }
        
        // Get reference to orders collection
        const ordersRef = ref(db, 'orders');
        
        // Push new order (auto-generates unique key)
        const newOrderRef = push(ordersRef);
        
        // Set the order data
        await set(newOrderRef, orderData);
        
        console.log('Order saved successfully:', {
            orderId: newOrderRef.key,
            orderNumber: orderData.orderNumber
        });
        
        return {
            success: true,
            orderId: newOrderRef.key,
            orderNumber: orderData.orderNumber,
            data: orderData
        };
        
    } catch (error) {
        console.error('Error saving order to Firebase:', error);
        
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
}

/**
 * Get order by ID
 */
async function getOrderById(orderId) {
    try {
        const orderRef = ref(db, `orders/${orderId}`);
        const snapshot = await get(orderRef);
        
        if (snapshot.exists()) {
            return {
                success: true,
                data: {
                    id: orderId,
                    ...snapshot.val()
                }
            };
        } else {
            return {
                success: false,
                error: 'Order not found'
            };
        }
    } catch (error) {
        console.error('Error getting order:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get orders by user ID
 */
async function getOrdersByUser(userId, limit = 10) {
    try {
        const ordersRef = ref(db, 'orders');
        const userOrdersQuery = query(
            ordersRef,
            orderByChild('customerInfo/userId'),
            equalTo(userId),
            limitToLast(limit)
        );
        
        const snapshot = await get(userOrdersQuery);
        
        if (snapshot.exists()) {
            const orders = [];
            snapshot.forEach(childSnapshot => {
                orders.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Sort by timestamp (newest first)
            orders.sort((a, b) => {
                const timeA = a.timestamps?.ordered || 0;
                const timeB = b.timestamps?.ordered || 0;
                return timeB - timeA;
            });
            
            return {
                success: true,
                data: orders
            };
        } else {
            return {
                success: true,
                data: []
            };
        }
    } catch (error) {
        console.error('Error getting user orders:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, newStatus) {
    try {
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status: ' + newStatus);
        }
        
        const orderRef = ref(db, `orders/${orderId}`);
        const updates = {
            status: newStatus,
            [`timestamps/${newStatus}`]: serverTimestamp()
        };
        
        await set(orderRef, updates);
        
        return {
            success: true,
            message: `Order status updated to ${newStatus}`
        };
        
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get order statistics for admin dashboard
 */
async function getOrderStatistics(dateRange = 'today') {
    try {
        const ordersRef = ref(db, 'orders');
        const snapshot = await get(ordersRef);
        
        if (!snapshot.exists()) {
            return {
                success: true,
                data: {
                    totalOrders: 0,
                    totalRevenue: 0,
                    statusBreakdown: {},
                    popularItems: []
                }
            };
        }
        
        const orders = [];
        const now = new Date();
        let startDate;
        
        // Define date range
        switch (dateRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(0); // All time
        }
        
        snapshot.forEach(childSnapshot => {
            const order = childSnapshot.val();
            const orderDate = new Date(order.timestamps?.ordered || 0);
            
            if (orderDate >= startDate) {
                orders.push({
                    id: childSnapshot.key,
                    ...order
                });
            }
        });
        
        // Calculate statistics
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
        
        const statusBreakdown = orders.reduce((acc, order) => {
            const status = order.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        
        // Popular items
        const itemCounts = {};
        orders.forEach(order => {
            order.items?.forEach(item => {
                const key = item.name;
                itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
            });
        });
        
        const popularItems = Object.entries(itemCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));
        
        return {
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                statusBreakdown,
                popularItems,
                dateRange
            }
        };
        
    } catch (error) {
        console.error('Error getting order statistics:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ================================
// NOTIFICATION FUNCTIONS
// ================================

/**
 * Show order success notification
 */
function showOrderSuccessNotification(orderData) {
    const notification = document.createElement('div');
    notification.className = 'order-success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="success-icon">
                <i class="fa fa-check-circle"></i>
            </div>
            <div class="success-message">
                <h4>Pesanan Berhasil Disimpan!</h4>
                <p>Order #${orderData.orderNumber} telah tersimpan di sistem</p>
                <small>Data pesanan telah dikirim ke dapur</small>
            </div>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.4s ease;
        max-width: 350px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    notification.querySelector('.success-icon').style.cssText = `
        font-size: 32px;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    notification.querySelector('.success-message h4').style.cssText = `
        margin: 0 0 5px 0;
        font-size: 16px;
        font-weight: 600;
    `;
    
    notification.querySelector('.success-message p').style.cssText = `
        margin: 0 0 3px 0;
        font-size: 14px;
        opacity: 0.9;
    `;
    
    notification.querySelector('.success-message small').style.cssText = `
        font-size: 12px;
        opacity: 0.8;
    `;
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 5000);
}

/**
 * Show order error notification
 */
function showOrderErrorNotification(error) {
    const notification = document.createElement('div');
    notification.className = 'order-error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="error-icon">
                <i class="fa fa-exclamation-triangle"></i>
            </div>
            <div class="error-message">
                <h4>Gagal Menyimpan Pesanan</h4>
                <p>${error}</p>
                <small>Silakan coba lagi atau hubungi staff</small>
            </div>
        </div>
    `;
    
    // Add styles (similar to success but red theme)
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #dc3545, #fd7e14);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(220, 53, 69, 0.3);
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.4s ease;
        max-width: 350px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Apply similar styling as success
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto hide after 7 seconds (longer for error)
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 7000);
}

// ================================
// EXPORT FUNCTIONS
// ================================

export {
    // Core order functions
    createOrderData,
    saveOrderToFirebase,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus,
    getOrderStatistics,
    
    // Utility functions
    generateOrderNumber,
    validateOrderData,
    getUserInfo,
    
    // Notification functions
    showOrderSuccessNotification,
    showOrderErrorNotification
};
