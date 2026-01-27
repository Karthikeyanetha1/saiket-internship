// Sample Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        icon: "headphones",
        rating: 5,
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        icon: "clock",
        rating: 4,
        category: "Electronics"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 49.99,
        icon: "briefcase",
        rating: 5,
        category: "Accessories"
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        price: 59.99,
        icon: "volume-up",
        rating: 4,
        category: "Electronics"
    },
    {
        id: 5,
        name: "Fitness Tracker",
        price: 89.99,
        icon: "heartbeat",
        rating: 5,
        category: "Wearables"
    },
    {
        id: 6,
        name: "Portable Charger",
        price: 29.99,
        icon: "battery-full",
        rating: 4,
        category: "Accessories"
    }
];

// Load Products on Page Load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initNavToggle();
    initAboutToggle();
    initFormValidation();
    initCounters();
});

// Load Products Dynamically
function loadProducts() {
    const container = document.getElementById('productsContainer');
    
    products.forEach(product => {
        const stars = '⭐'.repeat(product.rating);
        
        const productCard = `
            <div class="col-md-6 col-lg-4">
                <div class="product-card">
                    <div class="product-image">
                        <i class="fas fa-${product.icon}"></i>
                    </div>
                    <div class="product-body">
                        <div class="product-title">${product.name}</div>
                        <div class="product-rating">${stars}</div>
                        <div class="product-price">$${product.price}</div>
                        <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += productCard;
    });
}

// Shopping Cart Functionality
let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showAlert('success', `${product.name} added to cart!`);
}

function updateCartCount() {
    const cartLinks = document.querySelectorAll('.nav-link');
    cartLinks.forEach(link => {
        if (link.innerHTML.includes('Cart')) {
            link.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cart.length})`;
        }
    });
}

// Navigation Toggle (for mobile)
function initNavToggle() {
    const navToggle = document.getElementById('navToggle');
    const navbarNav = document.getElementById('navbarNav');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('show');
        });
    }
}

// Smooth Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// About Section Toggle
function initAboutToggle() {
    const toggleBtn = document.getElementById('toggleAbout');
    const moreAbout = document.getElementById('moreAbout');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (moreAbout.style.display === 'none') {
                moreAbout.style.display = 'block';
                toggleBtn.textContent = 'Read Less';
            } else {
                moreAbout.style.display = 'none';
                toggleBtn.textContent = 'Read More';
            }
        });
    }
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('newsletterForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('nameInput');
            const emailInput = document.getElementById('emailInput');
            
            let isValid = true;
            
            // Validate Name
            if (nameInput.value.trim() === '') {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('is-invalid');
                nameInput.classList.add('is-valid');
            }
            
            // Validate Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }
            
            if (isValid) {
                showAlert('success', `Thank you ${nameInput.value}! You've been subscribed successfully!`);
                form.reset();
                nameInput.classList.remove('is-valid');
                emailInput.classList.remove('is-valid');
            }
        });
    }
}

// Show Alert Messages
function showAlert(type, message) {
    const formMessage = document.getElementById('formMessage');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    
    formMessage.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        formMessage.innerHTML = '';
    }, 3000);
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Smooth scroll for all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

console.log('ShopHub E-Commerce Site - Task 2 for SaiKet Systems');
console.log('Created with HTML, CSS, Bootstrap, and Vanilla JavaScript');
