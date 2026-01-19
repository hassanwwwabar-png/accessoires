/* =========================================
   1. AI TRACKING SYSTEM (CONNECTS TO BACKEND)
   ================================********* */

// Generate a unique ID for the visitor
function getCookieId() {
    let id = localStorage.getItem('user_tracking_id');
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user_tracking_id', id);
    }
    return id;
}

const USER_ID = getCookieId();
//  CHANGE THIS URL when you deploy your Node.js server
const API_URL = '/api/track';

async function trackEvent(eventType, productData = {}) {
    try {
        // We use 'no-cors' mode just to prevent browser errors if server is off during testing
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cookieId: USER_ID,
                eventType: eventType,
                productData: productData
            })
        });
        // console.log(`📡 Event Sent: ${eventType}`);
    } catch (error) {
        // Silently fail if server is not running (so website keeps working)
        // console.log("Tracking server offline");
    }
}

// Track initial page view
trackEvent('page_view', { page: document.title });


/* =========================================
   2. PRODUCT DATABASE (40 ITEMS)
   ================================********* */
const products = [
    // --- مجموعة 2025 (المجموعة القديمة) ---
    { name: "Acier ", cat: "limitee", old: "250 DH", price: 199, img: "images/WhatsApp Image 2025-12-19 at 16.43.10 (1).jpeg", promo: true },
    { name: "Acier", cat: "limitee", old: "250 DH", price: 199, img: "images/WhatsApp Image 2025-12-19 at 16.43.10.jpeg", promo: false },
    { name: "Acier", cat: "limitee", old: "250 DH", price: 199, img: "images/WhatsApp Image 2025-12-19 at 16.43.11 (1).jpeg", promo: true },
    { name: "Acier", cat: "limitee", old: "250 DH", price: 199, img: "images/WhatsApp Image 2025-12-19 at 16.43.11.jpeg", promo: false },
    
    // --- مجموعة المجوهرات (Jewelry) ---
    { name: "lensemble", cat: "limitee", old: "400 DH", price: 350, img: "images/WhatsApp Image 2025-12-20 at 15.46.33.jpeg", promo: true },
    { name: "lensemble", cat: "limitee", old: "199 DH", price: 150, img: "images/WhatsApp Image 2025-12-20 at 15.47.00.jpeg", promo: false },
    { name: "lensemble", cat: "limitee", old: "199 DH", price: 150, img: "images/WhatsApp Image 2025-12-20 at 15.47.01.jpeg", promo: true },
    { name: "lensemble", cat: "limitee", old: "300 DH", price: 199, img: "images/WhatsApp Image 2025-12-20 at 15.47.31.jpeg", promo: false },
    { name: "lensemble", cat: "limitee", old: "199DH", price: 150, img: "images/WhatsApp Image 2025-12-20 at 15.47.32.jpeg", promo: true },
    // --- الأحجار الكريمة (Minerals) ---
    { name: "Améthyste Brute #1", cat: "limitee", old: "300 DH", price: 220, img: "images/WhatsApp Image 2025-12-20 at 15.56.15.jpeg", promo: true },
    { name: "Améthyste Brute #2", cat: "limitee", old: "320 DH", price: 240, img: "images/WhatsApp Image 2025-12-20 at 15.56.30.jpeg", promo: false },
    { name: "Quartz Rose #1", cat: "limitee", old: "180 DH", price: 140, img: "images/WhatsApp Image 2025-12-21 at 18.36.25.jpeg", promo: true },
    { name: "Quartz Rose #2", cat: "limitee", old: "200 DH", price: 160, img: "images/WhatsApp Image 2025-12-21 at 18.37.17.jpeg", promo: false },
    { name: "Obsidienne Noire", cat: "limitee", old: "250 DH", price: 190, img: "images/WhatsApp Image 2025-12-23 at 22.17.07.jpeg", promo: true },
    // --- مجموعة 2026 الجديدة (New Arrivals) ---
    { name: "New Arrival - Art #1", cat: "Art", old: "450 DH", price: 300, img: "images/WhatsApp Image 2026-01-02 at 13.07.55 (1).jpeg", promo: true },
    { name: "New Arrival - Art #2", cat: "Art", old: "450 DH", price: 300, img: "images/WhatsApp Image 2026-01-02 at 13.07.55 (2).jpeg", promo: false },
    { name: "New Arrival - Art #3", cat: "Art", old: "450 DH", price: 300, img: "images/WhatsApp Image 2026-01-02 at 13.07.55.jpeg", promo: true },
    { name: "Pièce Sculptée #1", cat: "Sculpture", old: "300 DH", price: 199, img: "images/WhatsApp Image 2026-01-02 at 13.11.25.jpeg", promo: false },
    
    // --- عناصر متنوعة (Misc) ---
    { name: "Trésor Caché #1", cat: "Divers", old: "120 DH", price: 90, img: "images/WhatsApp Image 2026-01-02 at 13.13.34 (1).jpeg", promo: true },
    { name: "Trésor Caché #2", cat: "Divers", old: "130 DH", price: 95, img: "images/WhatsApp Image 2026-01-02 at 13.13.34 (2).jpeg", promo: false },
    { name: "Trésor Caché #3", cat: "Divers", old: "140 DH", price: 100, img: "images/WhatsApp Image 2026-01-02 at 13.13.34.jpeg", promo: true },
    { name: "Trésor Caché #4", cat: "Divers", old: "150 DH", price: 110, img: "images/WhatsApp Image 2026-01-02 at 13.13.35.jpeg", promo: false },
    { name: "Trésor Caché #5", cat: "Divers", old: "160 DH", price: 120, img: "images/WhatsApp Image 2026-01-02 at 13.13.36.jpeg", promo: true },
    { name: "Trésor Caché #6", cat: "Divers", old: "170 DH", price: 130, img: "images/WhatsApp Image 2026-01-02 at 13.13.37 (1).jpeg", promo: false },
    { name: "Trésor Caché #7", cat: "Divers", old: "180 DH", price: 140, img: "images/WhatsApp Image 2026-01-02 at 13.13.37.jpeg", promo: true },
    
    // --- الباقي (Bulk Generation) ---
    { name: "Item Exclusive A1", cat: "Fossile", old: "300 DH", price: 250, img: "images/WhatsApp Image 2026-01-02 at 13.14.34 (1).jpeg", promo: false },
    { name: "Item Exclusive A2", cat: "Fossile", old: "300 DH", price: 250, img: "images/WhatsApp Image 2026-01-02 at 13.14.34.jpeg", promo: true },
    { name: "Item Exclusive B1", cat: "Bijoux", old: "400 DH", price: 320, img: "images/WhatsApp Image 2026-01-02 at 13.25.10.jpeg", promo: false },
    { name: "Item Exclusive C1", cat: "Minéral", old: "200 DH", price: 150, img: "images/WhatsApp Image 2026-01-02 at 13.34.49.jpeg", promo: true },
    { name: "Item Exclusive C2", cat: "Minéral", old: "220 DH", price: 170, img: "images/WhatsApp Image 2026-01-02 at 13.34.54.jpeg", promo: false },
    { name: "Item Exclusive D1", cat: "Art", old: "500 DH", price: 420, img: "images/WhatsApp Image 2026-01-02 at 13.37.43.jpeg", promo: true },
    
    // --- مجموعة يناير 2026 (Recent) ---
    { name: "Jan 2026 Special #1", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.08.37.jpeg", promo: true },
    { name: "Jan 2026 Special #2", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.50 (1).jpeg", promo: false },
    { name: "Jan 2026 Special #3", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.50.jpeg", promo: true },
    { name: "Jan 2026 Special #4", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.51 (1).jpeg", promo: false },
    { name: "Jan 2026 Special #5", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.51 (2).jpeg", promo: true },
    { name: "Jan 2026 Special #6", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.51.jpeg", promo: false },
    { name: "Jan 2026 Special #7", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.52 (1).jpeg", promo: true },
    { name: "Jan 2026 Special #8", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.52 (2).jpeg", promo: false },
    { name: "Jan 2026 Special #9", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.09.52.jpeg", promo: true },
    { name: "Jan 2026 Special #10", cat: "New", old: "350 DH", price: 299, img: "images/WhatsApp Image 2026-01-07 at 07.10.36.jpeg", promo: false },
    
    // --- بقية المجموعة (The Rest) ---
    { name: "Collection Fin #1", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-07 at 07.30.28 (1).jpeg", promo: true },
    { name: "Collection Fin #2", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-07 at 07.30.28 (2).jpeg", promo: false },
    { name: "Collection Fin #3", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-07 at 07.30.28.jpeg", promo: true },
    { name: "Collection Fin #4", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-07 at 07.30.29 (1).jpeg", promo: false },
    { name: "Collection Fin #5", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-07 at 07.30.29 (2).jpeg", promo: true },
    { name: "Collection Fin #6", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-07 at 07.30.29.jpeg", promo: false },
    { name: "Collection Fin #7", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-10 at 19.26.47.jpeg", promo: true },
    { name: "Collection Fin #8", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-10 at 19.27.19 (1).jpeg", promo: false },
    { name: "Collection Fin #9", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-10 at 19.27.19 (2).jpeg", promo: true },
    { name: "Collection Fin #10", cat: "General", price: 180, img: "images/WhatsApp Image 2026-01-10 at 19.27.19.jpeg", promo: false },
    
    // إضافة الصور الأخيرة (2026-01-12)
    { name: "New Drop #1", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.22.43.jpeg", promo: true },
    { name: "New Drop #2", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.26.18.jpeg", promo: false },
    { name: "New Drop #3", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.26.19 (1).jpeg", promo: true },
    { name: "New Drop #4", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.26.19 (2).jpeg", promo: false },
    { name: "New Drop #5", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.26.19.jpeg", promo: true },
    { name: "New Drop #6", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.27.48.jpeg", promo: false },
    { name: "New Drop #7", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.31.33 (1).jpeg", promo: true },
    { name: "New Drop #8", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.31.33.jpeg", promo: false },
    { name: "New Drop #9", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.18 (1).jpeg", promo: true },
    { name: "New Drop #10", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.18.jpeg", promo: false },
    { name: "New Drop #11", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.19 (1).jpeg", promo: true },
    { name: "New Drop #12", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.19 (2).jpeg", promo: false },
    { name: "New Drop #13", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.19.jpeg", promo: true },
    { name: "New Drop #14", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.20 (1).jpeg", promo: false },
    { name: "New Drop #15", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.20 (2).jpeg", promo: true },
    { name: "New Drop #16", cat: "New", price: 220, img: "images/WhatsApp Image 2026-01-12 at 21.32.20.jpeg", promo: false },
    { name: "Last Piece", cat: "Exclusive", price: 500, img: "images/WhatsApp Image 2026-01-12 at 21.34.12 (1).jpeg", promo: true }
];
 

/* =========================================
   3. INITIALIZATION & STATE
   ================================********* */

// Load cart from LocalStorage or start empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const grid = document.getElementById('productGrid');
const cartModal = document.getElementById('guideModal');
const productViewModal = document.getElementById('productViewModal');

// Update the red badge on load
updateCartCount();

// Start by rendering all products
window.onload = function() {
    renderProducts(products);
};


/* =========================================
   4. CORE FUNCTIONS (RENDER & FILTER)
   ================================********* */

// --- Filter Logic ---
function filterProducts(category, btnElement) {
    // 1. Visual change for buttons
    if (btnElement) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }
    
    // 2. Filter Data
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.cat === category);
        renderProducts(filtered);
    }
}

// --- Render Logic (The most important part) ---
function renderProducts(filteredList) {
    const list = filteredList || products;

    // Empty state check
    if (list.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">Aucun produit trouvé dans cette catégorie.</div>`;
        return;
    }

    grid.innerHTML = list.map(product => {
        // SAFETY: Always find the *original* index in the main 'products' array
        // This ensures clicking an image opens the correct product, even after filtering.
        const originalIndex = products.indexOf(product);

        const badge = product.promo ? `<div class="badge-sale">-20%</div>` : '';
        const oldPriceDisplay = product.old ? `<span class="old-price">${product.old}</span>` : '';
        let priceDisplay = typeof product.price === 'number' ? product.price + " DH" : product.price;

        return `
        <div class="product-card">
            ${badge}
            <div class="img-container" onclick="openProductModal(${originalIndex})" style="cursor: pointer;">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
            </div>
            
            <div class="info">
                <span class="category">${product.cat}</span>
                <h3 class="name" onclick="openProductModal(${originalIndex})" style="cursor: pointer;">${product.name}</h3>
                
                <div class="price-box">
                    ${oldPriceDisplay}
                    <span class="new-price">${priceDisplay}</span>
                </div>
                
                <div class="action-buttons">
                    <button class="cart-btn" onclick="addToCart(${originalIndex})" title="Ajouter au panier">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <a href="https://wa.me/212660571862?text=Je suis intéressé par : ${product.name}" class="wa-btn" target="_blank">
                        ACHETER
                    </a>
                </div>
            </div>
        </div>
        `;
    }).join('');
}


/* =========================================
   5. PRODUCT DETAIL MODAL (QUICK VIEW)
   ================================********* */

function openProductModal(index) {
    const product = products[index];
    const content = document.getElementById('productDetailBody');
    
    // Format Price
    let priceDisplay = typeof product.price === 'number' ? product.price + " DH" : product.price;
    
    // Generate Description based on Category
    let desc = "Cette pièce unique provient des richesses géologiques d'Erfoud. Un véritable chef-d'œuvre naturel, soigneusement sélectionné pour sa qualité et son esthétique.";
    if(product.cat === 'Bijoux') desc = "Un bijou artisanal fait main, alliant élégance et histoire géologique.";
    if(product.cat === 'Minéral') desc = "Un minéral brut ou poli, extrait des profondeurs de l'Atlas marocain.";

    // TRACKING: Send event to AI system
    trackEvent('product_view', { id: index, name: product.name, category: product.cat });

    content.innerHTML = `
        <div class="product-detail-wrapper">
            <div class="detail-image">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="detail-info">
                <span class="detail-cat">${product.cat}</span>
                <h2 class="detail-title">${product.name}</h2>
                <div class="detail-price">
                    ${product.old ? `<span style="text-decoration:line-through; color:#ccc; font-size:1rem; margin-right:10px;">${product.old}</span>` : ''}
                    ${priceDisplay}
                </div>
                <p class="detail-desc">${desc}</p>
                
                <div class="action-buttons" style="width: 100%;">
                    <button class="cart-btn" onclick="addToCart(${index}); closeProductModal();" style="flex:1; padding: 15px;">
                        AJOUTER AU PANIER
                    </button>
                    <a href="https://wa.me/212660571862?text=Je suis intéressé par : ${product.name}" class="wa-btn" target="_blank" style="flex:1; text-align:center;">
                        COMMANDER
                    </a>
                </div>
                <div style="margin-top: 15px; font-size: 0.8rem; color: #888;">
                    <i class="fas fa-truck"></i> Livraison partout au Maroc <br>
                    <i class="fas fa-check-circle"></i> Authenticité Garantie
                </div>
            </div>
        </div>
    `;

    productViewModal.style.display = 'flex';
}

function closeProductModal() {
    productViewModal.style.display = 'none';
}


/* =========================================
   6. CART LOGIC & LOCAL STORAGE
   ================================********* */

function addToCart(index) {
    const product = products[index];
    
    // Add to cart array
    cart.push(product);
    
    // SAVE TO LOCAL STORAGE (The magic part)
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    showToast(`"${product.name}" ajouté au panier !`);

    // TRACKING
    trackEvent('add_to_cart', { id: index, name: product.name, price: product.price });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    
    // Update Storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    toggleModal(); // Re-render the cart modal
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.length;
}


/* =========================================
   7. CART MODAL (WITH IMAGES)
   ================================********* */

function toggleModal() {
    const modalContent = document.querySelector('.modal-box');
    
    if (cart.length === 0) {
        modalContent.innerHTML = `
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <div class="modal-icon" style="color:#ccc;"><i class="fas fa-shopping-basket"></i></div>
            <h3>VOTRE PANIER EST VIDE</h3>
            <p style="color:#999; margin: 15px 0; font-size: 0.9rem;">Ajoutez des pièces uniques à votre collection.</p>
            <button onclick="closeModal()" class="modal-btn" style="background:#888;">RETOUR À LA BOUTIQUE</button>
        `;
    } else {
        let cartItemsHTML = cart.map((item, i) => {
            // Find original index to allow clicking back to product
            let originalIndex = products.findIndex(p => p.name === item.name);

            return `
            <li style="border-bottom:1px solid #f0f0f0; padding: 15px 0; display: flex; align-items: center; justify-content: space-between;">
                
                <div onclick="closeModal(); openProductModal(${originalIndex})" 
                     style="display: flex; align-items: center; gap: 15px; cursor: pointer; flex-grow: 1;">
                    <img src="${item.img}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 5px; border: 1px solid #ddd;">
                    <div style="text-align: left;">
                        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 5px; color: var(--text-dark);">${item.name}</div>
                        <div style="color: #C59D5F; font-family: 'Cinzel', serif; font-weight: 600;">
                            ${typeof item.price === 'number' ? item.price + ' DH' : item.price}
                        </div>
                    </div>
                </div>

                <i class="fas fa-trash" style="color: #A35D4D; cursor: pointer; font-size: 1.1rem; padding: 10px;" 
                   onclick="removeFromCart(${i})" title="Retirer"></i>
            </li>
            `;
        }).join('');

        // Calculate Total
        let total = cart.reduce((sum, item) => sum + (typeof item.price === 'number' ? item.price : 0), 0);
        let totalDisplay = total > 0 ? `<div style="text-align: right; margin: 15px 0; font-weight: bold; font-size: 1.1rem;">TOTAL: ${total} DH</div>` : '';

        // WhatsApp Message
        let waMessage = "Bonjour, je souhaite commander :%0A" + cart.map(i => "- " + i.name).join("%0A");
        if(total > 0) waMessage += "%0A*Total: " + total + " DH*";

        // TRACKING: Checkout started
        trackEvent('checkout_start', { total_value: total });

        modalContent.innerHTML = `
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <h3 style="border-bottom: 2px solid #C59D5F; padding-bottom: 10px; margin-bottom: 20px;">VOTRE PANIER (${cart.length})</h3>
            
            <ul class="modal-steps" style="max-height: 300px; overflow-y: auto; list-style: none; margin: 0; padding: 0;">
                ${cartItemsHTML}
            </ul>

            ${totalDisplay}

            <a href="https://wa.me/212660571862?text=${waMessage}" class="modal-btn" target="_blank" style="width: 100%; display: block;">
                <i class="fab fa-whatsapp"></i> COMMANDER TOUT
            </a>
        `;
    }

    cartModal.style.display = 'flex';
}

function closeModal() {
    cartModal.style.display = 'none';
}


/* =========================================
   8. UTILITIES (SEARCH, TOAST, MENU)
   ================================********* */

// Toast Notification
function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Search Function
function toggleSearch() {
    document.getElementById('searchBar').classList.toggle('active');
    document.getElementById('searchInput').focus();
}

document.getElementById('searchInput').addEventListener('keyup', function(e) {
    const term = e.target.value.toLowerCase();
    
    // Reset filters to 'all' first so search searches everything
    filterProducts('all'); 
    
    const filtered = products.filter(p => p.name.toLowerCase().includes(term) || p.cat.toLowerCase().includes(term));
    renderProducts(filtered);
});

// Mobile Menu
function toggleMenu() { document.getElementById('navMenu').classList.toggle('active'); }
function closeMenu() { document.getElementById('navMenu').classList.remove('active'); }

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == productViewModal) closeProductModal();
    if (event.target == cartModal) closeModal();
}
module.exports = app;