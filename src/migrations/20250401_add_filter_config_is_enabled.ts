import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "filter_configs"
    ADD COLUMN IF NOT EXISTS "is_enabled" boolean NOT NULL DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "filter_configs"
    DROP COLUMN IF EXISTS "is_enabled";
  `)
}
