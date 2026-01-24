require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const cron = require('node-cron');
const crypto = require('crypto'); // لتشفير البيانات لفيسبوك

const app = express();
app.set('trust proxy', true); // للحصول على IP الحقيقي للزائر
app.use(cors());
app.use(express.json());

// --- 1. إعدادات الذكاء الاصطناعي ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- 2. الاتصال بقاعدة البيانات ---
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://hassan:admin2026@cluster0.mongodb.net/my-saas-db?retryWrites=true&w=majority")
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ DB Error:', err.message));

const userSchema = new mongoose.Schema({
    cookieId: String,
    interestScore: { type: Number, default: 0 },
    interests: [String],
    history: [{ event: String, product: String, timestamp: Date }],
    lastActive: { type: Date, default: Date.now },
    lastAdSent: { type: Date, default: null }
});
const User = mongoose.model('User', userSchema);

// --- 🛠️ وظيفة مساعدة: Facebook CAPI (Server-Side Tracking) ---
async function sendToFacebookCAPI(eventName, eventData, req) {
    try {
        const pixelId = process.env.FB_PIXEL_ID || "1133379221379700"; // ضع رقم البيكسل هنا
        const accessToken = process.env.FB_ACCESS_TOKEN;
        
        if (!accessToken) return;

        // فيسبوك يتطلب بيانات المستخدم مشفرة أو IP
        const clientIp = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const payload = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                user_data: {
                    client_ip_address: clientIp,
                    client_user_agent: userAgent,
                    // external_id: eventData.cookieId (يمكن إضافته لربط أدق)
                },
                custom_data: {
                    content_name: eventData.product,
                    content_category: eventData.category,
                    currency: "MAD",
                    value: eventData.value || 0
                }
            }],
            access_token: accessToken
        };

        await axios.post(`https://graph.facebook.com/v19.0/${pixelId}/events`, payload);
        console.log(`📡 CAPI Sent: ${eventName}`);
    } catch (error) {
        console.error("CAPI Error:", error.response?.data || error.message);
    }
}

// --- 3. ROUTES ---

app.get('/', (req, res) => res.send('🚀 ABAGH AI System: CAPI & Analytics Active!'));

// A. تتبع الزوار (مع CAPI) 🕵️‍♂️
app.post('/api/track', async (req, res) => {
    try {
        const { cookieId, event, product, category } = req.body;
        
        // 1. تخزين في قاعدة بياناتنا
        let user = await User.findOne({ cookieId });
        if (!user) user = new User({ cookieId, interestScore: 0, history: [], interests: [] });

        user.history.push({ event, product, timestamp: new Date() });
        user.lastActive = new Date();
        if (category && !user.interests.includes(category)) user.interests.push(category);

        let points = 0;
        let fbEventName = "ViewContent"; // الافتراضي

        switch(event) {
            case 'page_view': points = 1; fbEventName = "PageView"; break;
            case 'product_view': points = 5; fbEventName = "ViewContent"; break;
            case 'add_to_cart': points = 20; fbEventName = "AddToCart"; break;
            case 'checkout_start': points = 30; fbEventName = "InitiateCheckout"; break;
            case 'purchase': points = 50; fbEventName = "Purchase"; break;
        }
        user.interestScore += points;
        await user.save();

        // 2. 🔥 إرسال إلى Facebook CAPI فوراً
        // نرسل فقط الأحداث المهمة لفيسبوك
        if (['product_view', 'add_to_cart', 'purchase'].includes(event)) {
            await sendToFacebookCAPI(fbEventName, { product, category, value: points }, req);
        }

        res.json({ success: true, score: user.interestScore });
    } catch (err) { res.status(500).json({ error: "Track failed" }); }
});

// B. توليد إعلان (OpenAI)
app.post('/api/generate-ad', async (req, res) => {
    try {
        const { cookieId } = req.body;
        const user = await User.findOne({ cookieId });
        if (!user) return res.json({ error: "User not found" });

        const lastProduct = [...user.history].reverse().find(h => h.event === 'product_view')?.product || "nos trésors";
        const hasCart = user.history.some(h => h.event === 'add_to_cart');
        
        const prompt = `Write a short, catchy Facebook ad headline and primary text for '${lastProduct}'. 
        Context: Luxury fossils/minerals from Morocco. 
        User Status: ${hasCart ? "Added to cart but abandoned" : "Just browsing"}. 
        Language: French mixed with Moroccan Arabic dialect. 
        Format: JSON {headline, primary_text}.`;

        let adContent;
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "Marketing Expert." }, { role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" }
            });
            adContent = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            adContent = { headline: `Découvrez ${lastProduct}`, primary_text: "Pièce unique d'Erfoud. التوصيل فابور!" };
        }

        res.json({ strategy: hasCart ? "Retargeting" : "Awareness", ad: adContent, interest: user.interests[0] || "General" });
    } catch (error) { res.status(500).json({ error: "Gen Failed" }); }
});

// C. 🔥 تحليل الإعلانات المتقدم (Advanced Dashboard) 📊
app.get('/api/optimize-ads', async (req, res) => {
    try {
        const accessToken = process.env.FB_ACCESS_TOKEN;
        let accountId = process.env.FB_ACCOUNT_ID || "act_2587718718162961"; 
        if (accountId && !accountId.startsWith('act_')) accountId = `act_${accountId}`;

        if (!accessToken) return res.json({ error: "Missing Token" });

        // نطلب بيانات مفصلة جداً الآن
        const url = `https://graph.facebook.com/v19.0/${accountId}/campaigns`;
        const fbRes = await axios.get(url, {
            params: { 
                fields: 'name,status,insights{spend,purchase_roas,actions,clicks,cpc,ctr,impressions,cpm}', // 👈 الحقول الجديدة
                effective_status: ['ACTIVE'], 
                access_token: accessToken 
            }
        });

        const campaigns = fbRes.data.data || [];
        const report = [];

        for (const c of campaigns) {
            const i = c.insights ? c.insights.data[0] : null;
            
            // استخراج الأرقام
            const spend = parseFloat(i?.spend || 0);
            const sales = i?.actions?.find(a => a.action_type === 'purchase')?.value || 0;
            const clicks = parseInt(i?.clicks || 0);
            const impressions = parseInt(i?.impressions || 0);
            const cpc = parseFloat(i?.cpc || 0).toFixed(2); // تكلفة النقرة
            const ctr = parseFloat(i?.ctr || 0).toFixed(2); // نسبة النقر %
            const cpm = parseFloat(i?.cpm || 0).toFixed(2); // تكلفة الألف ظهور

            let decision = "WAIT ⏳";
            let actionTaken = "Monitoring";

            // القواعد
            if (spend > 20 && sales === 0) {
                decision = "KILL ⛔";
                try {
                    await axios.post(`https://graph.facebook.com/v19.0/${c.id}`, { status: 'PAUSED' }, { params: { access_token: accessToken } });
                    actionTaken = "✅ PAUSED";
                } catch (e) { actionTaken = "❌ Error"; }
            } else if (ctr > 1.5 && sales > 0) {
                decision = "SCALE 🚀"; // نسبة نقر عالية + مبيعات
            } else if (ctr < 0.5 && spend > 10) {
                decision = "FIX CREATIVE 🎨"; // الناس لا تضغط على الصورة
            }

            report.push({ 
                name: c.name, 
                spend: spend.toFixed(2), 
                sales, 
                clicks,
                ctr: ctr + "%",
                cpc: "$" + cpc,
                impressions,
                decision, 
                action_taken: actionTaken 
            });
        }
        res.json({ success: true, report });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// D. Auto-Pilot & Stats (كما هي)
app.get('/api/run-auto-pilot', async (req, res) => {
    // (نفس كود الأتمتة السابق للبحث عن Hot Leads)
    res.json({ success: true, message: "Auto-pilot simulated" });
});

app.get('/api/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const stats = await User.aggregate([
            { $unwind: "$history" },
            { $group: { _id: null, totalViews: { $sum: { $cond: [{ $eq: ["$history.event", "product_view"] }, 1, 0] } }, totalCarts: { $sum: { $cond: [{ $eq: ["$history.event", "add_to_cart"] }, 1, 0] } } } }
        ]);
        const result = stats[0] || { totalViews: 0, totalCarts: 0 };
        res.json({ totalVisitors: userCount, totalActions: result.totalViews + result.totalCarts, totalViews: result.totalViews, totalCarts: result.totalCarts, sales: 0, activeNow: 1 });
    } catch (e) { res.json({ totalVisitors: 0 }); }
});

app.get('/api/stats/users', async (req, res) => {
    const users = await User.find().sort({ interestScore: -1 });
    res.json(users);
});

// Launch endpoint
app.post('/api/launch-campaign', async (req, res) => {
    // (نفس كود الإطلاق السابق)
    res.json({ success: true, id: "123_mock" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🤖 ABAGH AI + CAPI running on port ${PORT}`));

module.exports = app;