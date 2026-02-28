import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1740700000000 implements MigrationInterface {
  name = 'InitSchema1740700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgcrypto for UUID generation helpers.
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Create enum type for visited display mode if it does not exist.
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visited_display_mode') THEN
          CREATE TYPE visited_display_mode AS ENUM ('gray', 'hidden');
        END IF;
      END$$;
    `);

    // Create trips table owned by auth user.
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title text NOT NULL,
        start_date date NOT NULL,
        end_date date NOT NULL,
        base_location text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz
      )
    `);

    // Create user preference table with one-to-one user mapping.
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
        visited_display_mode visited_display_mode NOT NULL DEFAULT 'gray',
        radius_preset integer NOT NULL DEFAULT 100 CHECK (radius_preset in (100, 200, 300, 500, 1000)),
        auto_sync_enabled boolean NOT NULL DEFAULT true,
        auto_sync_interval_min integer NOT NULL DEFAULT 30,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz
      )
    `);

    // Add index for fast user-based trip lookup.
    await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips (user_id)');

    // Create common trigger function to update updated_at automatically.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.set_updated_at()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$;
    `);

    // Recreate update trigger for trips table.
    await queryRunner.query('DROP TRIGGER IF EXISTS set_updated_at_trips ON public.trips');
    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_trips
      BEFORE UPDATE ON public.trips
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at()
    `);

    // Recreate update trigger for user_preferences table.
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS set_updated_at_user_preferences ON public.user_preferences'
    );
    await queryRunner.query(`
      CREATE TRIGGER set_updated_at_user_preferences
      BEFORE UPDATE ON public.user_preferences
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at()
    `);

    // Enable row-level security on application tables.
    await queryRunner.query('ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY');
    await queryRunner.query('ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY');

    // Recreate policy so users can manage only their own trips.
    await queryRunner.query('DROP POLICY IF EXISTS "users_manage_own_trips" ON public.trips');
    await queryRunner.query(`
      CREATE POLICY "users_manage_own_trips"
      ON public.trips
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)
    `);

    // Recreate policy so users can manage only their own preferences.
    await queryRunner.query(
      'DROP POLICY IF EXISTS "users_manage_own_preferences" ON public.user_preferences'
    );
    await queryRunner.query(`
      CREATE POLICY "users_manage_own_preferences"
      ON public.user_preferences
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop policies first because they depend on target tables.
    await queryRunner.query(
      'DROP POLICY IF EXISTS "users_manage_own_preferences" ON public.user_preferences'
    );
    await queryRunner.query('DROP POLICY IF EXISTS "users_manage_own_trips" ON public.trips');

    // Drop update triggers before dropping the trigger function.
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS set_updated_at_user_preferences ON public.user_preferences'
    );
    await queryRunner.query('DROP TRIGGER IF EXISTS set_updated_at_trips ON public.trips');

    // Drop shared trigger function.
    await queryRunner.query('DROP FUNCTION IF EXISTS public.set_updated_at');

    // Drop index and tables in dependency-safe order.
    await queryRunner.query('DROP INDEX IF EXISTS idx_trips_user_id');
    await queryRunner.query('DROP TABLE IF EXISTS user_preferences');
    await queryRunner.query('DROP TABLE IF EXISTS trips');

    // Drop enum type last.
    await queryRunner.query('DROP TYPE IF EXISTS visited_display_mode');
  }
}
