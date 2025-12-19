'use strict';

// Product database
const products = [
  {
    id: 1,
    name: 'Shampoo, Conditioner & Facewash Packs',
    price: 150,
    originalPrice: 200,
    category: 'cosmetic',
    image: './assets/images/products/shampoo.jpg',
    rating: 3,
    reviews: 45
  },
  {
    id: 2,
    name: 'Rose Gold Diamonds Earring',
    price: 1990,
    originalPrice: 2000,
    category: 'jewelry',
    image: './assets/images/products/jewellery-1.jpg',
    rating: 4,
    reviews: 120
  },
  {
    id: 3,
    name: 'Mens Winter Leathers Jackets',
    price: 48,
    originalPrice: 75,
    category: 'jacket',
    image: './assets/images/products/jacket-3.jpg',
    rating: 4,
    reviews: 89
  },
  {
    id: 4,
    name: 'Pure Garment Dyed Cotton Shirt',
    price: 45,
    originalPrice: 56,
    category: 'shirt',
    image: './assets/images/products/shirt-1.jpg',
    rating: 4,
    reviews: 67
  },
  {
    id: 5,
    name: 'MEN Yarn Fleece Full-Zip Jacket',
    price: 58,
    originalPrice: 65,
    category: 'jacket',
    image: './assets/images/products/jacket-5.jpg',
    rating: 5,
    reviews: 156
  },
  {
    id: 6,
    name: 'Black Floral Wrap Midi Skirt',
    price: 25,
    originalPrice: 35,
    category: 'shirt',
    image: './assets/images/products/clothes-3.jpg',
    rating: 5,
    reviews: 234
  },
  {
    id: 7,
    name: 'Casual Men\'s Brown Shoes',
    price: 99,
    originalPrice: 105,
    category: 'shoes',
    image: './assets/images/products/shoe-2.jpg',
    rating: 5,
    reviews: 189
  },
  {
    id: 8,
    name: 'Pocket Watch Leather Pouch',
    price: 150,
    originalPrice: 170,
    category: 'watch',
    image: './assets/images/products/watch-3.jpg',
    rating: 4,
    reviews: 78
  },
  {
    id: 9,
    name: 'Smart Watch Vital Plus',
    price: 100,
    originalPrice: 120,
    category: 'watch',
    image: './assets/images/products/watch-1.jpg',
    rating: 4,
    reviews: 201
  },
  {
    id: 10,
    name: 'Womens Party Wear Shoes',
    price: 25,
    originalPrice: 30,
    category: 'shoes',
    image: './assets/images/products/party-wear-1.jpg',
    rating: 4,
    reviews: 92
  },
  {
    id: 11,
    name: 'Mens Winter Leather Jacket',
    price: 32,
    originalPrice: 45,
    category: 'jacket',
    image: './assets/images/products/jacket-1.jpg',
    rating: 4,
    reviews: 143
  },
  {
    id: 12,
    name: 'Better Basics French Terry Sweatshorts',
    price: 78,
    originalPrice: 85,
    category: 'shirt',
    image: './assets/images/products/shorts-1.jpg',
    rating: 4,
    reviews: 56
  },
  {
    id: 13,
    name: 'Trekking & Running Shoes - Black',
    price: 58,
    originalPrice: 64,
    category: 'shoes',
    image: './assets/images/products/sports-2.jpg',
    rating: 4,
    reviews: 198
  },
  {
    id: 14,
    name: 'Men\'s Leather Formal Wear Shoes',
    price: 50,
    originalPrice: 65,
    category: 'shoes',
    image: './assets/images/products/shoe-1.jpg',
    rating: 4,
    reviews: 167
  },
  {
    id: 15,
    name: 'Relaxed Short Full Sleeve T-Shirt',
    price: 45,
    originalPrice: 55,
    category: 'shirt',
    image: './assets/images/products/jacket-3.jpg',
    rating: 4,
    reviews: 112
  },
  {
    id: 16,
    name: 'Girls Pink Embro Design Top',
    price: 61,
    originalPrice: 75,
    category: 'shirt',
    image: './assets/images/products/shirt-2.jpg',
    rating: 5,
    reviews: 224
  },
  {
    id: 17,
    name: 'Running & Trekking Shoes - White',
    price: 49,
    originalPrice: 60,
    category: 'shoes',
    image: './assets/images/products/shoe-2.jpg',
    rating: 4,
    reviews: 145
  },
  {
    id: 18,
    name: 'Sports Claw Women\'s Shoes',
    price: 54,
    originalPrice: 68,
    category: 'shoes',
    image: './assets/images/products/party-wear-1.jpg',
    rating: 4,
    reviews: 98
  },
  {
    id: 19,
    name: 'Air Trekking Shoes - White',
    price: 52,
    originalPrice: 62,
    category: 'shoes',
    image: './assets/images/products/sports-2.jpg',
    rating: 5,
    reviews: 178
  },
  {
    id: 20,
    name: 'Baby Fabric Shoes',
    price: 4,
    originalPrice: 8,
    category: 'shoes',
    image: './assets/images/products/shoe-1.jpg',
    rating: 5,
    reviews: 289
  }
];

// Global state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [...products];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const sortBy = document.getElementById('sort-by');
const cartToggle = document.querySelector('[data-cart-toggle]');
const cartClose = document.querySelector('[data-cart-close]');
const cartOverlay = document.querySelector('[data-cart-overlay]');
const shoppingCart = document.querySelector('[data-shopping-cart]');
const cartItemsContainer = document.querySelector('[data-cart-items]');
const cartTotal = document.querySelector('[data-cart-total]');
const cartCount = document.querySelector('[data-cart-count]');
const clearCartBtn = document.querySelector('[data-clear-cart]');

// Initialize
function init() {
  renderProducts();
  setupEventListeners();
  updateCart();
}

// Setup event listeners
function setupEventListeners() {
  sortBy.addEventListener('change', handleSort);
  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  clearCartBtn.addEventListener('click', clearCart);
  
  // Filter listeners
  document.getElementById('cat-all').addEventListener('change', () => {
    document.querySelectorAll('.shop-sidebar input[type="checkbox"]').forEach(cb => {
      if (cb.id !== 'cat-all') cb.checked = false;
    });
    filterProducts();
  });

  document.querySelectorAll('.filter-option input[type="checkbox"]:not(#cat-all)').forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
  });

  document.querySelector('button').addEventListener('click', filterByPrice);
}

// Render products
function renderProducts() {
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<div class="no-products">No products found</div>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          ${Array(product.rating).fill(0).map(() => '<ion-icon name="star"></ion-icon>').join('')}
          ${Array(5 - product.rating).fill(0).map(() => '<ion-icon name="star-outline"></ion-icon>').join('')}
          <span style="font-size: 12px; color: #999; margin-left: 5px;">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">₹${product.price}</span>
          <span class="price-original">₹${product.originalPrice}</span>
        </div>
        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `).join('');

  // Add event listeners to buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.productId);
      addToCart(productId);
      e.target.textContent = 'Added!';
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
      }, 1500);
    });
  });
}

// Add to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

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
}

// Update cart display
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = `₹${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" style="padding: 15px; border-bottom: 1px solid #eee; display: flex; gap: 15px;">
      <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
      <div style="flex: 1;">
        <p style="font-weight: 600; margin-bottom: 5px;">${item.name}</p>
        <p style="font-size: 14px; color: #666; margin-bottom: 8px;">₹${item.price} x ${item.quantity}</p>
        <div style="display: flex; gap: 10px;">
          <button style="padding: 4px 8px; background: #f0f0f0; border: none; cursor: pointer; border-radius: 3px; font-size: 12px;" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span style="padding: 4px 8px;">${item.quantity}</span>
          <button style="padding: 4px 8px; background: #f0f0f0; border: none; cursor: pointer; border-radius: 3px; font-size: 12px;" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button style="padding: 4px 8px; background: #ff6b6b; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 12px; margin-left: auto;" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Update quantity
window.updateQuantity = function(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
  }
};

// Remove from cart
window.removeFromCart = function(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
};

// Clear cart
function clearCart() {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// Filter products
function filterProducts() {
  const selectedCategories = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked:not(#cat-all)'))
    .map(cb => cb.value);

  if (selectedCategories.length === 0) {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(p => selectedCategories.includes(p.category));
  }

  renderProducts();
}

// Filter by price
function filterByPrice() {
  const minPrice = parseInt(document.getElementById('price-min').value) || 0;
  const maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;

  filteredProducts = products.filter(p => p.price >= minPrice && p.price <= maxPrice);
  renderProducts();
}

// Sort products
function handleSort(e) {
  const sortValue = e.target.value;

  switch (sortValue) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
      filteredProducts.sort((a, b) => b.reviews - a.reviews);
      break;
    case 'newest':
    default:
      filteredProducts.sort((a, b) => b.id - a.id);
  }

  renderProducts();
}

// Cart toggle
function openCart() {
  shoppingCart.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCart() {
  shoppingCart.classList.remove('active');
  cartOverlay.classList.remove('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
