/**
 * push_schema_to_aiven.js
 * Run: node push_schema_to_aiven.js
 * 
 * This script pushes your full schema + migrations to the Aiven cloud MySQL DB.
 * Run from your BACKEND folder: cd backend && node push_schema_to_aiven.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// ── Aiven connection config ──────────────────────────────────────
const AIVEN_CONFIG = {
  host: 'mysql-32b91466-first-project.k.aivencloud.com',
  port: 16548,
  user: 'avnadmin',
  password: process.env.DB_PASSWORD || 'REPLACE_WITH_YOUR_AIVEN_PASSWORD',
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false },
  multipleStatements: true,   // needed to run full SQL files
};

const SQL_FILES = [
  path.join(__dirname, 'src/database/schema.sql'),
  path.join(__dirname, 'src/database/add_resident_fields.sql'),
  path.join(__dirname, 'src/database/add_health_log_fields.sql'),
];

async function run() {
  console.log('\n🚀 Connecting to Aiven MySQL...');
  let conn;
  try {
    conn = await mysql.createConnection(AIVEN_CONFIG);
    console.log('✅ Connected to Aiven successfully!\n');

    // Aiven uses 'defaultdb' — we skip the CREATE/USE DATABASE statements
    // and just run the table definitions directly in defaultdb

    for (const filePath of SQL_FILES) {
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found, skipping: ${filePath}`);
        continue;
      }

      let sql = fs.readFileSync(filePath, 'utf-8');

      // Strip CREATE DATABASE and USE statements — Aiven uses 'defaultdb'
      sql = sql
        .replace(/CREATE DATABASE[^;]+;/gi, '')
        .replace(/USE\s+\w+\s*;/gi, '')
        .trim();

      if (!sql) continue;

      console.log(`📄 Running: ${path.basename(filePath)}`);
      try {
        await conn.query(sql);
        console.log(`   ✅ Done\n`);
      } catch (err) {
        // Ignore "already exists" errors — safe to re-run
        if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ℹ️  Tables/columns already exist — skipping\n`);
        } else {
          console.error(`   ❌ Error in ${path.basename(filePath)}:`, err.message);
        }
      }
    }

    // Also run the index.js migrations inline (column additions)
    console.log('⚙️  Running column migrations (safe for all MySQL versions)...');

    // Helper: check column exists before adding
    async function addColumnIfMissing(table, column, definition) {
      const [rows] = await conn.query(
        `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = 'defaultdb' AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [table, column]
      );
      if (rows[0].cnt === 0) {
        await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
        console.log(`   ✅ Added ${table}.${column}`);
      } else {
        console.log(`   ✔  ${table}.${column} already exists`);
      }
    }

    const colMigrations = [
      ['messages',    'is_read',           "TINYINT(1) DEFAULT 0"],
      ['health_logs', 'breakfast_status',  "ENUM('Completed','Skipped','Pending') DEFAULT 'Pending'"],
      ['health_logs', 'lunch_status',      "ENUM('Completed','Skipped','Pending') DEFAULT 'Pending'"],
      ['health_logs', 'dinner_status',     "ENUM('Completed','Skipped','Pending') DEFAULT 'Pending'"],
      ['health_logs', 'meds_taken',        "TINYINT(1) DEFAULT NULL"],
      ['health_logs', 'meds_notes',        "TEXT DEFAULT NULL"],
      ['health_logs', 'clinical_notes',    "TEXT DEFAULT NULL"],
      ['health_logs', 'mood',              "VARCHAR(50) DEFAULT NULL"],
      ['health_logs', 'overall_condition', "ENUM('STABLE','NEEDS ATTENTION','CRITICAL') DEFAULT 'STABLE'"],
      ['health_logs', 'attachment_url',    "VARCHAR(255) DEFAULT NULL"],
      ['caregivers',  'status',            "ENUM('pending','approved','rejected') DEFAULT 'pending'"],
    ];

    for (const [table, col, def] of colMigrations) {
      try {
        await addColumnIfMissing(table, col, def);
      } catch (err) {
        console.warn(`   ⚠️  ${table}.${col}: ${err.message}`);
      }
    }

    console.log('\n🎉 All done! Your Aiven DB is ready for production.\n');
  } catch (err) {
    console.error('❌ Failed to connect to Aiven:', err.message);
    console.log('\n👉 Make sure you set your DB_PASSWORD environment variable:');
    console.log('   Windows PowerShell:  $env:DB_PASSWORD="your_password"; node push_schema_to_aiven.js');
  } finally {
    if (conn) await conn.end();
  }
}

run();
