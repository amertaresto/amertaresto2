// Cart Functionality
$(document).ready(function() {
  // Quantity adjustment buttons
  $('.qty_btn.plus').on('click', function() {
    let input = $(this).siblings('.qty_input');
    let currentValue = parseInt(input.val());
    input.val(currentValue + 1);
    updateTotals();
  });
  
  $('.qty_btn.minus').on('click', function() {
    let input = $(this).siblings('.qty_input');
    let currentValue = parseInt(input.val());
    if (currentValue > 1) {
      input.val(currentValue - 1);
      updateTotals();
    }
  });
  
  // Remove item button
  $('.remove_btn').on('click', function() {
    $(this).closest('.cart_item').fadeOut(300, function() {
      $(this).remove();
      updateTotals();
      
      // Check if cart is empty
      if ($('.cart_item').length === 0) {
        $('.cart_items').append('<div class="empty_cart"><p>Keranjang Anda kosong</p></div>');
      }
    });
  });
  
  // Promo code button
  $('.promo_btn').on('click', function() {
    let promoCode = $('.promo_input').val().trim();
    if (promoCode !== '') {
      // This would typically involve an API call to validate the code
      // For demo purposes, we'll just apply a fixed discount
      alert('Kode promo berhasil diterapkan!');
      $('.summary_row:nth-child(2) span:last-child').text('-Rp 10.000');
      updateTotals();
    } else {
      alert('Silakan masukkan kode promo');
    }
  });
  
  // Order confirmation button
  $('.order_btn').on('click', function() {
    let customerName = $('#customerName').val().trim();
    let tableNumber = $('#tableNumber').val().trim();
    
    if (customerName === '' || tableNumber === '') {
      alert('Silakan lengkapi nama dan nomor meja Anda');
      return;
    }
    
    // This would typically submit the order to a backend system
    alert('Pesanan Anda telah dikonfirmasi! Terima kasih telah memesan, ' + customerName + '!');
  });
  
  // Function to update totals (simplified for demo)
  function updateTotals() {
    let subtotal = 0;
    
    // Calculate subtotal from each item
    $('.cart_item').each(function() {
      let price = $(this).find('.item_price').text().replace('Rp ', '').replace('.', '');
      let quantity = $(this).find('.qty_input').val();
      
      subtotal += parseInt(price) * parseInt(quantity);
    });
    
    // Format and display subtotal
    $('.summary_row:first-child span:last-child').text('Rp ' + formatNumber(subtotal));
    
    // Get discount value
    let discountText = $('.summary_row:nth-child(2) span:last-child').text().replace('-Rp ', '').replace('.', '');
    let discount = parseInt(discountText) || 0;
    
    // Calculate and display total
    let total = subtotal - discount;
    $('.summary_row.total span:last-child').text('Rp ' + formatNumber(total));
  }
  
  // Format number with thousands separator
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  // Initialize totals on page load
  updateTotals();
});
