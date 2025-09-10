import { Client } from 'pg';

interface PgTableRow {
  tablename: string;
}

export async function resetDatabase(client: Client): Promise<void> {
  try {
    await client.query("SET session_replication_role = 'replica';");

    const result = await client.query<PgTableRow>(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('spatial_ref_sys')
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%';
    `);

    for (const row of result.rows) {
      // Now `row.tablename` is type-safe!
      await client.query(`TRUNCATE TABLE "${row.tablename}" RESTART IDENTITY CASCADE;`);
    }
  } finally {
    await client.query("SET session_replication_role = 'origin';");
  }
}
