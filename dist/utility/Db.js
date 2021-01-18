"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const pg = require("pg");
class Db {
    async getDb() {
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
exports.Db = Db;
//# sourceMappingURL=Db.js.map