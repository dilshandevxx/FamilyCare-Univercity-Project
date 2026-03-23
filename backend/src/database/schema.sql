-- ============================================================
-- FamilyCare Database Schema
-- Run: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS familycare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE familycare_db;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150)  NOT NULL,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  password     VARCHAR(255)  NOT NULL,
  role         ENUM('child', 'caregiver', 'admin') NOT NULL DEFAULT 'child',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Parents (elderly person profiles) ────────────────────────
CREATE TABLE IF NOT EXISTS parents (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  child_id     INT NOT NULL,
  name         VARCHAR(150) NOT NULL,
  age          INT,
  medical_conditions TEXT,
  address      VARCHAR(255),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Caregivers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS caregivers (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  user_id            INT,                          -- links to users table if caregiver has an account
  name               VARCHAR(150) NOT NULL,
  specialization     VARCHAR(100),
  experience_years   INT DEFAULT 0,
  hourly_rate        DECIMAL(8, 2) DEFAULT 0.00,
  bio                TEXT,
  is_available       BOOLEAN DEFAULT TRUE,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Appointments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  child_id          INT NOT NULL,
  parent_id         INT NOT NULL,
  caregiver_id      INT NOT NULL,
  appointment_date  DATETIME NOT NULL,
  status            ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (parent_id)    REFERENCES parents(id)    ON DELETE CASCADE,
  FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE
);

-- ── Health Logs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_logs (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  parent_id      INT NOT NULL,
  blood_pressure VARCHAR(20),
  heart_rate     INT,
  temperature    DECIMAL(4, 1),
  notes          TEXT,
  logged_by      INT,                              -- caregiver user id
  logged_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id)  REFERENCES parents(id)  ON DELETE CASCADE,
  FOREIGN KEY (logged_by)  REFERENCES users(id)    ON DELETE SET NULL
);

-- ── Daily Activity Logs ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  parent_id    INT NOT NULL,
  activity     VARCHAR(255) NOT NULL,
  description  TEXT,
  logged_by    INT,
  logged_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES parents(id)  ON DELETE CASCADE,
  FOREIGN KEY (logged_by) REFERENCES users(id)    ON DELETE SET NULL
);
