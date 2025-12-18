import { getDb } from "./client"
export const migrateToLatest = async (directory?: string):Promise<{batch: number, log: string[]}> => {
    try {
        const db = getDb();
    if (!db) {
        throw new Error("Database connection not established");
    }
        const [batch,log] = await db.migrate.latest({
            directory: directory 
        });
        return {batch,log};
    } catch (error) {
        console.error("Error applying migrations:", error);
        throw error;
    }
}

export const rollback = async (directory?: string):Promise<{batch: number, log: string[]}> => {
    try {
        const db = getDb();
        if (!db) {
            throw new Error("Database connection not established");
        }
        const [batch,log] = await db.migrate.rollback({
            directory: directory
        });
        return {batch,log};
    } catch (error) {
        console.error("Error rolling back migrations:", error);
        throw error;
    }
}

export const runSeeds = async (directory?: string):Promise<void> => {
    try {
        const db = getDb();
        if (!db) {
            throw new Error("Database connection not established");
        }
        await db.seed.run({
            directory: directory
        });
    } catch (error) {
        console.error("Error running seeds:", error);
        throw error;
    }
}   