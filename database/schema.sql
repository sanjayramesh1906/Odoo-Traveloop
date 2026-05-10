-- =============================================================================
-- Traveloop — MySQL DDL Schema
-- Dependency order: independent tables first, dependent tables after.
-- Primary keys  : BIGINT AUTO_INCREMENT on every table.
-- Timestamps    : created_at / updated_at on every table with automatic defaults.
-- Cascades      : ON DELETE CASCADE for non-nullable FKs,
--                 ON DELETE SET NULL  for nullable FKs.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Database bootstrap
-- ---------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS traveloop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE traveloop;

-- ---------------------------------------------------------------------------
-- 1. users  (no FKs — always first)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                   BIGINT          NOT NULL AUTO_INCREMENT,
  name                 VARCHAR(255)    NOT NULL,
  email                VARCHAR(255)    NOT NULL,
  hashed_password      VARCHAR(255)    NOT NULL,
  photo_url            VARCHAR(2048)       NULL,
  language_preference  VARCHAR(10)     NOT NULL DEFAULT 'en',
  created_at           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 2. cities  (global seed table — no FKs)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
  id                BIGINT          NOT NULL AUTO_INCREMENT,
  name              VARCHAR(255)    NOT NULL,
  country           VARCHAR(255)    NOT NULL,
  country_code      CHAR(3)         NOT NULL,          -- ISO 3166-1 alpha-3
  cost_index        DECIMAL(6, 2)   NOT NULL DEFAULT 0.00,
  popularity_score  DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
  created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 3. activities  (global seed table — no FKs)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
  id                BIGINT          NOT NULL AUTO_INCREMENT,
  name              VARCHAR(255)    NOT NULL,
  type              ENUM('sightseeing','food','adventure','wellness','shopping') NOT NULL,
  estimated_cost    DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  duration_minutes  INT             NOT NULL DEFAULT 0,
  description       TEXT                NULL,
  image_url         VARCHAR(2048)       NULL,
  created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 4. trips  (FK → users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
  id               BIGINT          NOT NULL AUTO_INCREMENT,
  owner_id         BIGINT          NOT NULL,
  name             VARCHAR(255)    NOT NULL,
  description      TEXT                NULL,
  start_date       DATE                NULL,
  end_date         DATE                NULL,
  budget           DECIMAL(12, 2)  NOT NULL DEFAULT 0.00,
  cover_photo_url  VARCHAR(2048)       NULL,
  created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_trips_owner
    FOREIGN KEY (owner_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 5. stops  (FK → trips, FK → cities)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stops (
  id              BIGINT    NOT NULL AUTO_INCREMENT,
  trip_id         BIGINT    NOT NULL,
  city_id         BIGINT    NOT NULL,
  arrival_date    DATE          NULL,
  departure_date  DATE          NULL,
  order_index     INT       NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- Enforce itinerary sequence integrity; supports drag-and-drop reordering.
  UNIQUE KEY uq_stops_trip_order (trip_id, order_index),
  CONSTRAINT fk_stops_trip
    FOREIGN KEY (trip_id) REFERENCES trips (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_stops_city
    FOREIGN KEY (city_id) REFERENCES cities (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 6. stop_activities  (join table: stops ↔ activities)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stop_activities (
  id           BIGINT    NOT NULL AUTO_INCREMENT,
  stop_id      BIGINT    NOT NULL,
  activity_id  BIGINT    NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- Prevent duplicate activity assignments on the same stop.
  UNIQUE KEY uq_stop_activities_stop_activity (stop_id, activity_id),
  CONSTRAINT fk_stop_activities_stop
    FOREIGN KEY (stop_id) REFERENCES stops (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_stop_activities_activity
    FOREIGN KEY (activity_id) REFERENCES activities (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 7. budget_items  (FK → trips)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS budget_items (
  id           BIGINT          NOT NULL AUTO_INCREMENT,
  trip_id      BIGINT          NOT NULL,
  category     ENUM('Transport','Stay','Meal','Activity','Miscellaneous') NOT NULL,
  description  VARCHAR(500)        NULL,
  amount       DECIMAL(12, 2)  NOT NULL DEFAULT 0.00,
  date         DATE                NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_budget_items_trip
    FOREIGN KEY (trip_id) REFERENCES trips (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 8. packing_lists  (FK → trips)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS packing_lists (
  id          BIGINT    NOT NULL AUTO_INCREMENT,
  trip_id     BIGINT    NOT NULL,
  item_name   VARCHAR(255) NOT NULL,
  category    ENUM('Clothing','Documents','Electronics','Toiletries','Miscellaneous') NOT NULL,
  is_packed   BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_packing_lists_trip
    FOREIGN KEY (trip_id) REFERENCES trips (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 9. trip_notes  (FK → trips CASCADE, FK → stops SET NULL — stop_id nullable)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_notes (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  trip_id     BIGINT        NOT NULL,
  stop_id     BIGINT            NULL,           -- nullable: note can be trip-global
  title       VARCHAR(255)      NULL,
  content     TEXT          NOT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_trip_notes_trip
    FOREIGN KEY (trip_id) REFERENCES trips (id)
    ON DELETE CASCADE,
  -- Nullable FK → SET NULL so the note is not deleted when the stop is deleted.
  CONSTRAINT fk_trip_notes_stop
    FOREIGN KEY (stop_id) REFERENCES stops (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 10. shared_links  (FK → trips)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shared_links (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  trip_id     BIGINT        NOT NULL,
  token       VARCHAR(128)  NOT NULL,           -- randomly generated, public URL identifier
  expires_at  TIMESTAMP         NULL,           -- NULL = never expires
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_shared_links_token (token),
  CONSTRAINT fk_shared_links_trip
    FOREIGN KEY (trip_id) REFERENCES trips (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 11. trip_members  (FK → trips, FK → users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_members (
  id          BIGINT    NOT NULL AUTO_INCREMENT,
  trip_id     BIGINT    NOT NULL,
  user_id     BIGINT    NOT NULL,
  role        ENUM('owner','collaborator','viewer') NOT NULL DEFAULT 'viewer',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- Prevent duplicate membership rows for the same user on the same trip.
  UNIQUE KEY uq_trip_members_trip_user (trip_id, user_id),
  CONSTRAINT fk_trip_members_trip
    FOREIGN KEY (trip_id) REFERENCES trips (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_trip_members_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- End of schema
-- =============================================================================
