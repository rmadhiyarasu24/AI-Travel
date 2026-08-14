import os
import psycopg2

DB_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:%40713324AD055@db.byxamnetuserezhcmrlr.supabase.co:5432/postgres"
)

def run_migration():
    print("Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    base_dir = os.path.dirname(__file__)
    schema_path = os.path.join(base_dir, "schema.sql")
    seed_path = os.path.join(base_dir, "seed.sql")

    print(f"Executing Schema DDL from {schema_path}...")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()
        cursor.execute(schema_sql)
    print("Schema created successfully!")

    print(f"Executing Seed Data from {seed_path}...")
    with open(seed_path, "r", encoding="utf-8") as f:
        seed_sql = f.read()
        cursor.execute(seed_sql)
    print("Seed data populated successfully!")

    # Verify created tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = [row[0] for row in cursor.fetchall()]
    print(f"Total Tables in Supabase Database ({len(tables)}):")
    for t in tables:
        print(f"  - {t}")

    cursor.close()
    conn.close()
    print("Database migration completed successfully!")

if __name__ == "__main__":
    run_migration()
