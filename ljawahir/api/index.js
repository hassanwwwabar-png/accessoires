require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai'); // 🧠 العقل الجديد
const cron = require('node-cron');   // ⏰ المنبه الآلي

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. إعدادات الذكاء الاصطناعي (OpenAI) ---
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // تأكد من إضافته في Vercel
});

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
    lastAdSent: { type: Date, default: null } // لمنع تكرار الإعلان لنفس الشخص
});
const User = mongoose.model('User', userSchema);

// --- 3. المسارات (ROUTES) ---

app.get('/', (req, res) => res.send('🚀 ABAGH AI System is Running on 100% Auto-Pilot!'));

// A. تتبع الزوار (Tracking)
app.post('/api/track', async (req, res) => {
    try {
        const { cookieId, event, product, category } = req.body;
        let user = await User.findOne({ cookieId });
        if (!user) user = new User({ cookieId, interestScore: 0, history: [], interests: [] });

        user.history.push({ event, product, timestamp: new Date() });
        user.lastActive = new Date();
        if (category && !user.interests.includes(category)) user.interests.push(category);

        let points = 0;
        switch(event) {
            case 'page_view': points = 1; break;
            case 'product_view': points = 5; break;
            case 'add_to_cart': points = 20; break;
            case 'checkout_start': points = 30; break;
            case 'purchase': points = 50; break;
        }
        user.interestScore += points;
        await user.save();
        res.json({ success: true, score: user.interestScore });
    } catch (err) { res.status(500).json({ error: "Track failed" }); }
});

// B. 🔥 توليد إعلان باستخدام ChatGPT (Generative AI)
app.post('/api/generate-ad', async (req, res) => {
    try {
        const { cookieId } = req.body;
        const user = await User.findOne({ cookieId });
        if (!user) return res.json({ error: "User not found" });

        // تحليل البيانات لإرسالها للذكاء الاصطناعي
        const lastProduct = [...user.history].reverse().find(h => h.event === 'product_view')?.product || "nos produits";
        const hasCart = user.history.some(h => h.event === 'add_to_cart');
        const userLang = "French & Arabic mix (Moroccan style)";

        // 🧠 الطلب من OpenAI
        const prompt = `
        Act as a professional marketer for a luxury fossil & mineral brand called 'ABAGH'.
        Write a Facebook Ad for a user who looked at '${lastProduct}' but didn't buy.
        Condition: User added to cart? ${hasCart}.
        Language: ${userLang}.
        Format: JSON with fields: 'headline', 'primary_text'.
        Tone: Urgent if added to cart, Inspiring if just viewing.
        `;

        let adContent;
        try {
            // محاولة الاتصال بـ OpenAI
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a marketing expert." }, { role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" }
            });
            adContent = JSON.parse(completion.choices[0].message.content);
        } catch (aiError) {
            // Fallback (خطة بديلة إذا لم يوجد مفتاح OpenAI)
            console.log("⚠️ OpenAI Error (Using Template):", aiError.message);
            adContent = {
                headline: hasCart ? `Oublié ${lastProduct}?` : `Découvrez ${lastProduct}`,
                primary_text: hasCart ? `Votre panier vous attend! Stock limité.` : `Une pièce unique pour votre collection.`
            };
        }

        res.json({ 
            strategy: hasCart ? "Retargeting (High Intent)" : "Awareness",
            ad: adContent,
            interest: user.interests[0] || "General"
        });

    } catch (error) {
        res.status(500).json({ error: "Generation Failed" });
    }
});

// C. 🔥 التحكم في الإعلانات (Auto-Pause Rules)
app.get('/api/optimize-ads', async (req, res) => {
    try {
        const accessToken = process.env.FB_ACCESS_TOKEN;
        let accountId = process.env.FB_ACCOUNT_ID || "act_2587718718162961"; 
        if (accountId && !accountId.startsWith('act_')) accountId = `act_${accountId}`;

        if (!accessToken) return res.json({ error: "Missing FB Token" });

        const url = `https://graph.facebook.com/v19.0/${accountId}/campaigns`;
        const fbRes = await axios.get(url, {
            params: { fields: 'name,status,insights{spend,actions}', effective_status: ['ACTIVE'], access_token: accessToken }
        });

        const campaigns = fbRes.data.data || [];
        const report = [];

        for (const c of campaigns) {
            const insights = c.insights ? c.insights.data[0] : null;
            const spend = parseFloat(insights?.spend || 0);
            const sales = insights?.actions?.find(a => a.action_type === 'purchase')?.value || 0;
            
            let decision = "WAIT ⏳";
            let actionTaken = "None";

            if (spend > 20 && sales === 0) {
                decision = "KILL ⛔";
                try {
                    await axios.post(`https://graph.facebook.com/v19.0/${c.id}`, { status: 'PAUSED' }, { params: { access_token: accessToken } });
                    actionTaken = "✅ PAUSED AUTOMATICALLY";
                } catch (e) { actionTaken = "❌ Perm Error"; }
            } else if (sales > 0) {
                decision = "SCALE 🚀";
            }

            report.push({ name: c.name, spend, sales, decision, action_taken: actionTaken });
        }
        res.json({ success: true, report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// D. ⏰ الأتمتة الكاملة (Auto-Pilot Endpoint)
// هذا الرابط يتم استدعاؤه تلقائياً للبحث عن "Hot Leads" وإطلاق إعلانات لهم
app.get('/api/run-auto-pilot', async (req, res) => {
    try {
        // 1. ابحث عن العملاء "الساخنين" (نقاط > 20) الذين لم يشتروا ولم نرسل لهم إعلاناً اليوم
        const hotLeads = await User.find({
            interestScore: { $gt: 20 },
            lastAdSent: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // مر 24 ساعة
        }).limit(5); // نأخذ 5 فقط لتجربة

        const results = [];

        for (const user of hotLeads) {
            // محاكاة إطلاق حملة (لتوفير المال، سنقوم فقط بتسجيل العملية)
            // في الإنتاج الحقيقي، نستخدم كود FB Launch هنا
            
            user.lastAdSent = new Date();
            await user.save();
            
            results.push({ 
                user: user.cookieId, 
                action: "Targeted with AI Ad", 
                score: user.interestScore 
            });
        }

        res.json({ success: true, processed: results.length, details: results });
    } catch (error) {
        res.status(500).json({ error: "Auto-Pilot Failed" });
    }
});

// E. الإحصائيات (Stats)
app.get('/api/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const stats = await User.aggregate([
            { $unwind: "$history" },
            { $group: { _id: null, totalViews: { $sum: { $cond: [{ $eq: ["$history.event", "product_view"] }, 1, 0] } }, totalCarts: { $sum: { $cond: [{ $eq: ["$history.event", "add_to_cart"] }, 1, 0] } } } }
        ]);
        const result = stats[0] || { totalViews: 0, totalCarts: 0 };
        res.json({ totalVisitors: userCount, totalActions: result.totalViews + result.totalCarts, totalViews: result.totalViews, totalCarts: result.totalCarts, sales: 0, activeNow: 1 });
    } catch (error) { res.json({ totalVisitors: 0 }); }
});

// F. جدول المستخدمين (كامل)
app.get('/api/stats/users', async (req, res) => {
    const users = await User.find().sort({ interestScore: -1 });
    res.json(users);
});

// --- 4. تشغيل الأتمتة الزمنية (CRON JOB) ---
// هذا الكود يعمل كل يوم الساعة 10 صباحاً تلقائياً
cron.schedule('0 10 * * *', async () => {
    console.log("⏰ Running Daily Auto-Pilot...");
    // نقوم باستدعاء دالة الأتمتة داخلياً
    // (ملاحظة: في Vercel قد تحتاج لاستخدام Vercel Cron، لكن هذا يعمل محلياً وعلى VPS)
    axios.get('http://localhost:3000/api/run-auto-pilot').catch(err => console.log("Cron Error"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🤖 ABAGH AI System v2.0 (Full Auto) running on port ${PORT}`));

module.exports = app;