import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config({ path: '../../.env' });

const sql = postgres(process.env.DATABASE_URL);

async function test() {
    try {
        const result = await sql`SELECT 1 as test`;
        console.log('✅ Database connection successful!', result);
        await sql.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

test();
