// js/menu-cart.js
// Cart Management System untuk Amerta Restaurant

// ================================
// CART STORAGE MANAGEMENT
// ================================

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('amerta_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('amerta_cart', JSON.stringify(cart));
    updateCartCounters();
}

// Add item to cart
function addToCart(item) {
    let cart = getCart();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex > -1) {
        // Item exists, increment quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // New item, add to cart
        cart.push({
            id: Date.now() + Math.random(), // Unique ID
            name: item.name,
            price: parseInt(item.price),
            image: item.image,
            category: item.category,
            quantity: 1,
            notes: ''
        });
    }
    
    saveCart(cart);
    showCartNotification(item.name);
}

// Update item quantity in cart
function updateCartQuantity(itemId, newQuantity) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQuantity;
        }
        saveCart(cart);
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem('amerta_cart');
    updateCartCounters();
}

// Get cart total count
function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get cart total price
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ================================
// UI UPDATE FUNCTIONS
// ================================

// Update cart counters in navbar and footer
function updateCartCounters() {
    const count = getCartCount();
    
    // Update navbar counter
    const navbarCounter = document.getElementById('cartCount');
    if (navbarCounter) {
        navbarCounter.textContent = count;
        navbarCounter.style.display = count > 0 ? 'inline-block' : 'none';
    }
    
    // Update footer counter
    const footerCounter = document.getElementById('cartCountFooter');
    if (footerCounter) {
        footerCounter.textContent = count;
    }
    
    // Update cart button text
    const cartButton = document.querySelector('.btn-box a');
    if (cartButton && footerCounter) {
        cartButton.innerHTML = `Lihat Keranjang (<span id="cartCountFooter">${count}</span>)`;
    }
}

// Show notification when item added to cart
function showCartNotification(itemName) {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        const notificationText = notification.querySelector('.notification-text');
        if (notificationText) {
            notificationText.textContent = `${itemName} berhasil ditambahkan ke keranjang!`;
        }
        
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Show notification when quantity changes
function showQuantityChangeNotification(itemName, quantity) {
    // Create temporary notification if cart notification doesn't exist
    let notification = document.getElementById('cartNotification');
    
    if (!notification) {
        // Create notification element
        notification = document.createElement('div');
        notification.id = 'tempCartNotification';
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa fa-check-circle"></i>
                <span class="notification-text"></span>
            </div>
        `;
        document.body.appendChild(notification);
    }
    
    const notificationText = notification.querySelector('.notification-text');
    if (notificationText) {
        notificationText.textContent = `${itemName} quantity updated: ${quantity}`;
    }
    
    notification.style.backgroundColor = '#17a2b8'; // Blue for quantity change
    notification.classList.add('show');
    
    // Hide notification after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        // Reset color for next notification
        setTimeout(() => {
            notification.style.backgroundColor = '#28a745';
            // Remove temporary notification if it was created
            if (notification.id === 'tempCartNotification') {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Show notification when item removed
function showRemoveNotification(itemName) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.backgroundColor = '#dc3545'; // Red for removal
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa fa-trash"></i>
            <span class="notification-text">${itemName} dihapus dari keranjang</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2500);
}

// ================================
// MENU FILTERING
// ================================

// Filter menu items by category
function filterMenu(category) {
    const menuItems = document.querySelectorAll('.grid > div');
    const filterButtons = document.querySelectorAll('.filters_menu li');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide menu items
    menuItems.forEach(item => {
        if (category === '*' || item.classList.contains(category.replace('.', ''))) {
            item.style.display = 'block';
            // Animate show
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// ================================
// EVENT LISTENERS
// ================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize cart counters
    updateCartCounters();
    
    // Add to cart button event listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const item = {
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                image: this.getAttribute('data-image'),
                category: this.getAttribute('data-category')
            };
            
            addToCart(item);
            
            // Add visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Menu filter event listeners
    const filterButtons = document.querySelectorAll('.filters_menu li');
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            filterMenu(filter);
        });
    });
});

// ================================
// CART PAGE FUNCTIONS
// ================================

// Render cart items (for cart.html)
function renderCartItems() {
    const cartContainer = document.getElementById('cartItemsContainer');
    if (!cartContainer) return; // Not on cart page
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="text-center py-5">
                    <i class="fa fa-shopping-cart fa-5x text-muted mb-3"></i>
                    <h4>Keranjang Anda Kosong</h4>
                    <p class="text-muted">Belum ada item yang ditambahkan ke keranjang</p>
                    <a href="menu.html" class="btn btn-primary">Lihat Menu</a>
                </div>
            </div>
        `;
        updateCartSummary(0, 0);
        return;
    }
    
    let cartHTML = '';
    cart.forEach(item => {
        cartHTML += `
            <div class="cart_item" data-item-id="${item.id}">
                <div class="item_image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item_details">
                    <h5 class="item_name">${item.name}</h5>
                    <div class="item_custom">
                        <textarea class="form-control custom_notes" placeholder="Catatan khusus (opsional)" 
                                onchange="updateItemNotes('${item.id}', this.value)">${item.notes || ''}</textarea>
                    </div>
                    <div class="item_row">
                        <div class="item_quantity">
                            <button class="qty_btn minus" onclick="changeQuantity('${item.id}', -1)" type="button">
                                <i class="fa fa-minus"></i>
                            </button>
                            <input type="text" class="qty_input" value="${item.quantity}" readonly>
                            <button class="qty_btn plus" onclick="changeQuantity('${item.id}', 1)" type="button">
                                <i class="fa fa-plus"></i>
                            </button>
                        </div>
                        <div class="item_price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
                    </div>
                </div>
                <div class="item_remove">
                    <button class="remove_btn" onclick="removeCartItem('${item.id}')" type="button">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    updateCartSummary();
}

// Update cart summary (totals)
function updateCartSummary() {
    const cart = getCart();
    const subtotal = getCartTotal();
    const discount = parseInt(document.getElementById('discountAmount')?.textContent?.replace(/[^\d]/g, '') || '0');
    const total = subtotal - discount;
    
    // Update summary display
    const subtotalElement = document.querySelector('.summary_row:first-child span:last-child');
    const totalElement = document.querySelector('.summary_row.total span:last-child');
    
    if (subtotalElement) {
        subtotalElement.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    }
    
    if (totalElement) {
        totalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

// Change item quantity with enhanced UX
function changeQuantity(itemId, change) {
    console.log('Changing quantity for item:', itemId, 'change:', change); // Debug log
    
    const cart = getCart();
    const itemIndex = cart.findIndex(cartItem => cartItem.id == itemId); // Use == instead of === for type flexibility
    
    if (itemIndex === -1) {
        console.error('Item not found in cart:', itemId);
        return;
    }
    
    const item = cart[itemIndex];
    const newQuantity = item.quantity + change;
    
    console.log('Current quantity:', item.quantity, 'New quantity:', newQuantity); // Debug log
    
    // Prevent negative quantities
    if (newQuantity < 1) {
        // If quantity becomes 0 or less, ask for confirmation to remove
        if (confirm(`Hapus ${item.name} dari keranjang?`)) {
            removeCartItem(itemId);
        }
        return;
    }
    
    // Maximum quantity limit (optional - prevent excessive orders)
    if (newQuantity > 99) {
        alert('Maksimal 99 item per produk');
        return;
    }
    
    // Update quantity
    cart[itemIndex].quantity = newQuantity;
    saveCart(cart);
    
    // Enhanced visual feedback
    const button = event?.target?.closest('.qty_btn');
    if (button) {
        // Add success animation
        button.style.transform = 'scale(0.9)';
        button.style.backgroundColor = '#28a745';
        button.style.color = '#fff';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 150);
    }
    
    // Update quantity display immediately for better UX
    const qtyInput = document.querySelector(`[data-item-id="${itemId}"] .qty_input`);
    if (qtyInput) {
        qtyInput.value = newQuantity;
        // Animate the input
        qtyInput.style.backgroundColor = '#e8f5e8';
        setTimeout(() => {
            qtyInput.style.backgroundColor = '';
        }, 300);
    }
    
    // Update price display immediately
    const priceElement = document.querySelector(`[data-item-id="${itemId}"] .item_price`);
    if (priceElement) {
        const newPrice = item.price * newQuantity;
        priceElement.textContent = `Rp ${newPrice.toLocaleString('id-ID')}`;
        // Animate price change
        priceElement.style.color = '#28a745';
        priceElement.style.fontWeight = 'bold';
        setTimeout(() => {
            priceElement.style.color = '';
            priceElement.style.fontWeight = '600';
        }, 500);
    }
    
    // Update cart summary immediately
    updateCartSummary();
    
    // Show enhanced feedback
    showQuantityChangeNotification(item.name, newQuantity);
    
    console.log('Quantity updated successfully:', item.name, 'new quantity:', newQuantity);
}

// Remove item from cart
function removeCartItem(itemId) {
    console.log('Removing item from cart:', itemId); // Debug log
    
    const cart = getCart();
    const item = cart.find(cartItem => cartItem.id == itemId);
    
    if (!item) {
        console.error('Item not found for removal:', itemId);
        return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menghapus ${item.name} dari keranjang?`)) {
        // Remove from cart
        const updatedCart = cart.filter(cartItem => cartItem.id != itemId);
        localStorage.setItem('amerta_cart', JSON.stringify(updatedCart));
        
        // Update counters
        updateCartCounters();
        
        // Re-render cart
        renderCartItems();
        
        // Show notification
        showRemoveNotification(item.name);
        
        console.log('Item removed successfully:', item.name);
    }
}

// Update item notes
function updateItemNotes(itemId, notes) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        cart[itemIndex].notes = notes;
        saveCart(cart);
    }
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.querySelector('.promo_input');
    const promoCode = promoInput?.value.trim().toLowerCase();
    const discountRow = document.querySelector('.summary_row:nth-child(2) span:last-child');
    
    if (!promoCode) {
        alert('Silakan masukkan kode promo');
        return;
    }
    
    // Predefined promo codes
    const promoCodes = {
        'amerta10': { discount: 10000, description: 'Diskon Rp 10.000' },
        'newcustomer': { discount: 15000, description: 'Diskon New Customer Rp 15.000' },
        'weekend': { discount: 20000, description: 'Diskon Weekend Rp 20.000' },
        'student': { discount: 8000, description: 'Diskon Pelajar Rp 8.000' }
    };
    
    if (promoCodes[promoCode]) {
        const discount = promoCodes[promoCode].discount;
        const description = promoCodes[promoCode].description;
        
        if (discountRow) {
            discountRow.textContent = `-Rp ${discount.toLocaleString('id-ID')}`;
            discountRow.setAttribute('id', 'discountAmount');
        }
        
        updateCartSummary();
        alert(`Kode promo berhasil diterapkan! ${description}`);
        promoInput.value = '';
    } else {
        alert('Kode promo tidak valid atau sudah kadaluarsa');
    }
}

// Process order with Firebase integration
async function processOrder() {
    const customerName = document.getElementById('customerName')?.value.trim();
    const tableNumber = document.getElementById('tableNumber')?.value.trim();
    const cart = getCart();
    
    if (cart.length === 0) {
        alert('Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
        return;
    }
    
    if (!customerName || !tableNumber) {
        alert('Silakan lengkapi nama dan nomor meja Anda');
        return;
    }
    
    try {
        // Show loading state
        const orderButton = document.querySelector('.order_btn');
        if (orderButton) {
            orderButton.disabled = true;
            orderButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Memproses Pesanan...';
        }
        
        // Import order manager
        const { 
            createOrderData, 
            saveOrderToFirebase, 
            showOrderSuccessNotification, 
            showOrderErrorNotification 
        } = await import('./orders/order-manager.js');
        
        // Calculate pricing
        const subtotal = getCartTotal();
        const discount = parseInt(document.getElementById('discountAmount')?.textContent?.replace(/[^\d]/g, '') || '0');
        const total = subtotal - discount;
        const promoCode = document.querySelector('.promo_input')?.value.trim() || '';
        
        const customerInfo = {
            name: customerName,
            tableNumber: tableNumber
        };
        
        const pricing = {
            subtotal: subtotal,
            discount: discount,
            total: total
        };
        
        // Create order data
        const orderData = await createOrderData(customerInfo, cart, pricing, promoCode);
        
        // Save to Firebase
        const result = await saveOrderToFirebase(orderData);
        
        if (result.success) {
            // Show success notification
            showOrderSuccessNotification(result.data);
            
            // Create order summary for display
            const orderSummary = createOrderSummaryHTML(result.data, cart);
            
            // Replace cart content with order summary
            const cartSection = document.querySelector('.cart_section .container');
            if (cartSection) {
                cartSection.innerHTML = orderSummary;
            }
            
            // Clear cart
            clearCart();
            
            console.log('Order processed successfully:', {
                orderId: result.orderId,
                orderNumber: result.orderNumber,
                total: total,
                timestamp: new Date()
            });
            
        } else {
            throw new Error(result.error || 'Gagal menyimpan pesanan');
        }
        
    } catch (error) {
        console.error('Error processing order:', error);
        
        // Show error notification
        if (typeof showOrderErrorNotification !== 'undefined') {
            showOrderErrorNotification(error.message);
        } else {
            alert('Gagal memproses pesanan: ' + error.message);
        }
        
        // Reset order button
        const orderButton = document.querySelector('.order_btn');
        if (orderButton) {
            orderButton.disabled = false;
            orderButton.innerHTML = 'Konfirmasi Pesanan';
        }
    }
}

// Create enhanced order summary HTML
function createOrderSummaryHTML(orderData, cartItems) {
    let orderSummary = `
        <div class="order-success">
            <div class="alert alert-success">
                <div class="success-header">
                    <i class="fa fa-check-circle success-icon"></i>
                    <h4>Pesanan Berhasil!</h4>
                </div>
                
                <div class="order-info">
                    <div class="info-row">
                        <strong>Order ID:</strong> 
                        <span class="order-id">${orderData.orderNumber}</span>
                    </div>
                    <div class="info-row">
                        <strong>Nama:</strong> ${orderData.customerInfo.name}
                    </div>
                    <div class="info-row">
                        <strong>Nomor Meja:</strong> ${orderData.customerInfo.tableNumber}
                    </div>
                    <div class="info-row">
                        <strong>Total:</strong> 
                        <span class="total-amount">Rp ${orderData.pricing.total.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="info-row">
                        <strong>Status:</strong> 
                        <span class="status-badge pending">Menunggu Konfirmasi</span>
                    </div>
                </div>
                
                <hr>
                
                <div class="order-details">
                    <h5><i class="fa fa-list"></i> Detail Pesanan:</h5>
                    <div class="order-items">
    `;
    
    // Add order items
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        orderSummary += `
            <div class="order-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <div class="item-price">Rp ${itemTotal.toLocaleString('id-ID')}</div>
            </div>
        `;
        
        if (item.notes && item.notes.trim()) {
            orderSummary += `
                <div class="item-notes">
                    <small><i class="fa fa-sticky-note"></i> ${item.notes}</small>
                </div>
            `;
        }
    });
    
    orderSummary += `
                    </div>
                </div>
                
                <hr>
                
                <div class="order-summary-pricing">
                    <div class="pricing-row">
                        <span>Subtotal:</span>
                        <span>Rp ${orderData.pricing.subtotal.toLocaleString('id-ID')}</span>
                    </div>
    `;
    
    if (orderData.pricing.discount > 0) {
        orderSummary += `
                    <div class="pricing-row discount">
                        <span>Diskon (${orderData.pricing.promoCode}):</span>
                        <span>-Rp ${orderData.pricing.discount.toLocaleString('id-ID')}</span>
                    </div>
        `;
    }
    
    orderSummary += `
                    <div class="pricing-row total">
                        <span><strong>Total:</strong></span>
                        <span><strong>Rp ${orderData.pricing.total.toLocaleString('id-ID')}</strong></span>
                    </div>
                </div>
                
                <div class="order-actions">
                    <div class="thank-you-message">
                        <p><strong><i class="fa fa-heart"></i> Terima kasih atas pesanan Anda!</strong></p>
                        <p>Pesanan sedang diproses dan akan segera diantar ke meja Anda.</p>
                        <p><small>Estimasi waktu: 15-20 menit</small></p>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="location.href='menu.html'">
                            <i class="fa fa-utensils"></i> Pesan Lagi
                        </button>
                        <button class="btn btn-outline-primary" onclick="printOrderReceipt('${orderData.orderNumber}')">
                            <i class="fa fa-print"></i> Cetak Struk
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
        .order-success {
            padding: 30px 20px;
            margin-top: 40px;
        }
        
        .order-success .alert-success {
            border-radius: 12px;
            border: 1px solid #d4edda;
            padding: 30px;
            background: linear-gradient(135deg, #d4edda 0%, #f8fff9 100%);
            box-shadow: 0 8px 32px rgba(40, 167, 69, 0.1);
        }
        
        .success-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .success-icon {
            font-size: 32px;
            color: #28a745;
            text-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
        }
        
        .success-header h4 {
            color: #155724;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .order-info {
            background: rgba(255, 255, 255, 0.7);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid rgba(40, 167, 69, 0.1);
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .order-id {
            font-family: monospace;
            background: #e9ecef;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
        }
        
        .total-amount {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .status-badge.pending {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        .order-details h5 {
            color: #155724;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .order-items {
            background: rgba(255, 255, 255, 0.8);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(40, 167, 69, 0.1);
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .item-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .item-name {
            font-weight: 500;
        }
        
        .item-quantity {
            background: #e9ecef;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .item-price {
            font-weight: 600;
            color: #495057;
        }
        
        .item-notes {
            padding: 5px 15px;
            background: #f8f9fa;
            border-radius: 4px;
            margin: 5px 0;
            border-left: 3px solid #6c757d;
        }
        
        .order-summary-pricing {
            background: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(40, 167, 69, 0.1);
        }
        
        .pricing-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
        }
        
        .pricing-row.discount {
            color: #dc3545;
        }
        
        .pricing-row.total {
            border-top: 2px solid #28a745;
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
        }
        
        .thank-you-message {
            text-align: center;
            margin: 25px 0;
            padding: 20px;
            background: rgba(40, 167, 69, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(40, 167, 69, 0.1);
        }
        
        .thank-you-message p {
            margin: 8px 0;
        }
        
        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .action-buttons .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .action-buttons .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .btn-outline-primary {
            background-color: white;
            border: 2px solid #007bff;
            color: #007bff;
        }
        
        .btn-outline-primary:hover {
            background-color: #007bff;
            color: white;
        }
        
        @media (max-width: 576px) {
            .order-success {
                padding: 20px 10px;
            }
            
            .order-success .alert-success {
                padding: 20px;
            }
            
            .success-header {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .info-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            
            .action-buttons {
                flex-direction: column;
            }
            
            .action-buttons .btn {
                width: 100%;
                justify-content: center;
            }
        }
        </style>
    `;
    
    return orderSummary;
}

// Print order receipt function
function printOrderReceipt(orderNumber) {
    const printContent = `
        <div style="font-family: monospace; width: 300px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
                <h2>AMERTA RESTAURANT</h2>
                <p>Struk Pemesanan</p>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Order: ${orderNumber}</strong><br>
                <strong>Tanggal: ${new Date().toLocaleString('id-ID')}</strong>
            </div>
            <div style="border-top: 1px dashed #000; padding-top: 10px; text-align: center;">
                <p>Terima kasih atas pesanan Anda!</p>
                <p><small>Simpan struk ini sebagai bukti pemesanan</small></p>
            </div>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head><title>Struk Pesanan - ${orderNumber}</title></head>
            <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ================================
// ENHANCED CART FEATURES
// ================================

// Keyboard accessibility for quantity inputs
function initializeKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        // If focused on quantity input
        if (e.target.classList.contains('qty_input')) {
            const itemId = e.target.closest('.cart_item').getAttribute('data-item-id');
            
            if (e.key === 'ArrowUp' || e.key === '+') {
                e.preventDefault();
                changeQuantity(itemId, 1);
            } else if (e.key === 'ArrowDown' || e.key === '-') {
                e.preventDefault();
                changeQuantity(itemId, -1);
            } else if (e.key === 'Delete') {
                e.preventDefault();
                removeCartItem(itemId);
            }
        }
    });
}

// Enhanced notification system
function showEnhancedNotification(message, type = 'success', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.enhanced-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `enhanced-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-notif" onclick="this.parentElement.parentElement.remove()">
                <i class="fa fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.close-notif').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0 5px;
    `;
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto hide
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Quick add feature (double click to add)
function initializeQuickAdd() {
    document.addEventListener('dblclick', function(e) {
        if (e.target.closest('.qty_btn.plus')) {
            const itemId = e.target.closest('.cart_item').getAttribute('data-item-id');
            const cart = getCart();
            const item = cart.find(cartItem => cartItem.id == itemId);
            
            if (item) {
                // Add 5 items quickly
                changeQuantity(itemId, 5);
                showEnhancedNotification(`Ditambahkan 5x ${item.name}`, 'success', 2000);
            }
        }
    });
}

// Bulk operations
function clearAllItems() {
    if (confirm('Apakah Anda yakin ingin menghapus semua item dari keranjang?')) {
        clearCart();
        renderCartItems();
        showEnhancedNotification('Keranjang berhasil dikosongkan', 'success');
    }
}

// Save cart as favorite for later
function saveCartAsFavorite() {
    const cart = getCart();
    if (cart.length === 0) {
        showEnhancedNotification('Keranjang kosong, tidak ada yang disimpan', 'error');
        return;
    }
    
    const favoriteName = prompt('Nama favorit pesanan:');
    if (favoriteName && favoriteName.trim()) {
        const favorites = JSON.parse(localStorage.getItem('amerta_favorites') || '[]');
        favorites.push({
            name: favoriteName.trim(),
            items: cart,
            date: new Date().toISOString(),
            total: getCartTotal()
        });
        localStorage.setItem('amerta_favorites', JSON.stringify(favorites));
        showEnhancedNotification(`Pesanan disimpan sebagai "${favoriteName}"`, 'success');
    }
}

// Initialize enhanced features when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeKeyboardControls();
    initializeQuickAdd();
    
    // Add bulk action buttons to cart summary if on cart page
    if (document.getElementById('cartItemsContainer')) {
        const cartSummary = document.querySelector('.cart_summary');
        if (cartSummary) {
            const bulkActions = document.createElement('div');
            bulkActions.className = 'bulk-actions';
            bulkActions.innerHTML = `
                <div class="bulk-actions-header">Aksi Cepat:</div>
                <div class="bulk-actions-buttons">
                    <button class="btn-bulk" onclick="clearAllItems()" title="Kosongkan keranjang">
                        <i class="fa fa-trash"></i> Kosongkan
                    </button>
                    <button class="btn-bulk" onclick="saveCartAsFavorite()" title="Simpan sebagai favorit">
                        <i class="fa fa-heart"></i> Simpan
                    </button>
                </div>
            `;
            
            // Add styles
            bulkActions.style.cssText = `
                margin: 15px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .bulk-actions-header {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #495057;
                }
                .bulk-actions-buttons {
                    display: flex;
                    gap: 10px;
                }
                .btn-bulk {
                    padding: 8px 12px;
                    border: 1px solid #dee2e6;
                    background-color: #fff;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .btn-bulk:hover {
                    background-color: #e9ecef;
                    transform: translateY(-1px);
                }
                .btn-bulk i {
                    font-size: 11px;
                }
            `;
            document.head.appendChild(style);
            
            // Insert before promo section
            const promoSection = cartSummary.querySelector('.promo_section');
            if (promoSection) {
                cartSummary.insertBefore(bulkActions, promoSection);
            } else {
                cartSummary.insertBefore(bulkActions, cartSummary.firstChild);
            }
        }
    }
});

// ================================
// GLOBAL FUNCTIONS (for onclick attributes)
// ================================
window.changeQuantity = changeQuantity;
window.removeCartItem = removeCartItem;
window.updateItemNotes = updateItemNotes;
window.applyPromoCode = applyPromoCode;
window.processOrder = processOrder;
window.clearAllItems = clearAllItems;
window.saveCartAsFavorite = saveCartAsFavorite;
window.printOrderReceipt = printOrderReceipt;
window.updateCartCounters = updateCartCounters;
