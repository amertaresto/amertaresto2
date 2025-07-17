// js/orders/order-manager.js

// Fungsi untuk memproses pesanan
export function processOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    const tableNumber = document.getElementById('tableNumber').value.trim();
    
    // Validasi input
    if (!customerName || !tableNumber) {
        alert('Mohon lengkapi nama dan nomor meja!');
        return;
    }
    
    // Ambil data keranjang
    const cart = JSON.parse(localStorage.getItem('amerta_cart') || '[]');
    
    if (cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }
    
    // Ubah tombol menjadi loading
    const orderBtn = document.querySelector('.order_btn');
    const originalText = orderBtn.textContent;
    orderBtn.textContent = 'Memproses Pesanan...';
    orderBtn.disabled = true;
    
    // Simulasi proses pesanan (3 detik)
    setTimeout(() => {
        // Generate order ID
        const orderId = generateOrderId();
        
        // Hitung total
        const orderSummary = calculateOrderSummary(cart);
        
        // Buat data pesanan
        const orderData = {
            id: orderId,
            customerName: customerName,
            tableNumber: tableNumber,
            items: cart,
            summary: orderSummary,
            timestamp: new Date(),
            status: 'confirmed'
        };
        
        // Simpan pesanan ke localStorage
        saveOrder(orderData);
        
        // Tampilkan struk
        showOrderReceipt(orderData);
        
        // Kosongkan keranjang
        localStorage.removeItem('amerta_cart');
        
        // Reset tombol
        orderBtn.textContent = originalText;
        orderBtn.disabled = false;
        
    }, 3000);
}

// Fungsi untuk generate Order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `AMR${timestamp}${random}`.slice(-10);
}

// Fungsi untuk menghitung ringkasan pesanan
function calculateOrderSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Ambil diskon yang sudah diterapkan (jika ada)
    const discountAmount = parseInt(document.querySelector('.summary_row:nth-child(2) span:last-child').textContent.replace(/[^0-9]/g, '')) || 0;
    
    const total = subtotal - discountAmount;
    
    return {
        subtotal: subtotal,
        discount: discountAmount,
        total: total
    };
}

// Fungsi untuk menyimpan pesanan
function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('amerta_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('amerta_orders', JSON.stringify(orders));
}

// Fungsi untuk menampilkan struk pesanan
function showOrderReceipt(orderData) {
    const receiptHTML = `
        <div class="receipt-overlay" id="receiptOverlay">
            <div class="receipt-container">
                <div class="receipt-header">
                    <button class="close-receipt" onclick="closeReceipt()">&times;</button>
                    <h2>STRUK PESANAN</h2>
                    <div class="restaurant-info">
                        <h3>AMERTA RESTAURANT</h3>
                        <p>Jl. Kuliner No. 123, Jakarta</p>
                        <p>Telp: (021) 1234-5678</p>
                    </div>
                </div>
                
                <div class="receipt-content">
                    <div class="order-info">
                        <div class="info-row">
                            <span>Order ID:</span>
                            <span>${orderData.id}</span>
                        </div>
                        <div class="info-row">
                            <span>Nama:</span>
                            <span>${orderData.customerName}</span>
                        </div>
                        <div class="info-row">
                            <span>Meja:</span>
                            <span>${orderData.tableNumber}</span>
                        </div>
                        <div class="info-row">
                            <span>Tanggal:</span>
                            <span>${formatDate(orderData.timestamp)}</span>
                        </div>
                        <div class="info-row">
                            <span>Waktu:</span>
                            <span>${formatTime(orderData.timestamp)}</span>
                        </div>
                    </div>
                    
                    <div class="order-items">
                        <h4>DETAIL PESANAN</h4>
                        <div class="items-list">
                            ${orderData.items.map(item => `
                                <div class="item-row">
                                    <div class="item-info">
                                        <span class="item-name">${item.name}</span>
                                        <span class="item-quantity">${item.quantity}x</span>
                                    </div>
                                    <span class="item-price">Rp ${item.price.toLocaleString('id-ID')}</span>
                                    <span class="item-total">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="order-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>Rp ${orderData.summary.subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        ${orderData.summary.discount > 0 ? `
                            <div class="summary-row">
                                <span>Diskon:</span>
                                <span>-Rp ${orderData.summary.discount.toLocaleString('id-ID')}</span>
                            </div>
                        ` : ''}
                        <div class="summary-row total">
                            <span>TOTAL:</span>
                            <span>Rp ${orderData.summary.total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    
                    <div class="receipt-footer">
                        <p>Terima kasih atas pesanan Anda!</p>
                        <p>Makanan akan segera disiapkan</p>
                        <p class="order-status">Status: <span class="status-confirmed">DIKONFIRMASI</span></p>
                    </div>
                </div>
                
                <div class="receipt-actions">
                    <button class="btn btn-print" onclick="printReceipt()">
                        <i class="fa fa-print"></i> Cetak Struk
                    </button>
                    <button class="btn btn-home" onclick="goToHome()">
                        <i class="fa fa-home"></i> Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Tambahkan HTML ke body
    document.body.insertAdjacentHTML('beforeend', receiptHTML);
    
    // Tampilkan overlay
    document.getElementById('receiptOverlay').style.display = 'flex';
}

// Fungsi untuk format tanggal
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

// Fungsi untuk format waktu
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Fungsi untuk menutup struk
window.closeReceipt = function() {
    const overlay = document.getElementById('receiptOverlay');
    if (overlay) {
        overlay.remove();
    }
};

// Fungsi untuk cetak struk
window.printReceipt = function() {
    const printContent = document.querySelector('.receipt-container').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Struk Pesanan - ${generateOrderId()}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .receipt-container { max-width: 400px; margin: 0 auto; }
                .receipt-header { text-align: center; margin-bottom: 20px; }
                .restaurant-info h3 { margin: 0; }
                .order-info, .order-items, .order-summary { margin: 20px 0; }
                .info-row, .item-row, .summary-row { 
                    display: flex; 
                    justify-content: space-between; 
                    margin: 5px 0; 
                }
                .total { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
                .receipt-footer { text-align: center; margin-top: 20px; }
                .close-receipt, .receipt-actions { display: none; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

// Fungsi untuk kembali ke beranda
window.goToHome = function() {
    window.location.href = 'index.html';
};
