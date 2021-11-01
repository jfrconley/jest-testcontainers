"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function teardown(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.JEST_TESTCONTAINERS_RESTART_ON_WATCH &&
            (opts.watch || opts.watchAll)) {
            return;
        }
        const allStartedContainers = global
            .__TESTCONTAINERS__;
        yield Promise.all(allStartedContainers.map((container) => container.stop()));
    });
}
module.exports = teardown;
exports.default = teardown;
