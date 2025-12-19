'use strict';

// ==========================================
// CART SYSTEM
// ==========================================

// Cart storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements for cart
const cartToggleBtn = document.querySelector('[data-cart-toggle]');
const cartCloseBtn = document.querySelector('[data-cart-close]');
const cartOverlay = document.querySelector('[data-cart-overlay]');
const shoppingCart = document.querySelector('[data-shopping-cart]');
const cartItemsContainer = document.querySelector('[data-cart-items]');
const cartTotalElement = document.querySelector('[data-cart-total]');
const cartCountElement = document.querySelector('[data-cart-count]');
const clearCartBtn = document.querySelector('[data-clear-cart]');
const addToCartBtns = document.querySelectorAll('.add-cart-btn, .add-to-cart-btn');

// Initialize cart system
function initCart() {
  // Note: Cart toggle removed - now using dedicated cart.html page
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCart);
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
  
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
  
  // Add to cart button listeners
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
  });
  
  // Update cart display on page load
  updateCart();
}

// Open cart sidebar
function openCart() {
  if (shoppingCart) {
    shoppingCart.classList.add('active');
  }
  if (cartOverlay) {
    cartOverlay.classList.add('active');
  }
}

// Close cart sidebar
function closeCart() {
  if (shoppingCart) {
    shoppingCart.classList.remove('active');
  }
  if (cartOverlay) {
    cartOverlay.classList.remove('active');
  }
}

// Handle add to cart
function handleAddToCart(e) {
  e.preventDefault();
  
  // Get product info from the nearest showcase/product card
  const card = e.target.closest('.showcase, .product-card');
  if (!card) return;
  
  const titleEl = card.querySelector('.showcase-title, .product-title');
  const priceEl = card.querySelector('.price');
  const imgEl = card.querySelector('img');
  
  if (!titleEl || !priceEl) return;
  
  const name = titleEl.textContent.trim();
  const price = parseFloat(priceEl.textContent.replace(/[₹$,]/g, ''));
  // Stable product id: prefer `data-product-id` on the card, otherwise derive from name+price
  const dataId = card.dataset.productId || card.getAttribute('data-product-id');
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  const id = dataId || `${slug}-${Math.round(price * 100)}`;

  const product = {
    id: id,
    name: name,
    price: price,
    image: imgEl ? imgEl.src : './assets/images/placeholder.jpg'
  };
  
  addToCart(product);
  
  // Visual feedback
  const originalText = e.target.textContent;
  e.target.textContent = '✓ Added!';
  e.target.style.backgroundColor = '#28a745';
  
  setTimeout(() => {
    e.target.textContent = originalText;
    e.target.style.backgroundColor = '';
  }, 1500);
}

// Add product to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart)); 
  updateCart();
  // Navigate to dedicated cart page so user can review items
  window.location.href = './cart.html';
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }
  }
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
  }
}

// Update cart display
function updateCart() {
  // Update cart count badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
  
  // Update cart total (for sidebar - kept if sidebar is re-enabled)
  if (cartTotalElement) {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `₹${totalPrice.toFixed(2)}`;
  }
  
  // Update cart items container (for sidebar - kept if sidebar is re-enabled)
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty</p>';
      return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-wrapper" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div class="details">
          <div>
            <h4>${item.name}</h4>
            <p>₹${item.price.toFixed(2)}</p>
          </div>
          <div class="cart-item-controls" role="group" aria-label="Quantity controls">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
            <button class="remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Make functions globally accessible
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

// Event delegation for cart controls (increase/decrease/remove)
if (cartItemsContainer) {
  cartItemsContainer.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'remove') {
      removeFromCart(id);
    } else if (action === 'increase') {
      updateQuantity(id, 1);
    } else if (action === 'decrease') {
      updateQuantity(id, -1);
    }
  });
}

// ==========================================
// MODAL SYSTEM
// ==========================================

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { 
  if (modal) modal.classList.add('closed') 
}

// modal eventListener
if (modalCloseOverlay) {
  modalCloseOverlay.addEventListener('click', modalCloseFunc);
}
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', modalCloseFunc);
}

// ==========================================
// NOTIFICATION TOAST SYSTEM
// ==========================================

// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
if (toastCloseBtn) {
  toastCloseBtn.addEventListener('click', function () {
    notificationToast.classList.add('closed');
  });
}

// ==========================================
// MOBILE MENU SYSTEM
// ==========================================

// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    if (mobileMenu[i]) mobileMenu[i].classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    if (mobileMenu[i]) mobileMenu[i].classList.add('active');
    if (overlay) overlay.classList.add('active');
  });

  if (mobileMenuCloseBtn[i]) {
    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  }
  if (overlay) {
    overlay.addEventListener('click', mobileMenuCloseFunc);
  }

}

// ==========================================
// ACCORDION SYSTEM
// ==========================================

// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}

// ==========================================
// SIDEBAR SYSTEM
// ==========================================

// sidebar variables
const sidebarBtn = document.querySelectorAll('[data-sidebar-open-btn]');
const sidebar = document.querySelectorAll('[data-sidebar]');
const sidebarCloseBtn = document.querySelectorAll('[data-sidebar-close-btn]');

for (let i = 0; i < sidebarBtn.length; i++) {

  const sidebarCloseFunc = function () {
    if (sidebar[i]) sidebar[i].classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  sidebarBtn[i].addEventListener('click', function () {
    if (sidebar[i]) sidebar[i].classList.add('active');
    if (overlay) overlay.classList.add('active');
  });

  if (sidebarCloseBtn[i]) {
    sidebarCloseBtn[i].addEventListener('click', sidebarCloseFunc);
  }
  if (overlay) {
    overlay.addEventListener('click', sidebarCloseFunc);
  }

}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize on DOM ready (single robust handler)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCart);
} else {
  initCart();
}
