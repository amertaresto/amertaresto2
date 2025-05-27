# INSTRUKSI UPDATE NAVBAR AUTHENTICATION

Untuk setiap halaman HTML lainnya (menu.html, blog.html, testimonial.html, about.html), 
tambahkan script berikut sebelum tag </body>:

```html
<!-- Skrip Firebase dan Logika Autentikasi -->
<script type="module" src="js/firebase-config.js"></script>
<script type="module" src="js/auth-logic.js"></script>
<!-- Skrip untuk navbar authentication -->
<script type="module" src="js/navbar-auth.js"></script>
```

## Files yang sudah di-update:
✅ index.html
✅ login.html  
✅ register.html
✅ cart.html

## Files yang perlu di-update:
- menu.html (jika ada)
- blog.html (jika ada)
- testimonial.html (jika ada)
- about.html (jika ada)

## Struktur Navbar yang harus ada di setiap halaman:

```html
<div class="User_option">
  <!-- Akan diupdate otomatis oleh navbar-auth.js -->
  <a href="login.html">
    <i class="fa fa-user" aria-hidden="true"></i>
    <span>Login</span>
  </a>
  <form class="form-inline">
    <a href="cart.html" class="btn nav_cart-btn" type="button">
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
    </a>
  </form>
</div>
```

Dan overlay menu:
```html
<div id="myNav" class="overlay">
  <div class="overlay-content">
    <!-- Akan diupdate otomatis oleh navbar-auth.js -->
    <a href="index.html">Beranda</a>
    <a href="menu.html">Menu</a>
    <a href="blog.html">Berita Terkini</a>
    <a href="testimonial.html">Cerita Mereka di Amerta</a>
  </div>
</div>
```
