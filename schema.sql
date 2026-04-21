CREATE TABLE IF NOT EXISTS rsvps (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  guests     INTEGER NOT NULL DEFAULT 0,
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gifts (
  id         SERIAL PRIMARY KEY,
  url        TEXT NOT NULL,
  price      TEXT,
  title      TEXT,
  image      TEXT,
  quantity   INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
