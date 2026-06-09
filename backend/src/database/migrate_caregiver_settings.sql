USE familycare_db;

ALTER TABLE caregivers
    ADD COLUMN notif_messages          BOOLEAN      DEFAULT TRUE,
    ADD COLUMN notif_health            BOOLEAN      DEFAULT TRUE,
    ADD COLUMN notif_visits            BOOLEAN      DEFAULT FALSE,
    ADD COLUMN schedule_weekday_start  VARCHAR(10)  DEFAULT '08:00',
    ADD COLUMN schedule_weekday_end    VARCHAR(10)  DEFAULT '17:30',
    ADD COLUMN schedule_weekday_active BOOLEAN      DEFAULT TRUE,
    ADD COLUMN schedule_sat_start      VARCHAR(10)  DEFAULT '10:00',
    ADD COLUMN schedule_sat_end        VARCHAR(10)  DEFAULT '14:00',
    ADD COLUMN schedule_sat_active     BOOLEAN      DEFAULT TRUE,
    ADD COLUMN schedule_sun_active     BOOLEAN      DEFAULT FALSE;