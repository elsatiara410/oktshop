// Product data
const products = [
    { id: 1, name: 'Polaroid', price: 50000, image: 'https://via.placeholder.com/300x300?text=Polaroid' },
    { id: 2, name: 'Photostrip', price: 30000, image: 'https://via.placeholder.com/300x300?text=Photostrip' },
    { id: 3, name: 'Keychain', price: 20000, image: 'https://via.placeholder.com/300x300?text=Keychain' },
    { id: 4, name: 'FC / Print Foto', price: 25000, image: 'https://via.placeholder.com/300x300?text=FC+Print' }
];

// Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products on products page
if (document.getElementById('product-grid')) {
    displayProducts(products);
}

// Search functionality
if (document.getElementById('search')) {
    document.getElementById('search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        displayProducts(filtered);
    });
}

// Display products
function displayProducts(prods) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    prods.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>Rp ${p.price.toLocaleString()}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

// Add to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
}

// Load cart on checkout page
if (document.getElementById('cart-items')) {
    displayCart();
    updateTotal();
}

// Display cart
function displayCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        container.appendChild(itemDiv);
    });
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateTotal();
}

// Update total
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('total-price').textContent = `Rp ${total.toLocaleString()}`;
}

// Checkout via WhatsApp
if (document.getElementById('checkout-btn')) {
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        let message = 'Order Details:\n';
        cart.forEach(item => {
            message += `${item.name} - Quantity: ${item.quantity} - Price: Rp ${(item.price * item.quantity).toLocaleString()}\n`;
        });
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        message += `Total: Rp ${total.toLocaleString()}`;
        const url = `https://wa.me/6289643969986?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
}