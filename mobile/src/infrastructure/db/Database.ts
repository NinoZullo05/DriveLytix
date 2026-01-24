import * as SQLite from 'expo-sqlite';

export class Database {
    private static instance: Database;
    private db: SQLite.SQLiteDatabase | null = null;

    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async init(): Promise<void> {
        if (this.db) return;

        try {
            this.db = await SQLite.openDatabaseAsync('drivelytix.db');
            await this.migrate();
        } catch (e) {
            console.error("Failed to open database", e);
        }
    }

    private async migrate() {
        if (!this.db) return;

        // Simple migration strategy for now
        await this.db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY NOT NULL,
                startTime INTEGER NOT NULL,
                endTime INTEGER,
                vehicleId TEXT
            );
            CREATE TABLE IF NOT EXISTS dtc_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL,
                status TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                sessionId TEXT,
                FOREIGN KEY(sessionId) REFERENCES sessions(id)
            );
        `);
    }

    public getDB(): SQLite.SQLiteDatabase {
        if (!this.db) {
            throw new Error("Database not initialized. Call init() first.");
        }
        return this.db;
    }
}

export const database = Database.getInstance();
