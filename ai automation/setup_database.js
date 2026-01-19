require('dotenv').config();
const { Client } = require('pg');

// إعداد الاتصال بقاعدة البيانات
const client = new Client({
  connectionString: process.env.DATABASE_URL, // تأكد أن رابط الداتابيز موجود في ملف .env
});

async function buildDatabase() {
  try {
    await client.connect();
    console.log("🔌 Connected to Database...");

    // 1️⃣ جدول المتاجر (Stores) - لأن النظام SaaS
    // هذا الجدول يحفظ معلوماتك ومعلومات العملاء المستقبليين
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        domain VARCHAR(255) UNIQUE NOT NULL, -- مثال: my-shop.myshopify.com
        access_token VARCHAR(255), -- للتحكم في المتجر
        pixel_id VARCHAR(100), -- بيكسل فيسبوك الخاص بالمتجر
        plan VARCHAR(50) DEFAULT 'free', -- نوع الاشتراك
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Stores table created.");

    // 2️⃣ جدول الزوار (Visitors)
    // مربوط بالمتجر (store_id) لكي لا تختلط بيانات المتاجر ببعضها
    await client.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        shopify_customer_id BIGINT, -- إذا كان مسجلاً في شوبيفاي
        cookie_id VARCHAR(255), -- لتتبع الزائر غير المسجل
        interest_score INTEGER DEFAULT 0, -- تقييم الاهتمام (0-100)
        segment VARCHAR(50) DEFAULT 'cold', -- تصنيف: بارد، مهتم، ساخن
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Visitors table created.");

    // 3️⃣ جدول الأحداث (Events)
    // كل ضغطة، كل مشاهدة منتج تسجل هنا
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        visitor_id INTEGER REFERENCES visitors(id),
        store_id INTEGER REFERENCES stores(id),
        event_type VARCHAR(50), -- viewed_product, added_to_cart, clicked_whatsapp
        product_id VARCHAR(100),
        details JSONB, -- لحفظ تفاصيل إضافية بمرونة
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Events table created.");

    // 4️⃣ جدول الحملات (Ads)
    // لحفظ نتائج الإعلانات لكل متجر
    await client.query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id),
        platform VARCHAR(50), -- facebook, tiktok, google
        campaign_id VARCHAR(100),
        status VARCHAR(50), -- active, paused
        roas DECIMAL(10, 2), -- العائد على الإعلان
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ads table created.");

    console.log("🚀 Database Schema Built Successfully!");
  } catch (err) {
    console.error("❌ Error building database:", err);
  } finally {
    await client.end();
  }
}

buildDatabase();