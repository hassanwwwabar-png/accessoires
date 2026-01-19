require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // مكتبة الاتصال بفيسبوك
// --- 🛒 كتالوج المنتجات (Mock Product Database) ---
// هذا يمثل قاعدة بيانات متجرك الحقيقية
const productCatalog = {
    "prod_001": { name: "Ammonite Géante (100M ans)", category: "Fossile", image: "https://i.imgur.com/2p4b4dD.jpeg" }, // صورة أحفورة
    "prod_002": { name: "Collier Émeraude Royal", category: "Bijoux", image: "https://i.imgur.com/Kq8XqZ8.jpeg" },    // صورة مجوهرات
    "prod_003": { name: "Géode Améthyste", category: "Minéral", image: "https://i.imgur.com/M6q8Fk3.jpeg" }        // صورة حجر كريم
};
const app = express();
app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to Database (Succeeded!)'))
    .catch(err => {
        console.log('❌ DB Connection Failed.');
        console.log('Reason:', err.message);
        console.log('Tip: Try changing your PC DNS to 8.8.8.8 if this persists.');
    });

// --- 2. MODELS ---
const userSchema = new mongoose.Schema({
    cookieId: String,
    interestScore: { type: Number, default: 0 },
    interests: [String],
    history: [{ event: String, productId: String, timestamp: Date }]
});
const User = mongoose.model('User', userSchema);

// --- 3. ROUTES ---

// A. مسار تتبع الزوار (TRACKING)
app.post('/api/track', async (req, res) => {
    try {
        const { cookieId, eventType, productData } = req.body;
        
        let user = await User.findOne({ cookieId });
        if (!user) user = new User({ cookieId, history: [], interests: [] });

        user.history.push({ event: eventType, productId: productData?.id, timestamp: new Date() });

        if (eventType === 'product_view') {
            user.interestScore += 5;
            if(productData?.category) user.interests.push(productData.category);
        } else if (eventType === 'add_to_cart') {
            user.interestScore += 20;
        } else if (eventType === 'checkout_start') {
            user.interestScore += 30;
        }

        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Tracking Error:", error);
        res.status(500).json({ error: "Internal Error" });
    }
});

// B. مسار جلب البيانات للداشبورد (GET USERS)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ interestScore: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "DB Error" });
    }
});

// C. مسار توليد الإعلانات الذكية (AI AD GENERATOR)
// ... (كل الكود السابق كما هو)

// --- القواميس الإبداعية (Creative Dictionaries) ---
const adTemplates = {
    fossile: {
        hooks_fr: ["Passionné d'histoire ?", "Une pièce de musée chez vous ?", "L'éternité dans votre salon.", "Rare et unique."],
        hooks_ar: ["كيعجبك التاريخ؟", "بغيتي شي ديكور ما دايرش؟", "تحفة فنية من قلب الأرض.", "همزة للعشاق ديال الأحافير."],
        bodies_fr: ["Cette ammonite est datée de 100M d'années.", "Un fossile authentique qui impressionnera vos invités.", "La nature a mis des siècles à créer ça."],
        bodies_ar: ["هاد القطعة عندها ملايين السنين.", "ماشي غير حجرة، هادي تاريخ.", "تخيل هاد القطعة فالصالون ديالك."],
        ctas_fr: ["Commandez avant rupture.", "Stock très limité.", "Livraison offerte aujourd'hui."],
        ctas_ar: ["طلب دابا قبل ما تقادى.", "الستوك قليل بزاف.", "التوصيل فابور اليوم."]
    },
    bijoux: {
        hooks_fr: ["L'élégance naturelle.", "Brillez de mille feux.", "Pour une occasion spéciale.", "Le cadeau parfait."],
        hooks_ar: ["الأناقة عندها عنوان.", "بغيتي تباني متميزة؟", "هدية كاتحمق.", "مجوهرات بالطاقة الطبيعية."],
        bodies_fr: ["Fait main avec des pierres 100% naturelles.", "Un design unique qu'on ne trouve pas ailleurs.", "L'harmonie parfaite entre nature et luxe."],
        bodies_ar: ["مخدومة باليد وبحب.", "تصميم ما غاتلقايهش فالسوق.", "أحجار كريمة حقيقية 100%."],
        ctas_fr: ["Profitez de -20%.", "Réservez la vôtre.", "Achetez maintenant."],
        ctas_ar: ["استافدي من تخفيض 20%.", "حجزي ديالك دابا.", "شري وارتاحي."]
    },
    general: {
        hooks_fr: ["Découvrez l'introuvable.", "La boutique des passionnés."],
        hooks_ar: ["اكتشف الكنوز.", "المتجر ديال الناس اللي كيفهمو."],
        bodies_fr: ["Des minéraux et fossiles d'exception.", "La qualité avant tout."],
        bodies_ar: ["سلعة نقية ومضمونة.", "الجودة هي الشعار ديالنا."],
        ctas_fr: ["Visitez la boutique.", "Voir la collection."],
        ctas_ar: ["زوروا الموقع.", "شوف الكوليكسيون."]
    }
};

// دالة الاختيار العشوائي
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 3. المحاكي الذكي المطور (DYNAMIC AI GENERATOR)
// 3. المحاكي الذكي (DYNAMIC PRODUCT ADS)
app.post('/api/generate-ad', async (req, res) => {
    try {
        const { cookieId } = req.body;
        const user = await User.findOne({ cookieId });

        if (!user) return res.json({ error: "No user found" });

        // 1. البحث عن "المنتج المحدد" من تاريخ الزائر (The Exact Product)
        // نبحث عن آخر منتج تفاعل معه (سواء مشاهدة أو إضافة للسلة)
        const lastInteraction = [...user.history].reverse().find(h => h.productId && productCatalog[h.productId]);
        
        let exactProduct = null;
        if (lastInteraction) {
            exactProduct = productCatalog[lastInteraction.productId];
        }

        // 2. تحديد الاستراتيجية
        const hasAddToCart = user.history.some(h => h.event === 'add_to_cart');
        let strategy = "👀 Awareness";
        let tone = "Curiosity ✨";
        let productName = exactProduct ? exactProduct.name : "nos trésors"; // نستخدم الاسم الحقيقي أو كلمة عامة

        if (hasAddToCart) {
            strategy = "🔥 Retargeting (Dynamic)";
            tone = "Urgent 🔴";
        }

        // 3. كتابة النص (Dynamic Copywriting)
        let headline = "";
        let primaryText = "";

        if (exactProduct && hasAddToCart) {
            // سيناريو: ترك منتجاً محدداً في السلة
            headline = `⚠️ Stock Limité: Votre ${exactProduct.name} !`;
            primaryText = `🇫🇷 **FR:** Vous avez l'œil ! Cette magnifique **${exactProduct.name}** est très demandée. Validez votre panier avant qu'elle ne disparaisse.\n\n🇲🇦 **AR:** عندك ذوق واعر! هاد **"${exactProduct.name}"** اللي خليتي فالسلة راه عليها الطلب بزاف. كملي الكوموند دابا قبل ما تطيييير!`;
        
        } else if (exactProduct) {
            // سيناريو: شاهد منتجاً محدداً ولم يشتره
            headline = "Un coup de cœur ?";
            primaryText = `🇫🇷 **FR:** On a vu que vous regardiez **${exactProduct.name}**. Imaginez-la chez vous...\n\n🇲🇦 **AR:** بانت لينا عجباتك **"${exactProduct.name}"**. تخيلها كيف غاتجي فالدار عندك.`;
        
        } else {
            // سيناريو عام (لم يحدد منتجاً)
            headline = "Découvrez l'Introuvable.";
            primaryText = `🇫🇷 **FR:** Des pièces uniques pour des gens uniques.\n🇲🇦 **AR:** اكتشف كنوز ما كايناش فالسوق.`;
        }

        // 4. إرسال الصورة والبيانات
        res.json({ 
            strategy, 
            tone,
            headline, 
            primaryText,
            creativeSuggestion: exactProduct ? `Show real image of: ${exactProduct.name}` : "Generic Collection Video",
            productImage: exactProduct ? exactProduct.image : null, // نرسل رابط الصورة الحقيقي
            interest: exactProduct ? exactProduct.category : "General"
        });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI Error" });
    }
});

// ... (باقي الكود في الأسفل كما هو)
// D. المدير الآلي الحقيقي (REAL FACEBOOK ADS MANAGER)
app.get('/api/optimize-ads', async (req, res) => {
    const log = [];
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const accountId = process.env.FB_AD_ACCOUNT_ID;

    // --- إعدادات الأمان (Real Rules) ---
    const MAX_CPA = 15.00;        // أقصى تكلفة مسموحة للبيعة
    const MAX_SPEND_NO_SALES = 30.00; // حد الخسارة: إذا صرف هذا المبلغ ولم يبع -> إيقاف

    try {
        // 1. جلب الحملات النشطة من فيسبوك
        const url = `https://graph.facebook.com/v19.0/${accountId}/campaigns`;
        const fbRes = await axios.get(url, {
            params: {
                fields: 'name,status,insights{spend,purchase_roas,actions,clicks}',
                effective_status: ['ACTIVE'], // نجلب فقط الحملات الشغالة
                access_token: accessToken
            }
        });

        const campaigns = fbRes.data.data;

        // 2. تحليل الحملات واتخاذ القرارات
        for (let camp of campaigns) {
            let decision = "KEEP ✅";
            let reason = "Good Performance";
            
            const insights = camp.insights ? camp.insights.data[0] : null;
            
            if (insights) {
                const spend = parseFloat(insights.spend || 0);
                const purchaseAction = insights.actions?.find(a => a.action_type === 'offsite_conversion.fb_pixel_purchase');
                const purchases = purchaseAction ? parseInt(purchaseAction.value) : 0;
                const cpa = purchases > 0 ? (spend / purchases) : 0;

                // --- القاعدة 1: وقف النزيف (KILL SWITCH) ---
                if (purchases === 0 && spend > MAX_SPEND_NO_SALES) {
                    decision = "KILL 💀";
                    reason = `Real Spend $${spend} with 0 Sales!`;
                    await pauseCampaignOnFacebook(camp.id, accessToken); // تنفيذ الإيقاف
                }
                // --- القاعدة 2: تكلفة عالية جداً ---
                else if (purchases > 0 && cpa > MAX_CPA) {
                    decision = "KILL 💀";
                    reason = `CPA ($${cpa.toFixed(2)}) is too high!`;
                    await pauseCampaignOnFacebook(camp.id, accessToken); // تنفيذ الإيقاف
                }
                
                log.push({
                    id: camp.id,
                    name: camp.name,
                    spend: `$${spend}`,
                    sales: purchases,
                    decision: decision,
                    reason: reason
                });

            } else {
                log.push({ name: camp.name, decision: "WAIT", reason: "No data yet" });
            }
        }

        res.json({ success: true, report: log });

    } catch (error) {
        console.error("FB API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to connect to Facebook" });
    }
});

// دالة مساعدة لإيقاف الحملة في فيسبوك
async function pauseCampaignOnFacebook(campaignId, token) {
    try {
        const url = `https://graph.facebook.com/v19.0/${campaignId}`;
        await axios.post(url, {
            status: 'PAUSED',
            access_token: token
        });
        console.log(`🚫 Campaign ${campaignId} PAUSED by AI.`);
    } catch (error) {
        console.error(`Failed to pause campaign ${campaignId}`, error.message);
    }
}

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 2. GENERATE AD WITH VIDEO & LAUNCH
        

// 5. إطلاق حملة حقيقية (REAL LAUNCH)
// 5. إطلاق حملة حقيقية (REAL LAUNCH)
app.post('/api/launch-campaign', async (req, res) => {
    const { adData } = req.body; // نستلم بيانات الإعلان من الداشبورد
    const accessToken = process.env.FB_ACCESS_TOKEN;
    const accountId = process.env.FB_AD_ACCOUNT_ID;
    const pageId = process.env.FB_PAGE_ID;

    if(!pageId) return res.status(400).json({error: "MISSING_PAGE_ID"});

    try {
        console.log("🚀 Initializing Real Campaign Creation...");

        // 1️⃣ إنشاء الحملة (Campaign)
       // 1️⃣ إنشاء الحملة (Campaign)
        const campaignRes = await axios.post(`https://graph.facebook.com/v19.0/${accountId}/campaigns`, {
            name: `AI Campaign - ${adData.interest} - ${new Date().toLocaleDateString()}`,
            objective: 'OUTCOME_SALES',
            status: 'PAUSED',
            special_ad_categories: [],
            
            // 🔥🔥🔥 هذا هو السطر الذي سيحل المشكلة 🔥🔥🔥
            is_adset_budget_sharing_enabled: false, 
            
            access_token: accessToken
        });
        const campaignId = campaignRes.data.id;
        console.log(`✅ Campaign Created: ${campaignId}`);

        // 2️⃣ إنشاء المجموعة الإعلانية (Ad Set)
        const adSetRes = await axios.post(`https://graph.facebook.com/v19.0/${accountId}/adsets`, {
            name: 'Ad Set - AI Targeting (Morocco)',
            campaign_id: campaignId,
            daily_budget: 500, // 5 دولار تقريباً (بالسنت)
            billing_event: 'IMPRESSIONS',
            optimization_goal: 'REACH',
            bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
            targeting: { geo_locations: { countries: ['MA'] } }, // استهداف المغرب
            start_time: new Date(Date.now() + 3600000).toISOString(), // تبدأ بعد ساعة (مهم جداً للفيسبوك)
            status: 'PAUSED',
            access_token: accessToken
        });
        const adSetId = adSetRes.data.id;
        console.log(`✅ Ad Set Created: ${adSetId}`);

        // 3️⃣ تجهيز التصميم (Ad Creative)
        // ملاحظة: الصورة يجب أن تكون رابطاً عاماً (Public URL)
        const creativeRes = await axios.post(`https://graph.facebook.com/v19.0/${accountId}/adcreatives`, {
            name: `Creative - ${adData.headline}`,
            object_story_spec: {
                page_id: pageId,
                link_data: {
                    image_hash: undefined, // لو كانت الصورة مرفوعة سابقاً
                    picture: adData.productImage || "https://i.imgur.com/2p4b4dD.jpeg", // رابط الصورة
                    link: "https://abagh-shop.com", // رابط متجرك
                    message: adData.primaryText, // النص الأساسي (الفرنسي/العربي)
                    name: adData.headline, // العنوان
                    call_to_action: { type: "SHOP_NOW" }
                }
            },
            access_token: accessToken
        });
        const creativeId = creativeRes.data.id;
        console.log(`✅ Creative Created: ${creativeId}`);

        // 4️⃣ إنشاء الإعلان النهائي (The Ad)
        const adRes = await axios.post(`https://graph.facebook.com/v19.0/${accountId}/ads`, {
            name: 'AI Generated Ad #1',
            adset_id: adSetId,
            creative: { creative_id: creativeId },
            status: 'PAUSED',
            access_token: accessToken
        });

        console.log(`🎉 AD LAUNCHED SUCCESSFULLY: ${adRes.data.id}`);

        res.json({ 
            success: true, 
            campaign_id: campaignId, 
            ad_id: adRes.data.id 
        });
        // ✅ إصلاح 1: رابط الإحصائيات العامة (ضروري للعدادات)
app.get('/api/stats', async (req, res) => {
    try {
        // نعد الزوار والأكشنز من قاعدة البيانات
        const userCount = await User.countDocuments();
        // حساب تقريبي للنشاط
        res.json({
            totalVisitors: userCount,
            totalActions: userCount * 2, // رقم تقريبي
            sales: 0, // يمكنك تحديثه لاحقاً ليحسب المبيعات الحقيقية
            activeNow: 1
        });
    } catch (error) {
        // في حالة الخطأ، نرسل أصفاراً حتى لا تتعطل الداشبورد
        res.json({ totalVisitors: 0, totalActions: 0, sales: 0, activeNow: 0 });
    }
});

    } catch (error) {
        console.error("❌ FB API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data.error.message : "Failed" });
    }
});
// ✅ إصلاح 2: توجيه الرابط ليعمل مع الداشبورد
app.get('/api/stats/users', async (req, res) => {
    // نعيد استخدام نفس كود جلب المستخدمين الموجود عندك
    const users = await User.find().sort({ interestScore: -1 }).limit(20);
    res.json(users);
});
// ✅ إصلاح 3: تصدير التطبيق (ضعه في آخر سطر في الملف)
module.exports = app;