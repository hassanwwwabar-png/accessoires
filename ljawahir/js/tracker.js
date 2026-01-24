// 🍪 دالة لإنشاء أو جلب بصمة الزائر (Cookie ID)
function getCookieId() {
    let id = localStorage.getItem('user_cookie_id');
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('user_cookie_id', id);
    }
    return id;
}

const USER_ID = getCookieId();
console.log("👤 User ID:", USER_ID);

// 📡 دالة إرسال الحدث للسيرفر
async function trackEvent(eventType, productDetails = {}) {
    try {
        const payload = {
            cookieId: USER_ID,
            event: eventType,
            product: productDetails.name || 'General',
            category: productDetails.category || null
        };

        const res = await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        console.log(`✅ Event [${eventType}] Sent. New Score: ${data.score}`);
        
    } catch (err) {
        console.error("Tracking Error:", err);
    }
}

// 🚀 تتبع تلقائي لزيارة الصفحة
trackEvent('page_view');

// دوال مساعدة للأزرار
function viewProduct(name, category) {
    trackEvent('product_view', { name, category });
}

function addToCart(name) {
    trackEvent('add_to_cart', { name });
    alert("Added to cart! (+20 Points)");
}