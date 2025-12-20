import knex from "knex"

const testConnection = async () => {
    const db = knex({
        client: "pg",
        connection:{
            host:process.env.DB_HOST || "localhost",
            port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            user:process.env.DB_USER || "postgres",
            password:process.env.DB_PASSWORD || "postgres",
            database:process.env.DB_NAME || "chat-buddy",
            ssl: process.env.DB_SSL? true : false,
        }
    });

    try {
        const testRes = await db.raw("SELECT 1+1 AS result");
        console.log("Database connection successful",testRes);
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    } finally {
        await db.destroy();
    }       
}

testConnection().catch(err => {console.error(err); throw err; });  