import * as pg from "pg";

export class Db {
    private db;

    async getDb(): Promise<pg.Client> {
        if (this.db === null || this.db === undefined) {
            const client = new pg.Client({
                host: "localhost",
                user: "postgres",
                password: "postgres",
                database: "rcgy"
            });
            this.db = client;
            return client;
        }
        return this.db;
    }
}