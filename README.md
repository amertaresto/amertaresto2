# 🍽️ Amerta Restaurant Website
**Warisan Rasa, Keindahan Kuliner Nusantara**

![Website Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Features](https://img.shields.io/badge/Features-Complete-blue)
![Responsive](https://img.shields.io/badge/Responsive-Yes-success)

## 🌟 **OVERVIEW**

Amerta Restaurant adalah website modern untuk restoran dengan tema kuliner Nusantara yang menyediakan pengalaman dining online yang lengkap, mulai dari browsing menu hingga pemesanan dengan sistem autentikasi Firebase.

## ✨ **KEY FEATURES**

### 🔐 **Authentication System**
- **Firebase Authentication** dengan Email/Password
- **Dynamic Navbar** - tampilan berbeda untuk user login/logout
- **User Profile Management** dengan data persistent di Realtime Database
- **Secure Logout** dengan konfirmasi dan toast notification

### 🍽️ **Menu & Ordering System**
- **15+ Menu Items** dengan kategori (Makanan Utama, Appetizer, Minuman, Dessert)
- **Interactive Menu Filtering** dengan smooth animations
- **Add to Cart** functionality dengan visual feedback
- **Real-time Cart Counter** di navbar
- **Complete Cart Management** (add/remove/update quantities)

### 🛒 **Shopping Cart Features**
- **Persistent Cart** dengan localStorage
- **Quantity Controls** untuk setiap item
- **Custom Notes** untuk special requests
- **Promo Code System** dengan 4 kode aktif
- **Real-time Total Calculation** termasuk diskon
- **Order Processing** dengan Order ID generation

### 📱 **User Experience** 
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** untuk semua interactions
- **Toast Notifications** untuk user feedback
- **Loading States** dan error handling
- **Accessibility Support** dengan ARIA labels

### 🏠 **Reservation System**
- **Online Table Booking** dengan form validation
- **Authentication Required** untuk membuat reservasi
- **Firebase Integration** untuk data persistence
- **Email Pre-fill** untuk logged-in users

---

## 🗂️ **PROJECT STRUCTURE**

```
amerta-restaurant/
├── 📄 HTML Pages
│   ├── index.html          # Homepage dengan hero section
│   ├── menu.html           # Menu catalog dengan cart integration  
│   ├── cart.html           # Shopping cart & checkout
│   ├── login.html          # User authentication
│   ├── register.html       # User registration
│   ├── blog.html           # News & promos
│   ├── testimonial.html    # Customer testimonials
│   └── about.html          # About restaurant
│
├── 🎨 Styling
│   ├── css/
│   │   ├── style.css       # Main stylesheet (compiled)
│   │   ├── style.scss      # SCSS source file
│   │   ├── responsive.css  # Mobile optimization
│   │   └── bootstrap.css   # Bootstrap framework
│
├── ⚡ JavaScript Logic
│   ├── js/
│   │   ├── firebase-config.js    # Firebase setup & config
│   │   ├── auth-logic.js         # Login/register logic
│   │   ├── navbar-auth.js        # Dynamic navbar management
│   │   ├── menu-cart.js          # Menu & cart system
│   │   ├── reservasi-logic.js    # Reservation booking
│   │   └── custom.js             # UI interactions
│
├── 🖼️ Assets
│   ├── images/             # Menu items, backgrounds, icons
│   └── fonts/              # Custom typography
│
└── 📚 Documentation
    ├── MENU_CART_GUIDE.md  # Menu & cart system guide
    ├── UPDATE_NAVBAR_GUIDE.md # Navbar update instructions
    └── README.md           # This file
```

---

## 🚀 **QUICK START**

### **Prerequisites**
- Local web server (XAMPP, WAMP, Laragon, atau Live Server)
- Modern web browser
- Internet connection (untuk Firebase & CDN resources)

### **Installation**
1. **Clone atau download** project files
2. **Place files** di web server directory (e.g., `htdocs`, `www`)
3. **Start web server**
4. **Access website**: `http://localhost/`

### **Firebase Setup**
1. **Create Firebase Project** di [Firebase Console](https://console.firebase.google.com)
2. **Enable Authentication** → Email/Password
3. **Create Realtime Database** (Asia Southeast region recommended)
4. **Update config** di `js/firebase-config.js`
5. **Set database rules** untuk security

---

## 🧪 **TESTING GUIDE**

### **🔐 Authentication Flow**
1. **Register** new account: `http://localhost/register.html`
2. **Login** dengan akun tersebut: `http://localhost/login.html`  
3. **Check navbar** - harus tampil nama user dan logout button
4. **Test logout** - konfirmasi dialog + toast notification

### **🍽️ Menu & Cart System**
1. **Browse menu**: `http://localhost/menu.html`
2. **Filter categories** - test smooth animations
3. **Add items to cart** - check counter updates
4. **View cart**: `http://localhost/cart.html`
5. **Test quantity controls** (+/-)
6. **Apply promo codes**: `AMERTA10`, `NEWCUSTOMER`, `WEEKEND`, `STUDENT`
7. **Complete order** - fill customer info & confirm

### **🏠 Reservation System**
1. **Login first** (required for reservations)
2. **Go to homepage** reservation section
3. **Fill form** dengan detail reservasi
4. **Submit** - check success message
5. **Verify** di Firebase Console → Database

---

## 🎯 **MENU CATALOG**

### **🍛 Makanan Utama (Rp 45.000 - 68.000)**
- Soto Ayam Tradisional
- Nasi Gudeg Yogya  
- Rendang Daging Sapi
- Nasi Liwet Solo
- Sop Iga Sapi
- Nasi Goreng Seafood

### **🥗 Appetizer (Rp 25.000 - 32.000)**
- Gado-Gado Jakarta
- Lumpia Semarang
- Kerak Telor Betawi

### **🥤 Minuman (Rp 8.000 - 15.000)**
- Es Teh Manis
- Es Jeruk Peras
- Es Cendol

### **🍰 Dessert (Rp 18.000 - 22.000)**
- Klepon
- Es Campur

---

## 💳 **PROMO CODES**

| Code | Discount | Description |
|------|----------|-------------|
| `AMERTA10` | Rp 10.000 | General discount |
| `NEWCUSTOMER` | Rp 15.000 | First-time customer |
| `WEEKEND` | Rp 20.000 | Weekend special |
| `STUDENT` | Rp 8.000 | Student discount |

---

## 🔧 **TECHNICAL SPECIFICATIONS**

### **Frontend Technologies**
- **HTML5** - Semantic markup
- **CSS3/SCSS** - Modern styling with variables & mixins
- **JavaScript ES6** - Modern syntax dengan modules
- **Bootstrap 4** - Responsive grid system
- **Font Awesome** - Icon library
- **Slick Carousel** - Image sliders

### **Backend Services**
- **Firebase Authentication** - User management
- **Firebase Realtime Database** - Data storage
- **Firebase Storage** - File storage (future use)
- **Firebase Hosting** - Web hosting (optional)

### **Browser Support**
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Performance**
- 📱 **Mobile-First** responsive design
- ⚡ **Fast Loading** optimized assets
- 🔄 **Smooth Animations** CSS transitions
- 💾 **Offline Support** localStorage persistence

---

## 🔒 **SECURITY FEATURES**

### **Authentication Security**
- **Firebase Auth** industry-standard security
- **Password Requirements** minimum 6 characters
- **Email Verification** (dapat diaktifkan)
- **Rate Limiting** untuk prevent brute force

### **Database Security**
- **Firebase Rules** role-based access control
- **User Data Protection** only owner can access
- **Input Validation** prevent injection attacks
- **HTTPS Encryption** all data transmission

### **Frontend Security**
- **XSS Prevention** input sanitization
- **CSRF Protection** (dapat ditambahkan)
- **Content Security Policy** (dapat dikonfigurasi)

---

## 📊 **ANALYTICS & MONITORING**

### **Firebase Analytics** (Optional)
- **User Engagement** tracking
- **Conversion Rates** order completion
- **Popular Menu Items** analysis
- **Peak Hours** identification

### **Performance Monitoring**
- **Page Load Times**
- **Error Tracking** 
- **User Flow Analysis**
- **Mobile Usage Stats**

---

## 🔮 **ROADMAP & FUTURE ENHANCEMENTS**

### **Phase 2: Enhanced Features**
- [ ] **Menu Search** functionality
- [ ] **Favorites System** untuk menu items
- [ ] **Order History** untuk returning customers
- [ ] **Loyalty Points** reward system
- [ ] **Multiple Delivery Options**

### **Phase 3: Advanced Integration**
- [ ] **Payment Gateway** (Midtrans, GoPay, OVO)
- [ ] **WhatsApp Integration** untuk notifications
- [ ] **Google Maps** integration untuk location
- [ ] **Push Notifications** untuk order updates
- [ ] **Admin Dashboard** untuk restaurant management

### **Phase 4: Business Intelligence** 
- [ ] **Sales Analytics** dashboard
- [ ] **Inventory Management** system
- [ ] **Staff Management** module
- [ ] **Customer Segmentation** analysis
- [ ] **Marketing Campaign** tools

---

## 🤝 **CONTRIBUTING**

### **Development Guidelines**
1. **Follow coding standards** - consistent formatting
2. **Test thoroughly** - semua browser & devices
3. **Document changes** - update README & guides
4. **Security first** - validate all inputs
5. **Mobile optimization** - test on real devices

### **Bug Reports**
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual** behavior
- **Browser/device** information
- **Screenshots** if applicable

---

## 📞 **SUPPORT & CONTACT**

### **Technical Support**
- 📧 **Email**: dev@amertarestaurant.com
- 💬 **Discord**: [Developer Community]
- 📚 **Documentation**: `/docs` folder
- 🐛 **Bug Reports**: GitHub Issues

### **Business Inquiries**
- 📧 **Email**: info@amertarestaurant.com
- 📞 **Phone**: +62 812-3456-7890
- 🌐 **Website**: www.amertarestaurant.com
- 📍 **Location**: Jakarta, Indonesia

---

## 📜 **LICENSE**

```
MIT License

Copyright (c) 2025 Amerta Restaurant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 **ACKNOWLEDGMENTS**

- **Firebase** - Backend-as-a-Service platform
- **Bootstrap** - CSS framework  
- **Font Awesome** - Icon library
- **ThemeWagon** - Original template design
- **Unsplash** - Stock photography
- **Indonesian Culinary Heritage** - Menu inspiration

---

## 🎉 **PROJECT STATUS**

**✅ PRODUCTION READY**

Website Amerta Restaurant sudah **fully functional** dengan complete feature set:
- ✅ User Authentication dengan Firebase
- ✅ Dynamic Menu dengan 15+ items  
- ✅ Complete Shopping Cart system
- ✅ Promo Code functionality
- ✅ Reservation booking system
- ✅ Responsive design untuk semua devices
- ✅ Real-time notifications & feedback
- ✅ Security & error handling

**🚀 Ready untuk deployment dan production use!**

---

*Built with ❤️ for Indonesian culinary culture*