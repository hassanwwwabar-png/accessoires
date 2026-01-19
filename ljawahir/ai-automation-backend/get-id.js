require('dotenv').config();
const axios = require('axios');

async function getPageID() {
    const token = process.env.FB_ACCESS_TOKEN;
    
    if (!token) {
        console.log("❌ Error: No Access Token found in .env");
        return;
    }

    try {
        console.log("🔍 Searching for your pages...");
        // نطلب من فيسبوك قائمة الصفحات التي تديرها
        const res = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
            params: { access_token: token }
        });

        const pages = res.data.data;

        if (pages.length === 0) {
            console.log("⚠️ No pages found! Make sure you created a Facebook Page.");
        } else {
            console.log("\n✅ FOUND PAGES:");
            pages.forEach(page => {
                console.log(`-----------------------------------`);
                console.log(`📄 Page Name: \x1b[32m${page.name}\x1b[0m`); // لون أخضر
                console.log(`🆔 Page ID:   \x1b[33m${page.id}\x1b[0m`);   // لون أصفر (انسخ هذا)
                console.log(`-----------------------------------`);
            });
        }

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data.error.message : error.message);
    }
}

getPageID();