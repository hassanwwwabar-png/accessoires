require('dotenv').config();
const axios = require('axios');

const APP_ID = 'ضع_هنا_APP_ID'; 
const APP_SECRET = 'ضع_هنا_APP_SECRET';
const SHORT_TOKEN = process.env.FB_ACCESS_TOKEN; // التوكين الحالي الذي ينتهي بسرعة

async function getLongLivedToken() {
    try {
        // الخطوة 1: تحويل التوكين القصير إلى طويل (60 يوم)
        const response = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: APP_ID,
                client_secret: APP_SECRET,
                fb_exchange_token: SHORT_TOKEN
            }
        });

        const longLivedToken = response.data.access_token;
        console.log("✅ New 60-Day Token Generated!");

        // الخطوة 2: استخراج "توكين الصفحة" الدائم (Never Expires)
        const pageRes = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
            params: { access_token: longLivedToken }
        });

        const pageToken = pageRes.data.data[0].access_token; // أول صفحة في القائمة
        console.log("\n🚀 PERMANENT PAGE TOKEN (Use this in .env):");
        console.log(pageToken);

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
}

getLongLivedToken();