-- Admin role. Set isAdmin = true for admins by hand after deploy.
ALTER TABLE "users" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Balanced event values (Season 17). Starting balance is 100.
INSERT INTO "event_types" ("description", "value") VALUES
  ('Star Baker', 8),
  ('Handshake', 8),
  ('Small Triumph', 4),
  ('1st in Technical', 4),
  ('2nd in Technical', 2),
  ('2nd to Last in Technical', -2),
  ('Last in Technical', -4),
  ('Sent Home', -6),
  ('Collapse', -3),
  ('Raw', -2),
  ('Burnt', -2),
  ('Restart', -2),
  ('Table Touch', -1),
  ('Floor Drop', -5),
  ('Ungraceful Exit', -8)
ON CONFLICT ("description") DO UPDATE SET "value" = EXCLUDED."value";
