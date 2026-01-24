require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://hassan:admin2026@cluster0.mongodb.net/my-saas-db?retryWrites=true&w=majority")
    .then(() => console.log('✅ Connected to Database'))
    .catch(err => console.log('❌ DB Connection Failed:', err.message));

// --- 2. MODELS ---
const userSchema = new mongoose.Schema({
    cookieId: String,
    interestScore: { type: Number, default: 0 },
    interests: [String],
    history: [{ event: String, product: String, timestamp: Date }],
    lastActive: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// --- 3. ROUTES ---

// A. الصفحة الرئيسية
app.get('/', (req, res) => res.send('🚀 ABAGH AI Manager is Active & Controlling Ads!'));

// B. نظام التتبع الذكي (Tracking & Scoring) 🕵️‍♂️
app.post('/api/track', async (req, res) => {
    try {
        const { cookieId, event, product, category } = req.body;
        
        let user = await User.findOne({ cookieId });
        if (!user) {
            user = new User({ cookieId, interestScore: 0, history: [], interests: [] });
        }

        // تسجيل الحدث
        user.history.push({ event, product, timestamp: new Date() });
        user.lastActive = new Date();

        // تحديث الاهتمامات
        if (category && !user.interests.includes(category)) {
            user.interests.push(category);
        }

        // 🧠 حساب النقاط (Scoring)
        let points = 0;
        switch(event) {
            case 'page_view': points = 1; break;
            case 'product_view': points = 5; break;
            case 'add_to_cart': points = 20; break;
            case 'checkout_start': points = 30; break;
            case 'purchase': points = 50; break;
            default: points = 0;
        }
        user.interestScore += points;

        await user.save();
        res.json({ success: true, score: user.interestScore });

    } catch (error) {
        console.error("Tracking Error:", error);
        res.status(500).json({ error: "Tracking failed" });
    }
});

// C. 🔥 العقل المدبر (AI Manager - Controls Ads) 👮‍♂️
app.get('/api/optimize-ads', async (req, res) => {
    try {
        const accessToken = process.env.FB_ACCESS_TOKEN;
        let accountId = process.env.FB_ACCOUNT_ID; 

        if (accountId && !accountId.startsWith('act_')) {
            accountId = `act_${accountId}`;
        }

        // 1. جلب الحملات النشطة
        const url = `https://graph.facebook.com/v19.0/${accountId}/campaigns`;
        const fbRes = await axios.get(url, {
            params: {
                fields: 'name,status,insights{spend,purchase_roas,actions,clicks}',
                effective_status: ['ACTIVE'], 
                access_token: accessToken
            }
        });

        const campaigns = fbRes.data.data || [];
        const report = [];

        // 2. تحليل واتخاذ القرارات
        for (const c of campaigns) {
            const insights = c.insights ? c.insights.data[0] : null;
            const spend = insights ? parseFloat(insights.spend || 0) : 0;
            const sales = insights && insights.actions ? 
                          (insights.actions.find(a => a.action_type === 'purchase')?.value || 0) : 0;
            
            let decision = "WAIT ⏳";
            let reason = "Gathering data...";
            let actionTaken = "None";

            // --- 🤖 القواعد الصارمة (Rules) ---

            if (spend > 20 && sales === 0) {
                // ⛔ قاعدة القتل: صرف أكثر من 20 ولم يبع
                decision = "KILL ⛔";
                reason = "High spend ($20+) with 0 sales.";
                
                // 🔥 التنفيذ الحقيقي: إيقاف الحملة في فيسبوك
                try {
                    await axios.post(`https://graph.facebook.com/v19.0/${c.id}`, {
                        status: 'PAUSED' // هذا الأمر يطفئ الإعلان
                    }, {
                        params: { access_token: accessToken }
                    });
                    actionTaken = "✅ PAUSED AUTOMATICALLY";
                } catch (err) {
                    console.error("Failed to pause:", err.response?.data || err.message);
                    actionTaken = "❌ Failed (Check Permissions)";
                }

            } else if (spend < 5) {
                decision = "LEARNING 🎓";
                reason = `Low spend ($${spend}). AI is observing.`;
            
            } else if (sales > 2) {
                decision = "SCALE 🚀";
                reason = "High performing! Consider budget increase.";
            }

            report.push({
                name: c.name,
                spend: spend.toFixed(2),
                sales: sales,
                decision: decision,
                reason: reason,
                action_taken: actionTaken
            });
        }

        res.json({ success: true, report: report });

    } catch (error) {
        console.error("AI Manager Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// D. إطلاق حملة جديدة (Launch)
app.post('/api/launch-campaign', async (req, res) => {
    try {
        const { adData } = req.body;
        const accessToken = process.env.FB_ACCESS_TOKEN;
        let accountId = process.env.FB_ACCOUNT_ID;
        if (accountId && !accountId.startsWith('act_')) accountId = `act_${accountId}`;
        
        // إنشاء حملة (مسودة)
        const campRes = await axios.post(`https://graph.facebook.com/v19.0/${accountId}/campaigns`, {
            name: `AI Campaign - ${adData.interest || 'General'} - ${new Date().toLocaleDateString()}`,
            objective: 'OUTCOME_SALES',
            status: 'PAUSED', // نبدأها متوقفة للمراجعة
            special_ad_categories: [],
            access_token: accessToken
        });

        res.json({ success: true, campaign_id: campRes.data.id });
    } catch (error) {
        res.status(500).json({ error: "Launch Failed", details: error.message });
    }
});

// E. الإحصائيات الدقيقة (Stats)
app.get('/api/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const stats = await User.aggregate([
            { $unwind: "$history" },
            { 
                $group: { 
                    _id: null, 
                    totalViews: { $sum: { $cond: [{ $eq: ["$history.event", "product_view"] }, 1, 0] } },
                    totalCarts: { $sum: { $cond: [{ $eq: ["$history.event", "add_to_cart"] }, 1, 0] } }
                } 
            }
        ]);
        const result = stats[0] || { totalViews: 0, totalCarts: 0 };

        res.json({
            totalVisitors: userCount,
            totalActions: result.totalViews + result.totalCarts,
            totalViews: result.totalViews,
            totalCarts: result.totalCarts,
            sales: 0, 
            activeNow: 1
        });
    } catch (error) {
        res.json({ totalVisitors: 0, totalActions: 0 });
    }
});

// F. قائمة المستخدمين (User Table)
app.get('/api/stats/users', async (req, res) => {
    try {
        const users = await User.find().sort({ interestScore: -1 }).limit(100);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "DB Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🤖 Server running on port ${PORT}`));

module.exports = app;