// js/cart-script.js
import {
  createOrderData,
  saveOrderToFirebase,
  showOrderSuccessNotification,
  showOrderErrorNotification
} from './orders/order-manager.js';

// Ambil keranjang dari localStorage
function getCart() {
  const cart = localStorage.getItem('amerta_cart');
  return cart ? JSON.parse(cart) : [];
}

// Render item keranjang
function renderCartItems() {
  const cart = getCart();
  const container = document.getElementById('cartItemsContainer');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Keranjang Anda kosong.</p>';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item border p-2 mb-2';
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      Jumlah: ${item.quantity} &mdash; Rp ${item.price.toLocaleString()}<br>
      Total: Rp ${(item.price * item.quantity).toLocaleString()}
    `;
    container.appendChild(div);
  });

  updateSummary(cart);
}

// Hitung subtotal dan total
function updateSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;

  document.querySelector('.summary_row:nth-child(1) span:nth-child(2)').textContent = `Rp ${subtotal.toLocaleString()}`;
  document.querySelector('.summary_row:nth-child(2) span:nth-child(2)').textContent = `-Rp ${discount.toLocaleString()}`;
  document.querySelector('.summary_row.total span:nth-child(2)').textContent = `Rp ${total.toLocaleString()}`;
}

// Bersihkan keranjang
function clearCart() {
  localStorage.removeItem('amerta_cart');
  const counter = document.getElementById('cartCount');
  if (counter) {
    counter.textContent = '0';
    counter.style.display = 'none';
  }
}

// Proses pesanan
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
  const pricing = { subtotal, discount: 0, total };
  const customerInfo = { name, tableNumber };

  try {
    const orderData = await createOrderData(customerInfo, cart, pricing);
    const result = await saveOrderToFirebase(orderData);

    if (result.success) {
      localStorage.setItem('amerta_receipt', JSON.stringify({
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        customerName: name,
        tableNumber: table,
        items: cart,
        pricing,
        timestamp: Date.now()
      }));
      clearCart();
      showOrderSuccessNotification(orderData);
      setTimeout(() => window.location.href = 'receipt.html', 1000);
    } else {
      showOrderErrorNotification(result.error);
    }
  } catch (err) {
    console.error('Gagal memproses pesanan:', err);
    showOrderErrorNotification(err.message);
  }
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  const btn = document.querySelector('.order_btn');
  if (btn) btn.addEventListener('click', processOrder);
});
