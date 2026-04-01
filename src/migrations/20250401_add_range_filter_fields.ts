import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ─── Добавляем поля для range-фильтров ──────────────────────────────────
  // Добавляем новые колонки к таблице filter_configs_filters

  await db.execute(sql`
    ALTER TABLE filter_configs_filters
    ADD COLUMN IF NOT EXISTS range_min INTEGER DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS range_max INTEGER DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS range_step INTEGER DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS range_unit TEXT DEFAULT NULL;
  `)

  await payload.logger.info(
    "Migration UP: range filter fields (range_min, range_max, range_step, range_unit) added to filter_configs_filters."
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // ─── Удаляем поля для range-фильтров ────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE filter_configs_filters
    DROP COLUMN IF EXISTS range_min,
    DROP COLUMN IF EXISTS range_max,
    DROP COLUMN IF EXISTS range_step,
    DROP COLUMN IF EXISTS range_unit;
  `)

  await payload.logger.info(
    "Migration DOWN: range filter fields removed from filter_configs_filters."
  )
}
