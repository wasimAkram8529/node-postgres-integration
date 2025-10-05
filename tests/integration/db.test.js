const { Client } = require('pg');

describe('Postgres Integration Test', () => {
  let client;

  beforeAll(async () => {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  test('should connect and return current timestamp', async () => {
    const res = await client.query('SELECT NOW()');
    expect(res.rowCount).toBe(1);
    console.log('Current time from DB:', res.rows[0].now);
  });

  test('should create and query a test table', async () => {
    await client.query('CREATE TABLE IF NOT EXISTS test_table(id SERIAL PRIMARY KEY, name TEXT)');
    await client.query('INSERT INTO test_table(name) VALUES ($1)', ['hello']);
    const res = await client.query('SELECT * FROM test_table WHERE name = $1', ['hello']);
    expect(res.rows.length).toBeGreaterThan(0);
    expect(res.rows[0].name).toBe('hello');
  });
});
