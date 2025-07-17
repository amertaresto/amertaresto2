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
      alert('Kode promo berhasil diterapkan!');
      $('.summary_row:nth-child(2) span:last-child').text('-Rp 10.000');
      updateTotals();
    } else {
      alert('Silakan masukkan kode promo');
    }
  });

  // Function to update totals
  function updateTotals() {
    let subtotal = 0;

    $('.cart_item').each(function() {
      let price = $(this).find('.item_price').text().replace('Rp ', '').replace('.', '');
      let quantity = $(this).find('.qty_input').val();
      subtotal += parseInt(price) * parseInt(quantity);
    });

    $('.summary_row:first-child span:last-child').text('Rp ' + formatNumber(subtotal));

    let discountText = $('.summary_row:nth-child(2) span:last-child').text().replace('-Rp ', '').replace('.', '');
    let discount = parseInt(discountText) || 0;

    let total = subtotal - discount;
    $('.summary_row.total span:last-child').text('Rp ' + formatNumber(total));
  }

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Initialize totals on page load
  updateTotals();
});
