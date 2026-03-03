import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ─── 1. Таблица filter_configs ────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS filter_configs (
      id          SERIAL PRIMARY KEY,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      updated_at  TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW(),
      created_at  TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `)

  // Один конфиг на одну категорию (уникальность)
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS filter_configs_category_id_idx
      ON filter_configs (category_id);
  `)

  // ─── 2. Таблица filter_configs_filters (массив фильтров) ─────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS filter_configs_filters (
      id                SERIAL PRIMARY KEY,
      _parent_id        INTEGER NOT NULL REFERENCES filter_configs(id) ON DELETE CASCADE,
      _order            INTEGER NOT NULL DEFAULT 0,
      key               TEXT    NOT NULL,
      label             TEXT    NOT NULL,
      type              TEXT    NOT NULL DEFAULT 'checkbox',
      is_advanced       BOOLEAN NOT NULL DEFAULT FALSE
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS filter_configs_filters_parent_idx
      ON filter_configs_filters (_parent_id);
  `)

  // ─── 3. Таблица filter_configs_filters_options (массив вариантов) ─────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS filter_configs_filters_options (
      id         SERIAL PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES filter_configs_filters(id) ON DELETE CASCADE,
      _order     INTEGER NOT NULL DEFAULT 0,
      value      TEXT NOT NULL,
      label      TEXT NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS filter_configs_filters_options_parent_idx
      ON filter_configs_filters_options (_parent_id);
  `)

  // ─── 4. Поле filter_values у products ────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products_filter_values (
      id         SERIAL PRIMARY KEY,
      _parent_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      _order     INTEGER NOT NULL DEFAULT 0,
      key        TEXT NOT NULL,
      value      TEXT NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS products_filter_values_parent_idx
      ON products_filter_values (_parent_id);
  `)

  await payload.logger.info("Migration UP: filter_configs, filter_configs_filters, filter_configs_filters_options, products_filter_values — created.")
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS products_filter_values CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS filter_configs_filters_options CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS filter_configs_filters CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS filter_configs CASCADE;`)

  await payload.logger.info("Migration DOWN: all filter tables removed.")
}
