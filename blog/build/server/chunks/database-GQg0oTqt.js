import { b as private_env } from './shared-server-DaWdgxVh.js';
import crypto from 'crypto';

const DATABASE_URL = private_env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = private_env.DATABASE_AUTH_TOKEN;
const USE_TURSO = !!DATABASE_URL;
let client = null;
let clientPromise = null;
async function getClient() {
  if (clientPromise) return clientPromise;
  clientPromise = (async () => {
    let localClient = null;
    if (USE_TURSO) {
      const { createClient } = await import('@libsql/client');
      localClient = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
    } else {
      const Database = (await import('better-sqlite3')).default;
      const dbPath = private_env.DATABASE_PATH || "./blog.db";
      const sqliteDb = new Database(dbPath);
      sqliteDb.pragma("journal_mode = WAL");
      sqliteDb.pragma("busy_timeout = 5000");
      localClient = {
        execute: async (sql, params = []) => {
          const stmt = sqliteDb.prepare(sql);
          if (sql.trim().toUpperCase().startsWith("SELECT")) {
            return { rows: stmt.all(...params) };
          }
          return stmt.run(...params);
        },
        batch: async (statements) => {
          const executeBatch = sqliteDb.transaction(
            (items) => items.map(({ sql, args = [] }) => {
              const stmt = sqliteDb.prepare(sql);
              return sql.trim().toUpperCase().startsWith("SELECT") ? { rows: stmt.all(...args) } : stmt.run(...args);
            })
          );
          return executeBatch(statements);
        }
      };
    }
    client = localClient;
    await initDatabase();
    return localClient;
  })();
  return clientPromise;
}
async function initDatabase() {
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'member',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating users table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
  } catch (e) {
    console.error("Error creating settings table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image TEXT,
        published INTEGER DEFAULT 0,
        pinterest_enabled INTEGER DEFAULT 0,
        pinterest_image TEXT,
        is_premium INTEGER DEFAULT 0,
        is_18_plus INTEGER DEFAULT 0,
        youtube_video_url TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating posts table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        pinterest_enabled INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating categories table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating sessions table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS post_categories (
        post_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, category_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating post_categories table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS ads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        placement TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT,
        image_url TEXT,
        link_url TEXT,
        is_active INTEGER DEFAULT 1,
        weight INTEGER DEFAULT 1,
        style TEXT,
        youtube_video_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating ads table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS premium_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        price_cents INTEGER NOT NULL,
        interval_days INTEGER NOT NULL DEFAULT 30,
        mp_plan_id TEXT,
        asaas_plan_id TEXT,
        features TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating premium_plans table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS user_interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        interest_type TEXT NOT NULL,
        name TEXT NOT NULL,
        score INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, interest_type, name)
      )
    `);
  } catch (e) {
    console.error("Error creating user_interests table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS premium_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        mp_subscription_id TEXT,
        mp_payment_id TEXT,
        asaas_subscription_id TEXT,
        asaas_customer_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        started_at DATETIME,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (plan_id) REFERENCES premium_plans(id)
      )
    `);
  } catch (e) {
    console.error("Error creating premium_subscriptions table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS premium_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id INTEGER,
        mp_payment_id TEXT UNIQUE,
        asaas_payment_id TEXT,
        amount_cents INTEGER NOT NULL,
        status TEXT NOT NULL,
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subscription_id) REFERENCES premium_subscriptions(id)
      )
    `);
  } catch (e) {
    console.error("Error creating premium_payments table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS collaborative_recommendations (
        from_post_id INTEGER NOT NULL,
        to_post_id INTEGER NOT NULL,
        score INTEGER DEFAULT 0,
        PRIMARY KEY (from_post_id, to_post_id),
        FOREIGN KEY (from_post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (to_post_id) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating collaborative_recommendations table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS user_seen_posts (
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        seen_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating user_seen_posts table:", e);
  }
  try {
    await exec("CREATE INDEX IF NOT EXISTS idx_user_seen_posts_user_seen ON user_seen_posts(user_id, seen_at)");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE posts ADD COLUMN is_18_plus INTEGER DEFAULT 0");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE posts ADD COLUMN youtube_video_url TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE posts ADD COLUMN tags TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE ads ADD COLUMN youtube_video_url TEXT");
  } catch (e) {
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating newsletter_subscribers table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS newsletter_campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        youtube_video_url TEXT,
        recipients_count INTEGER NOT NULL,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating newsletter_campaigns table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_type TEXT NOT NULL,
        slug TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await exec(`ALTER TABLE page_views ADD COLUMN user_agent TEXT`).catch(() => {
    });
    await exec(`CREATE INDEX IF NOT EXISTS idx_pv_dedup ON page_views (ip_address, slug, created_at)`).catch(() => {
    });
  } catch (e) {
    console.error("Error creating page_views table:", e);
  }
  try {
    await exec('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "member"');
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE users ADD COLUMN name TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE users ADD COLUMN cpf TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE users ADD COLUMN phone TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE premium_plans ADD COLUMN asaas_plan_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE premium_subscriptions ADD COLUMN asaas_subscription_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE premium_subscriptions ADD COLUMN asaas_customer_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE premium_payments ADD COLUMN asaas_payment_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE premium_subscriptions ADD COLUMN stripe_subscription_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE premium_subscriptions ADD COLUMN stripe_customer_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE premium_payments ADD COLUMN stripe_payment_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE product_purchases ADD COLUMN stripe_session_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE course_purchases ADD COLUMN stripe_session_id TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE products ADD COLUMN image_url TEXT");
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE products ADD COLUMN slug TEXT");
    const productsWithoutSlug = await query('SELECT id, name FROM products WHERE slug IS NULL OR slug = ""');
    if (productsWithoutSlug && productsWithoutSlug.length > 0) {
      for (const prod of productsWithoutSlug) {
        let baseSlug = prod.name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
        if (!baseSlug) baseSlug = `produto-${prod.id}`;
        let slug = baseSlug;
        let counter = 2;
        while (true) {
          const check = await queryOne("SELECT id FROM products WHERE slug = ? AND id != ?", [slug, prod.id]);
          if (!check) break;
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        await run("UPDATE products SET slug = ? WHERE id = ?", [slug, prod.id]);
      }
    }
  } catch (e) {
  }
  try {
    await exec("ALTER TABLE products ADD COLUMN category TEXT");
  } catch (e) {
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT
      )
    `);
  } catch (e) {
    console.error("Error creating product_categories table:", e);
  }
  try {
    await exec("ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL");
  } catch (e) {
  }
  try {
    const productsToMigrate = await query("SELECT id, category FROM products WHERE category IS NOT NULL AND category != '' AND category_id IS NULL");
    if (productsToMigrate && productsToMigrate.length > 0) {
      for (const prod of productsToMigrate) {
        const catName = prod.category.trim();
        let cat = await queryOne("SELECT id FROM product_categories WHERE name = ?", [catName]);
        if (!cat) {
          let baseSlug = catName.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
          if (!baseSlug) baseSlug = `categoria-${Date.now()}`;
          let slug = baseSlug;
          let counter = 2;
          while (true) {
            const check = await queryOne("SELECT id FROM product_categories WHERE slug = ?", [slug]);
            if (!check) break;
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
          await run("INSERT INTO product_categories (name, slug) VALUES (?, ?)", [catName, slug]);
          cat = await queryOne("SELECT id FROM product_categories WHERE name = ?", [catName]);
        }
        if (cat) {
          await run("UPDATE products SET category_id = ? WHERE id = ?", [cat.id, prod.id]);
        }
      }
    }
  } catch (e) {
    console.error("Error migrating product categories:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS member_otps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating member_otps table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS shortlinks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        destination_url TEXT NOT NULL,
        use_ad_interstitial INTEGER DEFAULT 0,
        ad_duration_seconds INTEGER DEFAULT 5,
        clicks_count INTEGER DEFAULT 0,
        is_indexed INTEGER DEFAULT 0,
        meta_title TEXT,
        meta_description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating shortlinks table:", e);
  }
  try {
    await exec(`ALTER TABLE shortlinks ADD COLUMN is_indexed INTEGER DEFAULT 0`);
  } catch (e) {
  }
  try {
    await exec(`ALTER TABLE shortlinks ADD COLUMN meta_title TEXT`);
  } catch (e) {
  }
  try {
    await exec(`ALTER TABLE shortlinks ADD COLUMN meta_description TEXT`);
  } catch (e) {
  }
  try {
    await exec(`ALTER TABLE shortlinks ADD COLUMN fixed_ad_id INTEGER DEFAULT NULL`);
  } catch (e) {
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS web_stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        cover_image TEXT,
        poster_portrait TEXT,
        source_type TEXT DEFAULT 'manual',
        source_post_id INTEGER,
        cta_url TEXT,
        cta_text TEXT,
        published INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating web_stories table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS web_story_slides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        story_id INTEGER NOT NULL,
        sort_order INTEGER DEFAULT 0,
        background_image TEXT,
        title TEXT,
        body TEXT,
        cta_url TEXT,
        cta_text TEXT,
        FOREIGN KEY (story_id) REFERENCES web_stories(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating web_story_slides table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        description TEXT,
        price_cents INTEGER NOT NULL DEFAULT 0,
        file_url TEXT,
        external_link TEXT,
        image_url TEXT,
        youtube_video_url TEXT,
        category_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating products table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS post_products (
        post_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, product_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating post_products table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS product_purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER,
        product_name_snapshot TEXT,
        price_cents INTEGER,
        status TEXT DEFAULT 'pending',
        asaas_payment_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);
  } catch (e) {
    console.error("Error creating product_purchases table:", e);
  }
  try {
    await exec(`ALTER TABLE product_purchases ADD COLUMN product_name_snapshot TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE product_purchases ADD COLUMN price_cents INTEGER`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN youtube_video_url TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN resource_type TEXT DEFAULT 'file'`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN access_label TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN drive_instructions TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN delivery_deadline TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN is_premium_included INTEGER DEFAULT 0`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE product_purchases ADD COLUMN buyer_access_id TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN has_extra_service INTEGER DEFAULT 0`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN extra_service_title TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN extra_service_price_cents INTEGER DEFAULT 0`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE products ADD COLUMN extra_service_description TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE product_purchases ADD COLUMN has_extra_service INTEGER DEFAULT 0`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE product_purchases ADD COLUMN extra_service_title_snapshot TEXT`);
  } catch (_) {
  }
  try {
    await exec(`ALTER TABLE product_purchases ADD COLUMN extra_service_price_cents INTEGER DEFAULT 0`);
  } catch (_) {
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(product_id, user_id)
      )
    `);
  } catch (e) {
    console.error("Error creating product_reviews table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS member_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        cover_image TEXT,
        access_type TEXT DEFAULT 'premium',
        price_cents INTEGER DEFAULT 0,
        asaas_product_id TEXT,
        published INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating member_courses table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS member_lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        video_url TEXT,
        video_type TEXT DEFAULT 'youtube',
        topic TEXT,
        sort_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        is_preview INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES member_courses(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating member_lessons table:", e);
  }
  try {
    await exec(`ALTER TABLE member_lessons ADD COLUMN topic TEXT`);
  } catch (_) {
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS member_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_type TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES member_courses(id) ON DELETE SET NULL
      )
    `);
  } catch (e) {
    console.error("Error creating member_materials table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS course_purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        asaas_payment_id TEXT,
        amount_cents INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES member_courses(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating course_purchases table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS product_downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating product_downloads table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS landing_pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'draft',
        content TEXT NOT NULL DEFAULT '[]',
        settings TEXT NOT NULL DEFAULT '{}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {
    console.error("Error creating landing_pages table:", e);
  }
  try {
    await exec(`
      CREATE TABLE IF NOT EXISTS community_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT DEFAULT 'default',
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'Geral',
        is_pinned INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await exec(`
      CREATE TABLE IF NOT EXISTS community_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES community_topics(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await exec(`
      CREATE TABLE IF NOT EXISTS community_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(topic_id, user_id),
        FOREIGN KEY (topic_id) REFERENCES community_topics(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  } catch (e) {
    console.error("Error creating community tables:", e);
  }
  try {
    const siteTitleSetting = await queryOne("SELECT key FROM settings WHERE key = 'site_title'");
    if (!siteTitleSetting) {
      console.log("Seeding default settings...");
      const defaultSettings = [
        { key: "site_title", value: "1Convite Blog" },
        { key: "site_description", value: "A Palavra Viva • Estudos, Meditações e Princípios do Reino" },
        { key: "feed_loading_mode", value: "pagination" },
        { key: "site_logo", value: "/blog/chama-1convite.png" },
        { key: "site_favicon", value: "/blog/chama-1convite.png" },
        { key: "default_theme", value: "dark" }
      ];
      for (const setting of defaultSettings) {
        await run("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", [setting.key, setting.value]);
      }
    }
  } catch (e) {
    console.error("Error seeding default settings:", e);
  }
  try {
    const adminUser = private_env.ADMIN_USERNAME || "admin";
    const adminPass = private_env.ADMIN_PASSWORD || "Xk9mP2vL7qR4StrongPass!";
    const userExists = await queryOne("SELECT id FROM users WHERE username = ?", [adminUser]);
    if (!userExists) {
      console.log("Seeding default admin user (first run)...");
      const bcrypt = await import('bcryptjs');
      const hasher = bcrypt.default ? bcrypt.default : bcrypt;
      const hashedPassword = await hasher.hash(adminPass, 10);
      await run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [adminUser, hashedPassword, "admin"]);
      console.log("Admin user created successfully.");
    }
  } catch (e) {
    console.error("Error seeding admin user:", e);
  }
  try {
    await autoTagExistingPosts();
  } catch (e) {
    console.error("Error in autoTagExistingPosts during init:", e);
  }
  return true;
}
async function query(sql, params = []) {
  const db = client || await getClient();
  const r = await db.execute(sql, params);
  return r.rows || [];
}
async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] ?? null;
}
async function run(sql, params = []) {
  const db = client || await getClient();
  return db.execute(sql, params);
}
async function runBatch(statements) {
  const db = client || await getClient();
  if (typeof db.batch !== "function") {
    throw new Error("O driver de banco atual não oferece suporte a transações em lote.");
  }
  return db.batch(statements, "write");
}
async function exec(sql) {
  const db = client || await getClient();
  return db.execute(sql);
}
async function generateUniqueSlug(title, excludeSlug, excludeId) {
  let slug = title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
  let exists = await queryOne("SELECT slug FROM posts WHERE slug = ?", [slug]);
  if (excludeSlug && exists?.slug === excludeSlug) exists = null;
  let counter = 2;
  while (exists) {
    const candidate = `${slug}-${counter}`;
    const check = await queryOne("SELECT slug FROM posts WHERE slug = ?", [candidate]);
    if (!check) {
      slug = candidate;
      break;
    }
    counter++;
  }
  return slug;
}
async function slugExists(slug, excludeId) {
  const sql = excludeId ? "SELECT id FROM posts WHERE slug = ? AND id != ?" : "SELECT id FROM posts WHERE slug = ?";
  const params = excludeId ? [slug, excludeId] : [slug];
  const row = await queryOne(sql, params);
  return !!row;
}
async function getAllPosts(options, _tenantId) {
  const page = options?.page || 1;
  const limit = options?.limit || 7;
  const offset = (page - 1) * limit;
  const search = options?.search;
  const categorySlug = options?.categorySlug;
  const orderClause = "p.created_at DESC";
  if (categorySlug) {
    const sql2 = `
      SELECT p.*, GROUP_CONCAT(c.name) as categories
      FROM posts p
      JOIN post_categories pc ON p.id = pc.post_id
      JOIN categories cat ON pc.category_id = cat.id
      LEFT JOIN post_categories pc2 ON p.id = pc2.post_id
      LEFT JOIN categories c ON pc2.category_id = c.id
      WHERE p.published = 1 AND cat.slug = ?
      GROUP BY p.id
      ORDER BY ${orderClause}
      LIMIT ? OFFSET ?`;
    return await query(sql2, [categorySlug, limit, offset]);
  }
  if (search) {
    const like = `%${search}%`;
    const sql2 = `
      SELECT p.*, GROUP_CONCAT(c.name) as categories
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.published = 1 AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)
      GROUP BY p.id
      ORDER BY ${orderClause}
      LIMIT ? OFFSET ?`;
    return await query(sql2, [like, like, like, limit, offset]);
  }
  const sql = `
    SELECT p.*, GROUP_CONCAT(c.name) as categories
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.published = 1
    GROUP BY p.id
    ORDER BY ${orderClause}
    LIMIT ? OFFSET ?`;
  return await query(sql, [limit, offset]);
}
async function getPublishedFeedCandidates(limit = 250) {
  const safeLimit = Math.max(1, Math.min(limit, 500));
  const sql = `
    SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.published,
           p.pinterest_enabled, p.pinterest_image, p.is_premium, p.is_18_plus,
           p.youtube_video_url, p.tags, p.created_at, p.updated_at,
           substr(p.content, 1, 2000) as content,
           GROUP_CONCAT(c.name) as categories
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.published = 1
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ?`;
  return await query(sql, [safeLimit]);
}
async function countPosts(options, _tenantId) {
  const search = options?.search;
  const categorySlug = options?.categorySlug;
  if (categorySlug) {
    const sql = `SELECT COUNT(*) as count FROM posts p JOIN post_categories pc ON p.id = pc.post_id JOIN categories c ON pc.category_id = c.id WHERE p.published = 1 AND c.slug = ?`;
    const r2 = await queryOne(sql, [categorySlug]);
    return r2?.count ?? 0;
  }
  if (search) {
    const like = `%${search}%`;
    const sql = `SELECT COUNT(*) as count FROM posts WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)`;
    const r2 = await queryOne(sql, [like, like, like]);
    return r2?.count ?? 0;
  }
  const r = await queryOne("SELECT COUNT(*) as count FROM posts WHERE published = 1");
  return r?.count ?? 0;
}
async function getAllPostsAdmin(_tenantId) {
  const sql = `SELECT p.*, GROUP_CONCAT(c.name) as categories FROM posts p LEFT JOIN post_categories pc ON p.id = pc.post_id LEFT JOIN categories c ON pc.category_id = c.id GROUP BY p.id ORDER BY p.created_at DESC`;
  return await query(sql);
}
async function getPostsAdminPage(options) {
  const offset = (options.page - 1) * options.limit;
  const search = options.search?.trim() || "";
  const where = search ? "WHERE p.title LIKE ? OR p.excerpt LIKE ?" : "";
  const searchParams = search ? [`%${search}%`, `%${search}%`] : [];
  const totalRow = await queryOne(`SELECT COUNT(*) AS count FROM posts p ${where}`, searchParams);
  const posts = await query(
    `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.published,
            p.pinterest_enabled, p.pinterest_image, p.is_premium, p.is_18_plus,
            p.youtube_video_url, p.tags, p.created_at, p.updated_at,
            GROUP_CONCAT(c.name) AS categories
     FROM posts p
     LEFT JOIN post_categories pc ON p.id = pc.post_id
     LEFT JOIN categories c ON pc.category_id = c.id
     ${where}
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...searchParams, options.limit, offset]
  );
  const total = Number(totalRow?.count || 0);
  return {
    posts,
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.max(1, Math.ceil(total / options.limit))
  };
}
async function getPostBySlug(slug, _tenantId) {
  const sql = `SELECT p.*, GROUP_CONCAT(c.id) as category_ids, GROUP_CONCAT(c.name) as categories FROM posts p LEFT JOIN post_categories pc ON p.id = pc.post_id LEFT JOIN categories c ON pc.category_id = c.id WHERE p.slug = ? GROUP BY p.id`;
  return await queryOne(sql, [slug]);
}
async function getPostById(id, _tenantId) {
  const sql = `SELECT * FROM posts WHERE id = ?`;
  return await queryOne(sql, [id]);
}
async function createPost(postData) {
  const sql = `INSERT INTO posts (title, slug, content, excerpt, cover_image, published, pinterest_enabled, pinterest_image, is_premium, is_18_plus, youtube_video_url, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  return run(sql, [
    postData.title,
    postData.slug,
    postData.content,
    postData.excerpt || "",
    postData.cover_image || "",
    postData.published ? 1 : 0,
    postData.pinterest_enabled ? 1 : 0,
    postData.pinterest_image || null,
    postData.is_premium ? 1 : 0,
    postData.is_18_plus ? 1 : 0,
    postData.youtube_video_url || null,
    postData.tags || null
  ]);
}
async function updatePost(id, postData) {
  const sql = `UPDATE posts SET title = COALESCE(?, title), slug = COALESCE(?, slug), content = COALESCE(?, content), excerpt = COALESCE(?, excerpt), cover_image = COALESCE(?, cover_image), published = COALESCE(?, published), pinterest_enabled = COALESCE(?, pinterest_enabled), pinterest_image = COALESCE(?, pinterest_image), is_premium = COALESCE(?, is_premium), is_18_plus = COALESCE(?, is_18_plus), youtube_video_url = COALESCE(?, youtube_video_url), tags = COALESCE(?, tags), updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  return run(sql, [
    postData.title ?? null,
    postData.slug ?? null,
    postData.content ?? null,
    postData.excerpt ?? null,
    postData.cover_image ?? null,
    postData.published !== void 0 ? postData.published ? 1 : 0 : null,
    postData.pinterest_enabled !== void 0 ? postData.pinterest_enabled ? 1 : 0 : null,
    postData.pinterest_image ?? null,
    postData.is_premium !== void 0 ? postData.is_premium ? 1 : 0 : null,
    postData.is_18_plus !== void 0 ? postData.is_18_plus ? 1 : 0 : null,
    postData.youtube_video_url !== void 0 ? postData.youtube_video_url : null,
    postData.tags !== void 0 ? postData.tags : null,
    id
  ]);
}
async function deletePost(id, _tenantId) {
  return run("DELETE FROM posts WHERE id = ?", [id]);
}
async function getAllCategories(_tenantId) {
  return await query("SELECT c.*, COUNT(DISTINCT pc.post_id) AS post_count FROM categories c LEFT JOIN post_categories pc ON c.id = pc.category_id LEFT JOIN posts p ON pc.post_id = p.id AND p.published = 1 GROUP BY c.id ORDER BY c.name");
}
async function getPinterestEnabledCategories(_tenantId) {
  return await query("SELECT * FROM categories WHERE pinterest_enabled = 1 ORDER BY name");
}
async function getCategoryBySlug(slug, _tenantId) {
  return await queryOne("SELECT * FROM categories WHERE slug = ?", [slug]);
}
async function createCategory(name, slug, _tenantId) {
  return run("INSERT INTO categories (name, slug, description, pinterest_enabled) VALUES (?, ?, NULL, 0)", [name, slug]);
}
async function updateCategory(id, _tenantId, name, slug, pinterestEnabled) {
  return run("UPDATE categories SET name = ?, slug = ?, pinterest_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
    name,
    slug,
    pinterestEnabled ? 1 : 0,
    id
  ]);
}
async function deleteCategory(id, _tenantId) {
  return run("DELETE FROM categories WHERE id = ?", [id]);
}
async function assignCategoriesToPost(postId, categoryIds) {
  const uniqueIds = [...new Set(categoryIds)];
  await runBatch([
    { sql: "DELETE FROM post_categories WHERE post_id = ?", args: [postId] },
    ...uniqueIds.map((catId) => ({
      sql: "INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)",
      args: [postId, catId]
    }))
  ]);
}
async function getExistingCategoryIds(categoryIds) {
  const uniqueIds = [...new Set(categoryIds)];
  if (uniqueIds.length === 0) return [];
  const placeholders = uniqueIds.map(() => "?").join(", ");
  const rows = await query(`SELECT id FROM categories WHERE id IN (${placeholders})`, uniqueIds);
  return rows.map((row) => Number(row.id));
}
async function getCategoriesByPostId(postId, _tenantId) {
  return await query("SELECT c.* FROM categories c JOIN post_categories pc ON c.id = pc.category_id WHERE pc.post_id = ?", [postId]);
}
async function getUserByUsername(username, _tenantId) {
  return await queryOne("SELECT * FROM users WHERE username = ?", [username]);
}
async function createUser(username, password, role = "member") {
  return run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, password, role]);
}
async function updateUserPassword(username, password) {
  return run("UPDATE users SET password = ? WHERE username = ?", [password, username]);
}
async function getSettings(_tenantId) {
  const rows = await query("SELECT key, value FROM settings");
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}
async function updateSetting(key, value) {
  return run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
}
async function createDBSession(id, username, expiresAt) {
  return run("INSERT INTO sessions (id, username, expires_at) VALUES (?, ?, ?)", [id, username, expiresAt]);
}
async function getDBSession(id) {
  return await queryOne("SELECT * FROM sessions WHERE id = ?", [id]);
}
async function deleteDBSession(id) {
  return run("DELETE FROM sessions WHERE id = ?", [id]);
}
async function clearExpiredDBSessions() {
  return run("DELETE FROM sessions WHERE expires_at < ?", [Date.now()]);
}
async function getAllAds(_tenantId) {
  return await query("SELECT * FROM ads ORDER BY created_at DESC");
}
async function getActiveAdsByPlacement(placement, _tenantId) {
  return await query("SELECT * FROM ads WHERE placement = ? AND is_active = 1", [placement]);
}
async function getAdById(id, _tenantId) {
  return await queryOne("SELECT * FROM ads WHERE id = ?", [id]);
}
async function createAd(ad) {
  return run("INSERT INTO ads (name, placement, type, content, image_url, link_url, is_active, weight, style, youtube_video_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
    ad.name,
    ad.placement,
    ad.type,
    ad.content || null,
    ad.image_url || null,
    ad.link_url || null,
    ad.is_active !== void 0 ? ad.is_active ? 1 : 0 : 1,
    ad.weight || 1,
    ad.style ? JSON.stringify(ad.style) : null,
    ad.youtube_video_url || null
  ]);
}
async function updateAd(id, ad) {
  return run("UPDATE ads SET name = ?, placement = ?, type = ?, content = ?, image_url = ?, link_url = ?, is_active = ?, weight = ?, style = ?, youtube_video_url = ? WHERE id = ?", [
    ad.name ?? null,
    ad.placement ?? null,
    ad.type ?? null,
    ad.content ?? null,
    ad.image_url ?? null,
    ad.link_url ?? null,
    ad.is_active !== void 0 ? ad.is_active ? 1 : 0 : null,
    ad.weight ?? null,
    ad.style ? JSON.stringify(ad.style) : null,
    ad.youtube_video_url !== void 0 ? ad.youtube_video_url : null,
    id
  ]);
}
async function deleteAd(id, _tenantId) {
  return run("DELETE FROM ads WHERE id = ?", [id]);
}
async function getPostsForPinterest(_tenantId) {
  return await query("SELECT p.* FROM posts p WHERE p.published = 1 AND p.pinterest_enabled = 1 ORDER BY p.created_at DESC");
}
async function getPostsForPinterestByCategory(categorySlug, _tenantId) {
  return await query(`SELECT DISTINCT p.* FROM posts p JOIN post_categories pc ON p.id = pc.post_id JOIN categories c ON pc.category_id = c.id WHERE p.published = 1 AND p.pinterest_enabled = 1 AND c.slug = ? ORDER BY p.created_at DESC`, [categorySlug]);
}
async function getRelatedPosts(postId, limit = 3, userInterests) {
  let orderClause = "p.created_at DESC";
  if (userInterests) {
    const { categories = {}, tags = {} } = userInterests;
    const orderParts = [];
    const escapeStr = (val) => `'${val.replace(/'/g, "''")}'`;
    const cap = (raw) => {
      if (raw <= 0) return 0;
      const v = Math.min(8, Math.log2(1 + raw));
      return Math.round(v * 100) / 100;
    };
    for (const [catName, score] of Object.entries(categories)) {
      if (score > 0) {
        orderParts.push(
          `(CASE WHEN EXISTS (SELECT 1 FROM post_categories jpc JOIN categories jc ON jpc.category_id = jc.id WHERE jpc.post_id = p.id AND jc.name = ${escapeStr(catName)}) THEN ${cap(score) * 2} ELSE 0 END)`
        );
      }
    }
    for (const [tagName, score] of Object.entries(tags)) {
      if (score > 0) {
        const safeTag = tagName.replace(/'/g, "''");
        orderParts.push(
          `(CASE WHEN p.tags LIKE '%${safeTag}%' THEN ${cap(score) * 1.5} ELSE 0 END)`
        );
      }
    }
    orderParts.push(
      `(CASE WHEN (strftime('%s', 'now') - strftime('%s', p.created_at)) < 3 * 86400 THEN 10 WHEN (strftime('%s', 'now') - strftime('%s', p.created_at)) < 14 * 86400 THEN 4 ELSE 0 END)`
    );
    if (orderParts.length > 0) {
      orderClause = `${orderParts.join(" + ")} DESC, p.created_at DESC`;
    }
  }
  const sql = `
    SELECT p.*, GROUP_CONCAT(c.name, ', ') as categories 
    FROM posts p 
    LEFT JOIN post_categories pc ON p.id = pc.post_id 
    LEFT JOIN categories c ON pc.category_id = c.id 
    WHERE p.published = 1 AND p.id != ? 
      AND (pc.category_id IN (SELECT pc2.category_id FROM post_categories pc2 WHERE pc2.post_id = ?) 
      OR (SELECT COUNT(*) FROM post_categories pc3 WHERE pc3.post_id = ?) = 0) 
    GROUP BY p.id 
    ORDER BY ${orderClause} 
    LIMIT ?`;
  return await query(sql, [postId, postId, postId, limit]);
}
async function getAllPremiumPlans(_tenantId) {
  const plans = await query("SELECT * FROM premium_plans WHERE is_active = 1 ORDER BY price_cents ASC");
  return plans.map((plan) => {
    if (plan.features && typeof plan.features === "string") {
      try {
        plan.features = JSON.parse(plan.features);
      } catch {
      }
    }
    return plan;
  });
}
async function getPremiumPlanById(id, _tenantId) {
  const plan = await queryOne("SELECT * FROM premium_plans WHERE id = ?", [id]);
  if (plan && plan.features && typeof plan.features === "string") {
    try {
      plan.features = JSON.parse(plan.features);
    } catch {
    }
  }
  return plan;
}
async function getPremiumPlanBySlug(slug, _tenantId) {
  const plan = await queryOne("SELECT * FROM premium_plans WHERE slug = ?", [slug]);
  if (plan && plan.features && typeof plan.features === "string") {
    try {
      plan.features = JSON.parse(plan.features);
    } catch {
    }
  }
  return plan;
}
async function createPremiumPlan(plan) {
  return run("INSERT INTO premium_plans (name, slug, description, price_cents, interval_days, mp_plan_id, features, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
    plan.name,
    plan.slug,
    plan.description || null,
    plan.price_cents,
    plan.interval_days || 30,
    null,
    plan.features ? JSON.stringify(plan.features) : null,
    plan.is_active !== void 0 ? plan.is_active ? 1 : 0 : 1
  ]);
}
async function updatePremiumPlan(id, plan) {
  return run("UPDATE premium_plans SET name = ?, slug = ?, description = ?, price_cents = ?, interval_days = ?, mp_plan_id = ?, features = ?, is_active = ? WHERE id = ?", [
    plan.name ?? null,
    plan.slug ?? null,
    plan.description ?? null,
    plan.price_cents ?? null,
    plan.interval_days ?? null,
    null,
    plan.features ? JSON.stringify(plan.features) : null,
    plan.is_active !== void 0 ? plan.is_active ? 1 : 0 : null,
    id
  ]);
}
async function deletePremiumPlan(id, _tenantId) {
  return run("DELETE FROM premium_plans WHERE id = ?", [id]);
}
async function getUserSubscription(userId, _tenantId) {
  return await queryOne(`SELECT * FROM premium_subscriptions WHERE user_id = ? AND status = 'active' AND expires_at > datetime('now') ORDER BY expires_at DESC LIMIT 1`, [userId]);
}
async function getSubscriptionById(id, _tenantId) {
  return await queryOne("SELECT * FROM premium_subscriptions WHERE id = ?", [id]);
}
async function getSubscriptionByAsaasId(asaasSubscriptionId) {
  return await queryOne("SELECT * FROM premium_subscriptions WHERE asaas_subscription_id = ?", [asaasSubscriptionId]);
}
async function createSubscription(sub) {
  return run(
    `INSERT INTO premium_subscriptions (
      user_id, plan_id, mp_subscription_id, mp_payment_id, status, started_at, expires_at,
      asaas_subscription_id, asaas_customer_id, stripe_subscription_id, stripe_customer_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sub.user_id,
      sub.plan_id,
      null,
      null,
      sub.status || "pending",
      sub.started_at || null,
      sub.expires_at || null,
      sub.asaas_subscription_id || null,
      sub.asaas_customer_id || null,
      sub.stripe_subscription_id || null,
      sub.stripe_customer_id || null
    ]
  );
}
async function updateSubscription(id, data) {
  return run("UPDATE premium_subscriptions SET status = ?, mp_payment_id = ?, expires_at = ? WHERE id = ?", [
    data.status || null,
    null,
    data.expires_at || null,
    id
  ]);
}
async function updateSubscriptionByAsaasId(asaasSubscriptionId, data) {
  return run("UPDATE premium_subscriptions SET status = ?, expires_at = ? WHERE asaas_subscription_id = ?", [data.status, data.expires_at, asaasSubscriptionId]);
}
async function updateSubscriptionByStripeId(stripeSubscriptionId, data) {
  if (data.expires_at && data.stripe_customer_id) {
    return run(
      "UPDATE premium_subscriptions SET status = ?, expires_at = ?, stripe_customer_id = ? WHERE stripe_subscription_id = ?",
      [data.status, data.expires_at, data.stripe_customer_id, stripeSubscriptionId]
    );
  }
  if (data.expires_at) {
    return run("UPDATE premium_subscriptions SET status = ?, expires_at = ? WHERE stripe_subscription_id = ?", [
      data.status,
      data.expires_at,
      stripeSubscriptionId
    ]);
  }
  return run("UPDATE premium_subscriptions SET status = ? WHERE stripe_subscription_id = ?", [
    data.status,
    stripeSubscriptionId
  ]);
}
async function getSubscriptionByStripeId(stripeSubscriptionId) {
  return queryOne("SELECT * FROM premium_subscriptions WHERE stripe_subscription_id = ?", [
    stripeSubscriptionId
  ]);
}
async function createPayment(payment) {
  return run(
    "INSERT INTO premium_payments (subscription_id, mp_payment_id, amount_cents, status, payment_method, asaas_payment_id, stripe_payment_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      payment.subscription_id || null,
      null,
      payment.amount_cents,
      payment.status,
      payment.payment_method || null,
      payment.asaas_payment_id || null,
      payment.stripe_payment_id || null
    ]
  );
}
async function getPaymentByAsaasId(asaasPaymentId) {
  return await queryOne("SELECT * FROM premium_payments WHERE asaas_payment_id = ?", [asaasPaymentId]);
}
async function getPaymentByStripeId(stripePaymentId) {
  return queryOne("SELECT * FROM premium_payments WHERE stripe_payment_id = ?", [stripePaymentId]);
}
async function getAllUsersByRole(role) {
  return await query("SELECT id, username, role, created_at FROM users WHERE role = ? ORDER BY created_at DESC", [role]);
}
async function deleteUser(id) {
  await run("DELETE FROM sessions WHERE username = (SELECT username FROM users WHERE id = ?)", [id]);
  await run("DELETE FROM premium_subscriptions WHERE user_id = ?", [id]);
  return run("DELETE FROM users WHERE id = ?", [id]);
}
async function grantPremiumAccessManual(userId, planId, days = 30) {
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1e3).toISOString();
  const existing = await queryOne("SELECT id FROM premium_subscriptions WHERE user_id = ?", [userId]);
  if (existing) {
    return run("UPDATE premium_subscriptions SET status = 'active', plan_id = ?, expires_at = ? WHERE user_id = ?", [planId, expiresAt, userId]);
  } else {
    return createSubscription({
      user_id: userId,
      plan_id: planId,
      status: "active",
      started_at: (/* @__PURE__ */ new Date()).toISOString(),
      expires_at: expiresAt
    });
  }
}
async function revokePremiumAccessManual(userId) {
  return run("UPDATE premium_subscriptions SET status = 'cancelled', expires_at = datetime('now') WHERE user_id = ?", [userId]);
}
async function getPaymentsBySubscription(subscriptionId, _tenantId) {
  return await query("SELECT * FROM premium_payments WHERE subscription_id = ? ORDER BY created_at DESC", [subscriptionId]);
}
async function isUserPremium(userId, _tenantId) {
  return !!await getUserSubscription(userId);
}
async function searchPosts(q, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const like = `%${q}%`;
  const totalRow = await queryOne("SELECT COUNT(*) as count FROM posts WHERE published = 1 AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)", [like, like, like]);
  const total = totalRow?.count ?? 0;
  const posts = await query(`SELECT p.*, GROUP_CONCAT(c.name) AS category_names FROM posts p LEFT JOIN post_categories pc ON p.id = pc.post_id LEFT JOIN categories c ON pc.category_id = c.id WHERE p.published = 1 AND (p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?) GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`, [like, like, like, limit, offset]);
  return { posts, total, page, totalPages: Math.ceil(total / limit), hasMore: offset + posts.length < total };
}
async function getAllCategoriesAdmin(_tenantId) {
  return getAllCategories();
}
async function subscribeToNewsletter(email, name) {
  const sql = `INSERT OR IGNORE INTO newsletter_subscribers (email, name) VALUES (?, ?)`;
  return run(sql, [email, name || null]);
}
async function getNewsletterSubscribers(page = 1, limit = 20, search = "") {
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;
  const countSql = `SELECT COUNT(*) as count FROM newsletter_subscribers WHERE email LIKE ? OR name LIKE ?`;
  const countResult = await queryOne(countSql, [searchTerm, searchTerm]);
  const total = countResult?.count || 0;
  const sql = `
    SELECT * FROM newsletter_subscribers 
    WHERE email LIKE ? OR name LIKE ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;
  const subscribers = await query(sql, [searchTerm, searchTerm, limit, offset]);
  return {
    subscribers,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}
async function deleteNewsletterSubscriber(id) {
  return run(`DELETE FROM newsletter_subscribers WHERE id = ?`, [id]);
}
async function createNewsletterCampaign(campaign) {
  const sql = `
    INSERT INTO newsletter_campaigns (subject, content, youtube_video_url, recipients_count)
    VALUES (?, ?, ?, ?)
  `;
  return run(sql, [
    campaign.subject,
    campaign.content,
    campaign.youtubeVideoUrl || null,
    campaign.recipientsCount
  ]);
}
async function getNewsletterCampaigns(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const countSql = `SELECT COUNT(*) as count FROM newsletter_campaigns`;
  const countResult = await queryOne(countSql);
  const total = countResult?.count || 0;
  const sql = `
    SELECT * FROM newsletter_campaigns
    ORDER BY sent_at DESC
    LIMIT ? OFFSET ?
  `;
  const campaigns = await query(sql, [limit, offset]);
  return {
    campaigns,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}
async function getActiveNewsletterEmails() {
  const rows = await query(`
    SELECT email FROM newsletter_subscribers
    WHERE status = 'active'
  `);
  return rows.map((r) => r.email);
}
async function getCLIToken() {
  const row = await queryOne("SELECT value FROM settings WHERE key = ?", ["cli_token"]);
  return row?.value ?? null;
}
const CLI_TOKEN_LIFETIME_MS = 90 * 24 * 60 * 60 * 1e3;
function hashCLIToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
function safeHashEquals(left, right) {
  if (!/^[a-f0-9]{64}$/i.test(left) || !/^[a-f0-9]{64}$/i.test(right)) return false;
  return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}
async function getCLITokenStatus() {
  const [hashRow, expiryRow, legacyRow] = await Promise.all([
    queryOne("SELECT value FROM settings WHERE key = ?", ["cli_token_hash"]),
    queryOne("SELECT value FROM settings WHERE key = ?", ["cli_token_expires_at"]),
    queryOne("SELECT value FROM settings WHERE key = ?", ["cli_token"])
  ]);
  const expiresAt = expiryRow?.value ? Number(expiryRow.value) : null;
  const hashConfigured = typeof hashRow?.value === "string" && hashRow.value.length > 0;
  return {
    configured: hashConfigured || Boolean(legacyRow?.value),
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : null,
    legacy: !hashConfigured && Boolean(legacyRow?.value)
  };
}
async function regenerateCLIToken() {
  const token = `blog_${crypto.randomBytes(32).toString("hex")}`;
  const expiresAt = Date.now() + CLI_TOKEN_LIFETIME_MS;
  await runBatch([
    { sql: "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", args: ["cli_token_hash", hashCLIToken(token)] },
    { sql: "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", args: ["cli_token_expires_at", String(expiresAt)] },
    { sql: "DELETE FROM settings WHERE key = ?", args: ["cli_token"] }
  ]);
  return token;
}
async function validateCLIToken(token) {
  if (!token) return false;
  const [hashRow, expiryRow] = await Promise.all([
    queryOne("SELECT value FROM settings WHERE key = ?", ["cli_token_hash"]),
    queryOne("SELECT value FROM settings WHERE key = ?", ["cli_token_expires_at"])
  ]);
  if (hashRow?.value) {
    const expiresAt2 = Number(expiryRow?.value || 0);
    if (!Number.isFinite(expiresAt2) || expiresAt2 <= Date.now()) return false;
    return safeHashEquals(hashCLIToken(token), String(hashRow.value));
  }
  const legacyToken = await getCLIToken();
  if (!legacyToken || !safeHashEquals(hashCLIToken(token), hashCLIToken(legacyToken))) return false;
  const expiresAt = Date.now() + CLI_TOKEN_LIFETIME_MS;
  await runBatch([
    { sql: "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", args: ["cli_token_hash", hashCLIToken(token)] },
    { sql: "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", args: ["cli_token_expires_at", String(expiresAt)] },
    { sql: "DELETE FROM settings WHERE key = ?", args: ["cli_token"] }
  ]);
  return true;
}
async function recordPageView(pathname, ip, userAgent) {
  let pageType = "other";
  let slug = null;
  if (pathname === "/") {
    pageType = "home";
  } else if (pathname.startsWith("/post/")) {
    pageType = "post";
    slug = pathname.split("/post/")[1]?.split("?")[0] || null;
  } else if (pathname.startsWith("/category/")) {
    pageType = "category";
    slug = pathname.split("/category/")[1]?.split("?")[0] || null;
  } else {
    return;
  }
  const normalizedIp = ip?.replace(/^::ffff:/, "") || "unknown";
  const ua = (userAgent || "").substring(0, 200);
  try {
    const recentView = await queryOne(
      `SELECT id FROM page_views 
       WHERE page_type = ? 
         AND (slug = ? OR (slug IS NULL AND ? IS NULL)) 
         AND ip_address = ? 
         AND (user_agent = ? OR (user_agent IS NULL AND ? = ''))
         AND created_at > datetime('now', '-1 hour')`,
      [pageType, slug, slug, normalizedIp, ua, ua]
    );
    if (!recentView) {
      await run(
        "INSERT INTO page_views (page_type, slug, ip_address, user_agent) VALUES (?, ?, ?, ?)",
        [pageType, slug, normalizedIp, ua || null]
      );
    }
  } catch (e) {
    console.error("Error recording page view:", e);
  }
}
async function getAnalyticsSummary(tenantId) {
  const [totalRow, todayRow, weekRow, daysRows, postsRows] = await Promise.all([
    queryOne("SELECT COUNT(*) as count FROM page_views"),
    queryOne("SELECT COUNT(*) as count FROM page_views WHERE created_at >= datetime('now', 'start of day')"),
    queryOne("SELECT COUNT(*) as count FROM page_views WHERE created_at >= datetime('now', '-7 days')"),
    query(`
      SELECT date(created_at) as view_date, COUNT(*) as count 
      FROM page_views 
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY view_date ASC
    `),
    query(`
      SELECT p.id, p.title, p.slug, COUNT(pv.id) as views
      FROM page_views pv
      JOIN posts p ON pv.slug = p.slug
      WHERE pv.page_type = 'post'
      GROUP BY p.id, p.title, p.slug
      ORDER BY views DESC
      LIMIT 5
    `)
  ]);
  const viewsByDayMap = /* @__PURE__ */ new Map();
  for (let i = 6; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    viewsByDayMap.set(dateStr, 0);
  }
  if (daysRows) {
    for (const r of daysRows) {
      if (r.view_date) {
        viewsByDayMap.set(r.view_date, Number(r.count || 0));
      }
    }
  }
  const viewsByDay = Array.from(viewsByDayMap.entries()).map(([date, count]) => ({
    date,
    count
  }));
  return {
    totalViews: Number(totalRow?.count || 0),
    viewsToday: Number(todayRow?.count || 0),
    viewsWeek: Number(weekRow?.count || 0),
    viewsByDay,
    topPosts: (postsRows || []).map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      slug: String(r.slug),
      views: Number(r.views)
    }))
  };
}
async function createOtp(email, code, expiresAt) {
  await run("UPDATE member_otps SET used = 1 WHERE email = ? AND used = 0", [email]);
  return run("INSERT INTO member_otps (email, code, expires_at) VALUES (?, ?, ?)", [email, code, expiresAt]);
}
async function verifyOtpCode(email, code) {
  const row = await queryOne(`
    SELECT id FROM member_otps 
    WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now')
    ORDER BY id DESC LIMIT 1
  `, [email, code]);
  if (row) {
    await run("UPDATE member_otps SET used = 1 WHERE id = ?", [row.id]);
    return true;
  }
  return false;
}
async function createProduct(prod) {
  return run(
    "INSERT INTO products (name, slug, description, price_cents, file_url, external_link, image_url, category_id, youtube_video_url, resource_type, access_label, drive_instructions, delivery_deadline, is_premium_included, has_extra_service, extra_service_title, extra_service_price_cents, extra_service_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      prod.name,
      prod.slug || null,
      prod.description || null,
      prod.price_cents,
      prod.file_url || null,
      prod.external_link || null,
      prod.image_url || null,
      prod.category_id || null,
      prod.youtube_video_url || null,
      prod.resource_type || "file",
      prod.access_label || null,
      prod.drive_instructions || null,
      prod.delivery_deadline || null,
      prod.is_premium_included || 0,
      prod.has_extra_service || 0,
      prod.extra_service_title || null,
      prod.extra_service_price_cents || 0,
      prod.extra_service_description || null
    ]
  );
}
async function updateProduct(id, prod) {
  return run(
    "UPDATE products SET name = ?, slug = ?, description = ?, price_cents = ?, file_url = ?, external_link = ?, image_url = ?, category_id = ?, youtube_video_url = ?, resource_type = ?, access_label = ?, drive_instructions = ?, delivery_deadline = ?, is_premium_included = ?, has_extra_service = ?, extra_service_title = ?, extra_service_price_cents = ?, extra_service_description = ? WHERE id = ?",
    [
      prod.name,
      prod.slug,
      prod.description,
      prod.price_cents,
      prod.file_url,
      prod.external_link,
      prod.image_url,
      prod.category_id,
      prod.youtube_video_url,
      prod.resource_type || "file",
      prod.access_label || null,
      prod.drive_instructions || null,
      prod.delivery_deadline || null,
      prod.is_premium_included || 0,
      prod.has_extra_service || 0,
      prod.extra_service_title || null,
      prod.extra_service_price_cents || 0,
      prod.extra_service_description || null,
      id
    ]
  );
}
function mapProductRow(row) {
  if (!row) return void 0;
  const { category_name, ...rest } = row;
  return {
    ...rest,
    // Prefer joined name; never trust legacy products.category text column
    category: category_name ?? null
  };
}
function mapProductRows(rows) {
  return (rows || []).map((row) => mapProductRow(row)).filter(Boolean);
}
const PRODUCT_SELECT_WITH_CATEGORY = `
  SELECT p.*, pc.name AS category_name
  FROM products p
  LEFT JOIN product_categories pc ON p.category_id = pc.id
`;
async function getProductBySlug(slug) {
  return mapProductRow(
    await queryOne(`${PRODUCT_SELECT_WITH_CATEGORY} WHERE p.slug = ?`, [slug])
  );
}
async function productSlugExists(slug, excludeId) {
  const sql = excludeId ? "SELECT id FROM products WHERE slug = ? AND id != ?" : "SELECT id FROM products WHERE slug = ?";
  const params = excludeId ? [slug, excludeId] : [slug];
  const row = await queryOne(sql, params);
  return !!row;
}
async function generateUniqueProductSlug(name, excludeId) {
  let slug = name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
  if (!slug) slug = "produto";
  let exists = await productSlugExists(slug, excludeId);
  let counter = 2;
  while (exists) {
    const candidate = `${slug}-${counter}`;
    const check = await productSlugExists(candidate, excludeId);
    if (!check) {
      slug = candidate;
      break;
    }
    counter++;
  }
  return slug;
}
async function deleteProduct(id) {
  await run("DELETE FROM post_products WHERE product_id = ?", [id]);
  return run("DELETE FROM products WHERE id = ?", [id]);
}
async function getProductById(id) {
  return mapProductRow(
    await queryOne(`${PRODUCT_SELECT_WITH_CATEGORY} WHERE p.id = ?`, [id])
  );
}
async function getAllProducts() {
  return mapProductRows(
    await query(`${PRODUCT_SELECT_WITH_CATEGORY} ORDER BY p.created_at DESC`)
  );
}
async function getProductsByPostId(postId) {
  return mapProductRows(
    await query(
      `SELECT p.*, pc.name AS category_name
       FROM products p
       JOIN post_products pp ON p.id = pp.product_id
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       WHERE pp.post_id = ?
       ORDER BY p.created_at DESC`,
      [postId]
    )
  );
}
async function assignProductsToPost(postId, productIds) {
  await run("DELETE FROM post_products WHERE post_id = ?", [postId]);
  for (const prodId of productIds) {
    await run("INSERT INTO post_products (post_id, product_id) VALUES (?, ?)", [postId, prodId]);
  }
}
async function createProductPurchase(purchase) {
  return run(
    "INSERT INTO product_purchases (user_id, product_id, product_name_snapshot, price_cents, asaas_payment_id, status, buyer_access_id, stripe_session_id, has_extra_service, extra_service_title_snapshot, extra_service_price_cents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      purchase.userId,
      purchase.productId,
      purchase.productNameSnapshot || null,
      purchase.priceCents || null,
      purchase.asaasPaymentId || null,
      purchase.status || "pending",
      purchase.buyerAccessId || null,
      purchase.stripeSessionId || null,
      purchase.hasExtraService || 0,
      purchase.extraServiceTitleSnapshot || null,
      purchase.extraServicePriceCents || 0
    ]
  );
}
async function getProductPurchaseForUser(userId, productId) {
  return queryOne(
    "SELECT * FROM product_purchases WHERE user_id = ? AND product_id = ? AND status != 'pending' ORDER BY created_at DESC LIMIT 1",
    [userId, productId]
  );
}
async function hasUserPurchasedProduct(userId, productId) {
  const row = await queryOne(
    "SELECT id FROM product_purchases WHERE user_id = ? AND product_id = ? AND status IN ('completed', 'pending_delivery')",
    [userId, productId]
  );
  return !!row;
}
async function markManualDelivered(purchaseId) {
  return run(
    "UPDATE product_purchases SET status = 'completed' WHERE id = ? AND status = 'pending_delivery'",
    [purchaseId]
  );
}
async function getAllCourses(publishedOnly = false) {
  const where = publishedOnly ? "WHERE mc.published = 1" : "";
  return query(`
    SELECT mc.*,
      (SELECT COUNT(*) FROM member_lessons ml WHERE ml.course_id = mc.id AND ml.published = 1) as lesson_count,
      (SELECT COUNT(*) FROM member_materials mm WHERE mm.course_id = mc.id) as material_count
    FROM member_courses mc
    ${where}
    ORDER BY mc.sort_order ASC, mc.created_at DESC
  `);
}
async function getCourseBySlug(slug) {
  return queryOne("SELECT * FROM member_courses WHERE slug = ?", [slug]);
}
async function getCourseById(id) {
  return queryOne("SELECT * FROM member_courses WHERE id = ?", [id]);
}
async function createCourse(course) {
  return run(
    `INSERT INTO member_courses (title, slug, description, cover_image, access_type, price_cents, published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      course.title,
      course.slug,
      course.description || null,
      course.cover_image || null,
      course.access_type || "premium",
      course.price_cents || 0,
      course.published || 0,
      course.sort_order || 0
    ]
  );
}
async function updateCourse(id, course) {
  return run(
    `UPDATE member_courses SET title=?, slug=?, description=?, cover_image=?, access_type=?, price_cents=?, published=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [
      course.title,
      course.slug,
      course.description || null,
      course.cover_image || null,
      course.access_type || "premium",
      course.price_cents || 0,
      course.published || 0,
      course.sort_order || 0,
      id
    ]
  );
}
async function deleteCourse(id) {
  return run("DELETE FROM member_courses WHERE id = ?", [id]);
}
async function generateUniqueCourseSlug(title, excludeId) {
  let slug = title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
  let exists = await queryOne(
    excludeId ? "SELECT slug FROM member_courses WHERE slug = ? AND id != ?" : "SELECT slug FROM member_courses WHERE slug = ?",
    excludeId ? [slug, excludeId] : [slug]
  );
  let counter = 2;
  while (exists) {
    const candidate = `${slug}-${counter}`;
    exists = await queryOne("SELECT slug FROM member_courses WHERE slug = ?", [candidate]);
    if (!exists) {
      slug = candidate;
      break;
    }
    counter++;
  }
  return slug;
}
async function getLessonsByCourseId(courseId, publishedOnly = false) {
  const where = publishedOnly ? "AND published = 1" : "";
  return query(
    `SELECT * FROM member_lessons WHERE course_id = ? ${where} ORDER BY sort_order ASC, id ASC`,
    [courseId]
  );
}
async function getLessonById(id) {
  return queryOne("SELECT * FROM member_lessons WHERE id = ?", [id]);
}
async function createLesson(lesson) {
  return run(
    `INSERT INTO member_lessons (course_id, title, content, video_url, video_type, topic, sort_order, published, is_preview)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lesson.course_id,
      lesson.title,
      lesson.content || null,
      lesson.video_url || null,
      lesson.video_type || "youtube",
      lesson.topic || null,
      lesson.sort_order || 0,
      lesson.published ?? 1,
      lesson.is_preview ?? 0
    ]
  );
}
async function updateLesson(id, lesson) {
  return run(
    `UPDATE member_lessons SET title=?, content=?, video_url=?, video_type=?, topic=?, sort_order=?, published=?, is_preview=? WHERE id=?`,
    [
      lesson.title,
      lesson.content || null,
      lesson.video_url || null,
      lesson.video_type || "youtube",
      lesson.topic || null,
      lesson.sort_order ?? 0,
      lesson.published ?? 1,
      lesson.is_preview ?? 0,
      id
    ]
  );
}
async function deleteLesson(id) {
  return run("DELETE FROM member_lessons WHERE id = ?", [id]);
}
async function getMaterialsByCourseId(courseId) {
  return query("SELECT * FROM member_materials WHERE course_id = ? ORDER BY sort_order ASC, id ASC", [courseId]);
}
async function createMaterial(material) {
  return run(
    `INSERT INTO member_materials (course_id, title, description, file_url, file_type, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      material.course_id || null,
      material.title,
      material.description || null,
      material.file_url,
      material.file_type || null,
      material.sort_order || 0
    ]
  );
}
async function deleteMaterial(id) {
  return run("DELETE FROM member_materials WHERE id = ?", [id]);
}
async function getCoursePurchase(userId, courseId) {
  return queryOne(
    "SELECT * FROM course_purchases WHERE user_id = ? AND course_id = ? ORDER BY id DESC LIMIT 1",
    [userId, courseId]
  );
}
async function hasUserPurchasedCourse(userId, courseId) {
  const row = await queryOne(
    "SELECT id FROM course_purchases WHERE user_id = ? AND course_id = ? AND status = 'approved'",
    [userId, courseId]
  );
  return !!row;
}
async function createCoursePurchase(purchase) {
  return run(
    `INSERT INTO course_purchases (user_id, course_id, asaas_payment_id, amount_cents, status, stripe_session_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      purchase.userId,
      purchase.courseId,
      purchase.asaasPaymentId || null,
      purchase.amountCents || 0,
      purchase.status || "pending",
      purchase.stripeSessionId || null
    ]
  );
}
async function updateCoursePurchaseByAsaasId(asaasPaymentId, status) {
  return run(
    "UPDATE course_purchases SET status = ? WHERE asaas_payment_id = ?",
    [status, asaasPaymentId]
  );
}
async function getUserCoursePurchases(userId) {
  return query(
    `SELECT cp.*, mc.title, mc.slug, mc.cover_image
     FROM course_purchases cp
     JOIN member_courses mc ON cp.course_id = mc.id
     WHERE cp.user_id = ? AND cp.status = 'approved'
     ORDER BY cp.created_at DESC`,
    [userId]
  );
}
async function getAllShortlinks() {
  return await query("SELECT * FROM shortlinks ORDER BY created_at DESC");
}
async function getPaginatedShortlinks(q = "", limit = 10, offset = 0) {
  const searchTerm = `%${q.trim().toLowerCase()}%`;
  return await query(
    `SELECT * FROM shortlinks 
     WHERE slug LIKE ? OR destination_url LIKE ? 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [searchTerm, searchTerm, limit, offset]
  );
}
async function getShortlinksCount(q = "") {
  const searchTerm = `%${q.trim().toLowerCase()}%`;
  const result = await queryOne(
    `SELECT COUNT(*) as count FROM shortlinks 
     WHERE slug LIKE ? OR destination_url LIKE ?`,
    [searchTerm, searchTerm]
  );
  return result ? result.count : 0;
}
async function getIndexedShortlinks() {
  return await query("SELECT * FROM shortlinks WHERE is_indexed = 1 ORDER BY created_at DESC");
}
async function getShortlinkBySlug(slug) {
  return await queryOne("SELECT * FROM shortlinks WHERE slug = ?", [slug]);
}
async function getShortlinkById(id) {
  return await queryOne("SELECT * FROM shortlinks WHERE id = ?", [id]);
}
async function createShortlink(link) {
  return run(
    "INSERT INTO shortlinks (slug, destination_url, use_ad_interstitial, ad_duration_seconds, is_indexed, meta_title, meta_description, fixed_ad_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      link.slug.trim().toLowerCase(),
      link.destinationUrl.trim(),
      link.useAdInterstitial ? 1 : 0,
      link.adDurationSeconds || 5,
      link.isIndexed ? 1 : 0,
      link.metaTitle ? link.metaTitle.trim() : null,
      link.metaDescription ? link.metaDescription.trim() : null,
      link.fixedAdId || null
    ]
  );
}
async function updateShortlink(id, link) {
  return run(
    "UPDATE shortlinks SET slug = ?, destination_url = ?, use_ad_interstitial = ?, ad_duration_seconds = ?, is_indexed = ?, meta_title = ?, meta_description = ?, fixed_ad_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [
      link.slug.trim().toLowerCase(),
      link.destinationUrl.trim(),
      link.useAdInterstitial ? 1 : 0,
      link.adDurationSeconds || 5,
      link.isIndexed ? 1 : 0,
      link.metaTitle ? link.metaTitle.trim() : null,
      link.metaDescription ? link.metaDescription.trim() : null,
      link.fixedAdId || null,
      id
    ]
  );
}
async function deleteShortlink(id) {
  return run("DELETE FROM shortlinks WHERE id = ?", [id]);
}
async function incrementShortlinkClicks(slug) {
  return run("UPDATE shortlinks SET clicks_count = clicks_count + 1 WHERE slug = ?", [slug]);
}
async function getAllWebStories() {
  return await query(
    `SELECT s.*, (SELECT COUNT(*) FROM web_story_slides wss WHERE wss.story_id = s.id) as slide_count
     FROM web_stories s
     ORDER BY s.sort_order ASC, s.created_at DESC`
  );
}
async function getPublishedWebStories(limit = 24) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  return await query(
    `SELECT * FROM web_stories
     WHERE published = 1
     ORDER BY sort_order ASC, created_at DESC
     LIMIT ?`,
    [safeLimit]
  );
}
async function getWebStoryBySlug(slug) {
  return await queryOne("SELECT * FROM web_stories WHERE slug = ?", [slug]);
}
async function getWebStoryById(id) {
  return await queryOne("SELECT * FROM web_stories WHERE id = ?", [id]);
}
async function getWebStorySlides(storyId) {
  return await query(
    "SELECT * FROM web_story_slides WHERE story_id = ? ORDER BY sort_order ASC, id ASC",
    [storyId]
  );
}
async function createWebStory(data) {
  return run(
    `INSERT INTO web_stories
      (title, slug, cover_image, poster_portrait, source_type, source_post_id, cta_url, cta_text, published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title.trim(),
      data.slug.trim().toLowerCase(),
      data.coverImage || null,
      data.posterPortrait || data.coverImage || null,
      data.sourceType || "manual",
      data.sourcePostId || null,
      data.ctaUrl || null,
      data.ctaText || null,
      data.published ? 1 : 0,
      data.sortOrder ?? 0
    ]
  );
}
async function updateWebStory(id, data) {
  return run(
    `UPDATE web_stories SET
      title = ?, slug = ?, cover_image = ?, poster_portrait = ?,
      source_type = ?, source_post_id = ?, cta_url = ?, cta_text = ?,
      published = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      data.title.trim(),
      data.slug.trim().toLowerCase(),
      data.coverImage || null,
      data.posterPortrait || data.coverImage || null,
      data.sourceType || "manual",
      data.sourcePostId || null,
      data.ctaUrl || null,
      data.ctaText || null,
      data.published ? 1 : 0,
      data.sortOrder ?? 0,
      id
    ]
  );
}
async function deleteWebStory(id) {
  await run("DELETE FROM web_story_slides WHERE story_id = ?", [id]);
  return run("DELETE FROM web_stories WHERE id = ?", [id]);
}
async function replaceWebStorySlides(storyId, slides) {
  await run("DELETE FROM web_story_slides WHERE story_id = ?", [storyId]);
  let order = 0;
  for (const slide of slides) {
    await run(
      `INSERT INTO web_story_slides
        (story_id, sort_order, background_image, title, body, cta_url, cta_text)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        storyId,
        order++,
        slide.backgroundImage || null,
        slide.title || null,
        slide.body || null,
        slide.ctaUrl || null,
        slide.ctaText || null
      ]
    );
  }
}
async function generateWebStorySlug(title, excludeId) {
  let slug = title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60) || "story";
  let candidate = slug;
  let counter = 2;
  while (true) {
    const existing = await queryOne("SELECT id FROM web_stories WHERE slug = ?", [candidate]);
    if (!existing || excludeId && Number(existing.id) === Number(excludeId)) break;
    candidate = `${slug}-${counter++}`;
  }
  return candidate;
}
async function recordProductDownload(userId, productId) {
  return run(
    "INSERT INTO product_downloads (user_id, product_id) VALUES (?, ?)",
    [userId, productId]
  );
}
async function getProductBuyerEmails(productId) {
  const emails = /* @__PURE__ */ new Set();
  try {
    const buyers = await query(
      `SELECT DISTINCT u.username AS email
       FROM product_purchases pp
       JOIN users u ON pp.user_id = u.id
       WHERE pp.product_id = ?
         AND pp.status IN ('completed', 'pending_delivery')
         AND u.username IS NOT NULL
         AND trim(u.username) != ''`,
      [productId]
    );
    for (const row of buyers) {
      const email = String(row.email || "").trim().toLowerCase();
      if (email.includes("@")) emails.add(email);
    }
    const product = await queryOne(
      "SELECT is_premium_included FROM products WHERE id = ?",
      [productId]
    );
    if (product && Number(product.is_premium_included) === 1) {
      const premiumUsers = await query(
        `SELECT DISTINCT u.username AS email
         FROM premium_subscriptions ps
         JOIN users u ON ps.user_id = u.id
         WHERE ps.status = 'active'
           AND (ps.expires_at IS NULL OR ps.expires_at > datetime('now'))
           AND u.username IS NOT NULL
           AND trim(u.username) != ''`
      );
      for (const row of premiumUsers) {
        const email = String(row.email || "").trim().toLowerCase();
        if (email.includes("@")) emails.add(email);
      }
    }
  } catch (e) {
    console.error("[DB] getProductBuyerEmails error:", e);
  }
  return Array.from(emails);
}
async function getSalesSummary() {
  await getClient();
  const products = await queryOne(
    `SELECT COUNT(*) as count, SUM(COALESCE(pp.price_cents, p.price_cents, 0)) as total 
     FROM product_purchases pp
     LEFT JOIN products p ON pp.product_id = p.id
     WHERE pp.status = 'completed'`
  );
  const courses = await queryOne(
    `SELECT COUNT(*) as count, SUM(cp.amount_cents) as total 
     FROM course_purchases cp
     WHERE cp.status = 'approved'`
  );
  const subscriptions = await queryOne(
    `SELECT COUNT(*) as count, SUM(py.amount_cents) as total 
     FROM premium_payments py
     WHERE py.status = 'approved'`
  );
  const activeSubscriptions = await queryOne(
    `SELECT COUNT(*) as count FROM premium_subscriptions WHERE status = 'active'`
  );
  const totalRevenueCents = (products?.total || 0) + (courses?.total || 0) + (subscriptions?.total || 0);
  return {
    totalRevenue: totalRevenueCents / 100,
    totalRevenueCents,
    productSalesCount: products?.count || 0,
    productRevenue: (products?.total || 0) / 100,
    courseSalesCount: courses?.count || 0,
    courseRevenue: (courses?.total || 0) / 100,
    subscriptionSalesCount: subscriptions?.count || 0,
    subscriptionRevenue: (subscriptions?.total || 0) / 100,
    activeSubscriptionsCount: activeSubscriptions?.count || 0
  };
}
async function getSalesHistory() {
  const db = await getClient();
  const result = await db.execute(`
    SELECT * FROM (
      SELECT 
        pp.id,
        pp.user_id,
        u.username,
        u.name as user_name,
        COALESCE(pp.product_name_snapshot, p.name, 'Produto') as item_name,
        COALESCE(pp.price_cents, p.price_cents, 0) as amount_cents,
        'product' as item_type,
        pp.status,
        pp.created_at,
        pp.buyer_access_id,
        COALESCE(p.resource_type, 'file') as product_resource_type,
        COALESCE(pp.has_extra_service, 0) as has_extra_service,
        pp.extra_service_title_snapshot,
        COALESCE(pp.extra_service_price_cents, 0) as extra_service_price_cents
      FROM product_purchases pp
      JOIN users u ON pp.user_id = u.id
      LEFT JOIN products p ON pp.product_id = p.id

      UNION ALL

      SELECT 
        cp.id,
        cp.user_id,
        u.username,
        u.name as user_name,
        c.title as item_name,
        COALESCE(cp.amount_cents, 0) as amount_cents,
        'course' as item_type,
        cp.status,
        cp.created_at,
        NULL as buyer_access_id,
        NULL as product_resource_type,
        0 as has_extra_service,
        NULL as extra_service_title_snapshot,
        0 as extra_service_price_cents
      FROM course_purchases cp
      JOIN users u ON cp.user_id = u.id
      JOIN member_courses c ON cp.course_id = c.id

      UNION ALL

      SELECT 
        py.id,
        s.user_id,
        u.username,
        u.name as user_name,
        pl.name as item_name,
        py.amount_cents,
        'subscription' as item_type,
        py.status,
        py.created_at,
        NULL as buyer_access_id,
        NULL as product_resource_type,
        0 as has_extra_service,
        NULL as extra_service_title_snapshot,
        0 as extra_service_price_cents
      FROM premium_payments py
      JOIN premium_subscriptions s ON py.subscription_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN premium_plans pl ON s.plan_id = pl.id
    ) AS sales
    ORDER BY created_at DESC
  `);
  return result.rows || [];
}
async function getUsersHoldings() {
  const db = await getClient();
  const usersResult = await db.execute(
    "SELECT id, username, name, role, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC"
  );
  const users = usersResult.rows || [];
  const productsResult = await db.execute(`
    SELECT pp.user_id, pp.product_id, COALESCE(pp.product_name_snapshot, p.name, 'Produto') as item_name, pp.created_at,
           (SELECT COUNT(*) FROM product_downloads pd WHERE pd.user_id = pp.user_id AND pd.product_id = pp.product_id) as download_count
    FROM product_purchases pp
    LEFT JOIN products p ON pp.product_id = p.id
    WHERE pp.status = 'completed'
  `);
  const productPurchases = productsResult.rows || [];
  const coursesResult = await db.execute(`
    SELECT cp.user_id, cp.course_id, c.title as item_name, cp.created_at
    FROM course_purchases cp
    JOIN member_courses c ON cp.course_id = c.id
    WHERE cp.status = 'approved'
  `);
  const coursePurchases = coursesResult.rows || [];
  const subsResult = await db.execute(`
    SELECT s.user_id, pl.name as plan_name, s.expires_at, s.status, s.created_at
    FROM premium_subscriptions s
    JOIN premium_plans pl ON s.plan_id = pl.id
    WHERE s.status = 'active'
  `);
  const subscriptions = subsResult.rows || [];
  return users.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    createdAt: u.created_at,
    products: productPurchases.filter((p) => p.user_id === u.id),
    courses: coursePurchases.filter((c) => c.user_id === u.id),
    subscription: subscriptions.find((s) => s.user_id === u.id) || null
  }));
}
async function getRelatedProducts(productId, categoryId, limit = 3) {
  let rows = [];
  if (categoryId) {
    rows = mapProductRows(
      await query(
        `${PRODUCT_SELECT_WITH_CATEGORY} WHERE p.category_id = ? AND p.id != ? ORDER BY p.created_at DESC LIMIT ?`,
        [categoryId, productId, limit]
      )
    );
  }
  if (rows.length < limit) {
    const needed = limit - rows.length;
    const excludeIds = [productId, ...rows.map((r) => r.id)];
    const placeholders = excludeIds.map(() => "?").join(",");
    const extra = mapProductRows(
      await query(
        `${PRODUCT_SELECT_WITH_CATEGORY} WHERE p.id NOT IN (${placeholders}) ORDER BY p.created_at DESC LIMIT ?`,
        [...excludeIds, needed]
      )
    );
    rows = [...rows, ...extra];
  }
  return rows;
}
async function getProductCategories() {
  return await query("SELECT * FROM product_categories ORDER BY name ASC");
}
async function createProductCategory(name, description) {
  let baseSlug = name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
  if (!baseSlug) baseSlug = `categoria-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const check = await queryOne("SELECT id FROM product_categories WHERE slug = ?", [slug]);
    if (!check) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return run(
    "INSERT INTO product_categories (name, slug, description) VALUES (?, ?, ?)",
    [name.trim(), slug, description || null]
  );
}
async function updateProductCategory(id, name, description) {
  let baseSlug = name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
  if (!baseSlug) baseSlug = `categoria-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const check = await queryOne("SELECT id FROM product_categories WHERE slug = ? AND id != ?", [slug, id]);
    if (!check) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return run(
    "UPDATE product_categories SET name = ?, slug = ?, description = ? WHERE id = ?",
    [name.trim(), slug, description || null, id]
  );
}
async function deleteProductCategory(id) {
  return run("DELETE FROM product_categories WHERE id = ?", [id]);
}
async function autoTagExistingPosts() {
  try {
    const posts = await query("SELECT id, title, tags FROM posts");
    const keywords = ["IA", "SEO", "Pinterest", "WordPress", "Svelte", "Cloudinary", "Mercado Livre", "Mercado Pago", "Asaas", "Google", "WhatsApp", "YouTube", "Dinheiro", "Tráfego", "Afiliado"];
    for (const post of posts) {
      if (!post.tags || post.tags.trim() === "") {
        const tags = [];
        const titleLower = post.title.toLowerCase();
        for (const kw of keywords) {
          if (titleLower.includes(kw.toLowerCase())) {
            tags.push(kw);
          }
        }
        if (tags.length === 0) {
          tags.push("Geral");
        }
        await run("UPDATE posts SET tags = ? WHERE id = ?", [tags.join(", "), post.id]);
      }
    }
  } catch (e) {
    console.error("Error auto-tagging existing posts:", e);
  }
}
async function incrementUserInterest(userId, type, name, points) {
  if (!userId || !name) return;
  const normalizedName = name.trim();
  try {
    const existing = await queryOne("SELECT score FROM user_interests WHERE user_id = ? AND interest_type = ? AND name = ?", [userId, type, normalizedName]);
    if (existing) {
      const newScore = (existing.score || 0) + points;
      await run("UPDATE user_interests SET score = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND interest_type = ? AND name = ?", [newScore, userId, type, normalizedName]);
    } else {
      await run("INSERT INTO user_interests (user_id, interest_type, name, score) VALUES (?, ?, ?, ?)", [userId, type, normalizedName, points]);
    }
  } catch (e) {
    console.error("Error in incrementUserInterest:", e);
  }
}
async function getUserInterests(userId) {
  const result = { categories: {}, tags: {} };
  if (!userId) return result;
  try {
    const rows = await query("SELECT interest_type, name, score FROM user_interests WHERE user_id = ?", [userId]);
    for (const row of rows) {
      if (row.interest_type === "category") {
        result.categories[row.name] = row.score || 0;
      } else if (row.interest_type === "tag") {
        result.tags[row.name] = row.score || 0;
      }
    }
  } catch (e) {
    console.error("Error in getUserInterests:", e);
  }
  return result;
}
async function mergeAnonymousInterests(userId, anonymousInterestsJson) {
  if (!userId || !anonymousInterestsJson) return;
  try {
    const parsed = JSON.parse(anonymousInterestsJson);
    const categories = parsed.categories || {};
    const tags = parsed.tags || {};
    for (const [name, score] of Object.entries(categories)) {
      if (typeof score === "number" && score > 0) {
        await incrementUserInterest(userId, "category", name, score);
      }
    }
    for (const [name, score] of Object.entries(tags)) {
      if (typeof score === "number" && score > 0) {
        await incrementUserInterest(userId, "tag", name, score);
      }
    }
  } catch (e) {
    console.error("Error merging anonymous interests:", e);
  }
}
async function upsertUserSeenPost(userId, postId, seenAtMs = Date.now()) {
  if (!userId || !postId) return;
  try {
    const existing = await queryOne(
      "SELECT seen_at FROM user_seen_posts WHERE user_id = ? AND post_id = ?",
      [userId, postId]
    );
    if (existing) {
      await run(
        "UPDATE user_seen_posts SET seen_at = ? WHERE user_id = ? AND post_id = ?",
        [seenAtMs, userId, postId]
      );
    } else {
      await run(
        "INSERT INTO user_seen_posts (user_id, post_id, seen_at) VALUES (?, ?, ?)",
        [userId, postId, seenAtMs]
      );
    }
  } catch (e) {
    console.error("Error in upsertUserSeenPost:", e);
  }
}
async function getUserSeenPosts(userId, cooldownMs) {
  const map = /* @__PURE__ */ new Map();
  if (!userId) return map;
  const since = Date.now() - cooldownMs;
  try {
    const rows = await query(
      "SELECT post_id, seen_at FROM user_seen_posts WHERE user_id = ? AND seen_at >= ?",
      [userId, since]
    );
    for (const row of rows) {
      map.set(Number(row.post_id), Number(row.seen_at));
    }
    const pruneBefore = Date.now() - cooldownMs * 2;
    await run("DELETE FROM user_seen_posts WHERE user_id = ? AND seen_at < ?", [userId, pruneBefore]);
  } catch (e) {
    console.error("Error in getUserSeenPosts:", e);
  }
  return map;
}
async function mergeAnonymousSeenPosts(userId, seenMap) {
  if (!userId) return;
  try {
    const entries = seenMap instanceof Map ? Array.from(seenMap.entries()) : Object.entries(seenMap).map(([k, v]) => [Number(k), Number(v)]);
    for (const [postId, seenAt] of entries) {
      if (!postId || !seenAt) continue;
      const existing = await queryOne(
        "SELECT seen_at FROM user_seen_posts WHERE user_id = ? AND post_id = ?",
        [userId, postId]
      );
      if (!existing || Number(existing.seen_at) < seenAt) {
        await upsertUserSeenPost(userId, postId, seenAt);
      }
    }
  } catch (e) {
    console.error("Error merging anonymous seen posts:", e);
  }
}
async function incrementCollaborativeRelation(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return;
  try {
    const existing = await queryOne("SELECT score FROM collaborative_recommendations WHERE from_post_id = ? AND to_post_id = ?", [fromId, toId]);
    if (existing) {
      const newScore = (existing.score || 0) + 1;
      await run("UPDATE collaborative_recommendations SET score = ? WHERE from_post_id = ? AND to_post_id = ?", [newScore, fromId, toId]);
    } else {
      await run("INSERT INTO collaborative_recommendations (from_post_id, to_post_id, score) VALUES (?, ?, 1)", [fromId, toId]);
    }
  } catch (e) {
    console.error("Error in incrementCollaborativeRelation:", e);
  }
}
async function getCollaborativeRecommendations(postId, limit = 3) {
  if (!postId) return [];
  try {
    const sql = `
      SELECT p.*, GROUP_CONCAT(c.name) as categories
      FROM collaborative_recommendations cr
      JOIN posts p ON cr.to_post_id = p.id
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE cr.from_post_id = ? AND p.published = 1
      GROUP BY p.id
      ORDER BY cr.score DESC
      LIMIT ?`;
    const posts = await query(sql, [postId, limit]);
    return posts.map((p) => ({ ...p, isCollaborative: true }));
  } catch (e) {
    console.error("Error in getCollaborativeRecommendations:", e);
    return [];
  }
}
async function createProductReview(review) {
  return run(
    "INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
    [
      review.productId,
      review.userId,
      review.rating,
      review.comment || null
    ]
  );
}
async function getProductReviews(productId) {
  return query(
    `SELECT r.*, u.username, u.name as user_name
     FROM product_reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [productId]
  );
}
async function getProductReviewSummary(productId) {
  const row = await queryOne(
    `SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as total_count
     FROM product_reviews
     WHERE product_id = ?`,
    [productId]
  );
  return {
    averageRating: parseFloat(row?.average_rating ? row.average_rating.toFixed(1) : "0"),
    totalCount: row?.total_count || 0
  };
}
async function hasUserReviewedProduct(userId, productId) {
  const row = await queryOne(
    "SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ? LIMIT 1",
    [userId, productId]
  );
  return !!row;
}
async function getAllLandingPages() {
  const rows = await query("SELECT * FROM landing_pages ORDER BY created_at DESC");
  return rows || [];
}
async function getLandingPagesPage({ page = 1, limit = 25, search = "" } = {}) {
  const offset = (page - 1) * limit;
  const term = `%${search}%`;
  const where = search ? "WHERE title LIKE ? OR slug LIKE ?" : "";
  const params = search ? [term, term] : [];
  const totalRow = await queryOne(`SELECT COUNT(*) AS count FROM landing_pages ${where}`, params);
  const pages = await query(
    `SELECT * FROM landing_pages ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const total = Number(totalRow?.count || 0);
  return { pages, page, limit, total, totalPages: Math.ceil(total / limit) };
}
async function getLandingBuilderPosts() {
  return await query(
    `SELECT id, title, slug, excerpt, cover_image, created_at
     FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 100`
  );
}
async function getLandingPageById(id) {
  return await queryOne("SELECT * FROM landing_pages WHERE id = ?", [id]);
}
async function getLandingPageBySlug(slug) {
  return await queryOne("SELECT * FROM landing_pages WHERE slug = ?", [slug]);
}
async function createLandingPage(title, slug) {
  const result = await run(
    "INSERT INTO landing_pages (title, slug, status, content, settings) VALUES (?, ?, ?, ?, ?)",
    [title.trim(), slug.trim(), "draft", "[]", "{}"]
  );
  if (result && result.lastInsertRowid !== void 0) {
    return Number(result.lastInsertRowid);
  }
  const lastIdRow = await queryOne("SELECT last_insert_rowid() AS id");
  if (lastIdRow && lastIdRow.id !== void 0) {
    return Number(lastIdRow.id);
  }
  throw new Error("Não foi possível obter o ID gerado para a landing page.");
}
async function updateLandingPage(id, title, slug, status, content, settings) {
  if (content !== void 0 && settings !== void 0) {
    await run(
      "UPDATE landing_pages SET title = ?, slug = ?, status = ?, content = ?, settings = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [title.trim(), slug.trim(), status, content, settings, id]
    );
  } else {
    await run(
      "UPDATE landing_pages SET title = ?, slug = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [title.trim(), slug.trim(), status, id]
    );
  }
}
async function deleteLandingPage(id) {
  await run("DELETE FROM landing_pages WHERE id = ?", [id]);
}
async function duplicateLandingPage(id) {
  const source = await getLandingPageById(id);
  if (!source) {
    throw new Error("Landing page not found");
  }
  const baseSlug = `${source.slug}-copy`.substring(0, 50);
  let slug = baseSlug;
  let n = 2;
  while (await getLandingPageBySlug(slug)) {
    slug = `${baseSlug}-${n}`.substring(0, 60);
    n++;
  }
  const title = `${source.title} (copy)`;
  const result = await run(
    "INSERT INTO landing_pages (title, slug, status, content, settings) VALUES (?, ?, ?, ?, ?)",
    [title, slug, "draft", source.content || "[]", source.settings || "{}"]
  );
  if (result && result.lastInsertRowid !== void 0) {
    return Number(result.lastInsertRowid);
  }
  const lastIdRow = await queryOne("SELECT last_insert_rowid() AS id");
  if (lastIdRow && lastIdRow.id !== void 0) {
    return Number(lastIdRow.id);
  }
  throw new Error("Could not get new landing page id");
}
async function getCommunityTopics(tenantId = "default", category, currentUserId) {
  let sql = `
    SELECT 
      t.*,
      u.username as user_email,
      u.role as user_role,
      (SELECT COUNT(*) FROM community_likes l WHERE l.topic_id = t.id) as likes_count,
      (SELECT COUNT(*) FROM community_comments c WHERE c.topic_id = t.id) as comments_count
      ${currentUserId ? `, (SELECT COUNT(*) FROM community_likes cl WHERE cl.topic_id = t.id AND cl.user_id = ${Number(currentUserId)}) > 0 as user_has_liked` : ", 0 as user_has_liked"}
    FROM community_topics t
    JOIN users u ON t.user_id = u.id
    WHERE t.tenant_id = ?
  `;
  const params = [tenantId];
  if (category && category !== "Todos") {
    sql += ` AND t.category = ?`;
    params.push(category);
  }
  sql += ` ORDER BY t.is_pinned DESC, t.created_at DESC`;
  const topics = await query(sql, params);
  return topics.map((t) => ({
    ...t,
    user_has_liked: Boolean(t.user_has_liked),
    is_pinned: Boolean(t.is_pinned)
  }));
}
async function getCommunityTopicById(id, currentUserId) {
  const sql = `
    SELECT 
      t.*,
      u.username as user_email,
      u.role as user_role,
      (SELECT COUNT(*) FROM community_likes l WHERE l.topic_id = t.id) as likes_count,
      (SELECT COUNT(*) FROM community_comments c WHERE c.topic_id = t.id) as comments_count
      ${currentUserId ? `, (SELECT COUNT(*) FROM community_likes cl WHERE cl.topic_id = t.id AND cl.user_id = ${Number(currentUserId)}) > 0 as user_has_liked` : ", 0 as user_has_liked"}
    FROM community_topics t
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
  `;
  const topic = await queryOne(sql, [id]);
  if (!topic) return null;
  return {
    ...topic,
    user_has_liked: Boolean(topic.user_has_liked),
    is_pinned: Boolean(topic.is_pinned)
  };
}
async function createCommunityTopic(data) {
  const tenantId = data.tenantId || "default";
  const category = data.category || "Geral";
  const isPinned = data.isPinned ? 1 : 0;
  const result = await run(
    `INSERT INTO community_topics (tenant_id, user_id, title, content, category, is_pinned) VALUES (?, ?, ?, ?, ?, ?)`,
    [tenantId, data.userId, data.title, data.content, category, isPinned]
  );
  return result?.lastInsertRowid ? Number(result.lastInsertRowid) : null;
}
async function deleteCommunityTopic(id) {
  await run(`DELETE FROM community_topics WHERE id = ?`, [id]);
}
async function togglePinCommunityTopic(id, isPinned) {
  await run(`UPDATE community_topics SET is_pinned = ? WHERE id = ?`, [isPinned ? 1 : 0, id]);
}
async function getCommunityComments(topicId) {
  const sql = `
    SELECT 
      c.*,
      u.username as user_email,
      u.role as user_role
    FROM community_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.topic_id = ?
    ORDER BY c.created_at ASC
  `;
  return await query(sql, [topicId]);
}
async function createCommunityComment(data) {
  const result = await run(
    `INSERT INTO community_comments (topic_id, user_id, content) VALUES (?, ?, ?)`,
    [data.topicId, data.userId, data.content]
  );
  await run(
    `UPDATE community_topics SET comments_count = (SELECT COUNT(*) FROM community_comments WHERE topic_id = ?) WHERE id = ?`,
    [data.topicId, data.topicId]
  );
  return result?.lastInsertRowid ? Number(result.lastInsertRowid) : null;
}
async function deleteCommunityComment(commentId, topicId) {
  await run(`DELETE FROM community_comments WHERE id = ?`, [commentId]);
  await run(
    `UPDATE community_topics SET comments_count = (SELECT COUNT(*) FROM community_comments WHERE topic_id = ?) WHERE id = ?`,
    [topicId, topicId]
  );
}
async function toggleCommunityLike(topicId, userId) {
  const existing = await queryOne(
    `SELECT id FROM community_likes WHERE topic_id = ? AND user_id = ?`,
    [topicId, userId]
  );
  if (existing) {
    await run(`DELETE FROM community_likes WHERE topic_id = ? AND user_id = ?`, [topicId, userId]);
  } else {
    await run(`INSERT OR IGNORE INTO community_likes (topic_id, user_id) VALUES (?, ?)`, [topicId, userId]);
  }
  await run(
    `UPDATE community_topics SET likes_count = (SELECT COUNT(*) FROM community_likes WHERE topic_id = ?) WHERE id = ?`,
    [topicId, topicId]
  );
  return !existing;
}
async function getCommunityStats() {
  const totalTopics = await queryOne(`SELECT COUNT(*) as count FROM community_topics`);
  const totalComments = await queryOne(`SELECT COUNT(*) as count FROM community_comments`);
  const totalLikes = await queryOne(`SELECT COUNT(*) as count FROM community_likes`);
  return {
    totalTopics: Number(totalTopics?.count || 0),
    totalComments: Number(totalComments?.count || 0),
    totalLikes: Number(totalLikes?.count || 0)
  };
}

export { assignCategoriesToPost, assignProductsToPost, autoTagExistingPosts, clearExpiredDBSessions, countPosts, createAd, createCategory, createCommunityComment, createCommunityTopic, createCourse, createCoursePurchase, createDBSession, createLandingPage, createLesson, createMaterial, createNewsletterCampaign, createOtp, createPayment, createPost, createPremiumPlan, createProduct, createProductCategory, createProductPurchase, createProductReview, createShortlink, createSubscription, createUser, createWebStory, deleteAd, deleteCategory, deleteCommunityComment, deleteCommunityTopic, deleteCourse, deleteDBSession, deleteLandingPage, deleteLesson, deleteMaterial, deleteNewsletterSubscriber, deletePost, deletePremiumPlan, deleteProduct, deleteProductCategory, deleteShortlink, deleteUser, deleteWebStory, duplicateLandingPage, generateUniqueCourseSlug, generateUniqueProductSlug, generateUniqueSlug, generateWebStorySlug, getActiveAdsByPlacement, getActiveNewsletterEmails, getAdById, getAllAds, getAllCategories, getAllCategoriesAdmin, getAllCourses, getAllLandingPages, getAllPosts, getAllPostsAdmin, getAllPremiumPlans, getAllProducts, getAllShortlinks, getAllUsersByRole, getAllWebStories, getAnalyticsSummary, getCLIToken, getCLITokenStatus, getCategoriesByPostId, getCategoryBySlug, getCollaborativeRecommendations, getCommunityComments, getCommunityStats, getCommunityTopicById, getCommunityTopics, getCourseById, getCourseBySlug, getCoursePurchase, getDBSession, getExistingCategoryIds, getIndexedShortlinks, getLandingBuilderPosts, getLandingPageById, getLandingPageBySlug, getLandingPagesPage, getLessonById, getLessonsByCourseId, getMaterialsByCourseId, getNewsletterCampaigns, getNewsletterSubscribers, getPaginatedShortlinks, getPaymentByAsaasId, getPaymentByStripeId, getPaymentsBySubscription, getPinterestEnabledCategories, getPostById, getPostBySlug, getPostsAdminPage, getPostsForPinterest, getPostsForPinterestByCategory, getPremiumPlanById, getPremiumPlanBySlug, getProductBuyerEmails, getProductById, getProductBySlug, getProductCategories, getProductPurchaseForUser, getProductReviewSummary, getProductReviews, getProductsByPostId, getPublishedFeedCandidates, getPublishedWebStories, getRelatedPosts, getRelatedProducts, getSalesHistory, getSalesSummary, getSettings, getShortlinkById, getShortlinkBySlug, getShortlinksCount, getSubscriptionByAsaasId, getSubscriptionById, getSubscriptionByStripeId, getUserByUsername, getUserCoursePurchases, getUserInterests, getUserSeenPosts, getUserSubscription, getUsersHoldings, getWebStoryById, getWebStoryBySlug, getWebStorySlides, grantPremiumAccessManual, hasUserPurchasedCourse, hasUserPurchasedProduct, hasUserReviewedProduct, incrementCollaborativeRelation, incrementShortlinkClicks, incrementUserInterest, initDatabase, isUserPremium, markManualDelivered, mergeAnonymousInterests, mergeAnonymousSeenPosts, productSlugExists, query, queryOne, recordPageView, recordProductDownload, regenerateCLIToken, replaceWebStorySlides, revokePremiumAccessManual, run, runBatch, searchPosts, slugExists, subscribeToNewsletter, toggleCommunityLike, togglePinCommunityTopic, updateAd, updateCategory, updateCourse, updateCoursePurchaseByAsaasId, updateLandingPage, updateLesson, updatePost, updatePremiumPlan, updateProduct, updateProductCategory, updateSetting, updateShortlink, updateSubscription, updateSubscriptionByAsaasId, updateSubscriptionByStripeId, updateUserPassword, updateWebStory, upsertUserSeenPost, validateCLIToken, verifyOtpCode };
//# sourceMappingURL=database-GQg0oTqt.js.map
