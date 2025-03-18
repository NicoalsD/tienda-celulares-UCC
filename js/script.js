const products = [
    { id: 1, name: "Google Pixel 7", brand: "google", price: 600, image: "img/pixel7.png", description: "Un celular con la mejor cámara de Google." },
    { id: 2, name: "Samsung Galaxy S23", brand: "samsung", price: 800, image: "img/s23.png", description: "Rendimiento increíble y pantalla espectacular." },
    { id: 3, name: "iPhone 14", brand: "iphone", price: 900, image: "img/iphone14.png", description: "La última innovación de Apple en tus manos." },
    { id: 4, name: "Nothing Phone 2", brand: "nothing", price: 700, image: "img/nothing2.png", description: "Diseño minimalista y tecnología avanzada." },
    { id: 5, name: "iPhone 13", brand: "iphone", price: 850, image: "img/iphone13.png", description: "Rendimiento increíble con el chip A15 Bionic." },
    { id: 6, name: "Samsung Galaxy S22", brand: "samsung", price: 750, image: "img/s22.png", description: "Pantalla AMOLED con 120Hz de refresco." }
];

// Referencias de elementos del DOM
const productList = document.getElementById("productList");
const brandFilter = document.getElementById("brandFilter");
const sortOption = document.getElementById("sortOption");
const cartButton = document.getElementById("cartButton");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// Crear el carrito si no existe
let cartDiv = document.getElementById("cart");
if (!cartDiv) {
    cartDiv = document.createElement("div");
    cartDiv.id = "cart";
    document.body.appendChild(cartDiv);
    
    cartDiv.innerHTML = `
        <div class="cart-header">
            <h2>Carrito de compras</h2>
            <button class="close-cart" id="closeCart">×</button>
        </div>
        <ul class="cart-items" id="cartItems">
            <!-- Items en el carrito generados dinámicamente -->
        </ul>
        <div class="cart-total">
            <span>Total:</span>
            <span>$<span id="cartTotal">0</span> USD</span>
        </div>
        <button id="checkout-btn">Finalizar compra</button>
    `;
}

// Actualizar referencias después de crear el carrito
const closeCart = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkout-btn");

// Estado del carrito
let cart = [];

// Función para renderizar productos en la página
function renderProducts(filteredProducts) {
    productList.innerHTML = "";
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "product fadeIn";
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>$${product.price} USD</strong></p>
            <div class="product-buttons">
                <button class="buy-now">Comprar</button>
                <button class="add-to-cart" data-id="${product.id}">Añadir</button>
            </div>
        `;
        
        // Agregar el elemento del producto a la lista
        productList.appendChild(productElement);
    });
    
    // Añadir event listeners a los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Filtrar y ordenar productos
function filterAndSortProducts() {
    let filtered = products.filter(p => 
        brandFilter.value === "all" || p.brand === brandFilter.value
    );

    switch (sortOption.value) {
        case "price-asc":
            filtered.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            filtered.sort((a, b) => b.price - a.price);
            break;
        case "name-asc":
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "name-desc":
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    renderProducts(filtered);
}

// Añadir producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Verificar si el producto ya está en el carrito
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex >= 0) {
            // Si ya existe, incrementar cantidad
            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        } else {
            // Si no existe, agregar con cantidad 1
            cart.push({...product, quantity: 1});
        }
        
        updateCart();
        animateCart();
        openCart();
    }
}

// Remover producto del carrito
function removeFromCart(index) {
    // Eliminar el producto del carrito
    cart.splice(index, 1);
    updateCart();
}

// Actualizar la visualización del carrito
function updateCart() {
    if (!cartItems) return;
    
    cartItems.innerHTML = "";
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = "<li>Tu carrito está vacío</li>";
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * (item.quantity || 1);
            total += itemTotal;
            
            cartItems.innerHTML += `
                <li>
                    <div>
                        <strong>${item.name}</strong>
                        ${item.quantity > 1 ? `<span> x${item.quantity}</span>` : ''}
                        <div>$${item.price} USD</div>
                    </div>
                    <button class="remove-item" data-index="${index}">Eliminar</button>
                </li>
            `;
        });
    }
    
    // Actualizar total y conteo en el carrito
    if (cartTotal) cartTotal.innerText = total;
    if (cartCount) cartCount.innerText = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Añadir event listeners a los botones de eliminar
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Animar el botón del carrito
function animateCart() {
    if (!cartButton) return;
    
    cartButton.classList.remove("bounce");
    // Este timeout es necesario para reiniciar la animación
    setTimeout(() => {
        cartButton.classList.add("bounce");
    }, 10);
}

// Abrir el carrito
function openCart() {
    if (!cartDiv) return;
    cartDiv.classList.add("cart-visible");
}

// Cerrar el carrito
function closeCartMenu() {
    if (!cartDiv) return;
    cartDiv.classList.remove("cart-visible");
}

// Event listeners
function setupEventListeners() {
    if (cartButton) cartButton.addEventListener("click", openCart);
    if (closeCart) closeCart.addEventListener("click", closeCartMenu);
    if (brandFilter) brandFilter.addEventListener("change", filterAndSortProducts);
    if (sortOption) sortOption.addEventListener("change", filterAndSortProducts);
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            if (cart.length > 0) {
                alert("¡Gracias por tu compra!");
                cart = [];
                updateCart();
                closeCartMenu();
            }
        });
    }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
    renderProducts(products);
    setupEventListeners();
    updateCart();
}); 