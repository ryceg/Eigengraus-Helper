"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(name, description, usage, category, run) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.category = category;
        this.run = run;
    }
    /**
     * Getter $name
     * @return {string}
     */
    get $name() {
        return this.name;
    }
    /**
     * Getter $description
     * @return {string}
     */
    get $description() {
        return this.description;
    }
    /**
     * Getter $usage
     * @return {string}
     */
    get $usage() {
        return this.usage;
    }
    /**
     * Getter $usage
     * @return {string}
     */
    get $category() {
        return this.category;
    }
    /**
     * Getter $run
     * @return {() => void}
     */
    get $run() {
        return this.run;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map