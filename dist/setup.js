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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
const containers_1 = require("./containers");
const GLOBAL_VARS_JSON_PATH = path_1.join(__dirname, "global.vars.json");
const createEnv = (name, key) => `__TESTCONTAINERS_${name.toUpperCase()}_${key.toUpperCase()}__`;
function createGlobalVariablesFromMetaInfos(metaInfos) {
    const containerKeys = Object.keys(metaInfos);
    return containerKeys.reduce((acc, containerKey, idx) => {
        const { ip, name, portMappings } = metaInfos[containerKey];
        acc[createEnv(containerKey, "IP")] = ip;
        acc[createEnv(containerKey, "NAME")] = name;
        for (const [originalPort, boundPort] of portMappings.entries()) {
            acc[createEnv(containerKey, `PORT_${originalPort}`)] = boundPort;
        }
        return acc;
    }, {});
}
function setup(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.JEST_TESTCONTAINERS_RESTART_ON_WATCH &&
            (opts.watch || opts.watchAll) &&
            global.__TESTCONTAINERS__) {
            return;
        }
        const jestTestcontainersConfig = config_1.default();
        const allStartedContainersMetaInfo = yield containers_1.startAllContainers(jestTestcontainersConfig);
        const globalEnv = createGlobalVariablesFromMetaInfos(allStartedContainersMetaInfo);
        fs_1.writeFileSync(GLOBAL_VARS_JSON_PATH, JSON.stringify(globalEnv), "utf-8");
        global.__TESTCONTAINERS__ = Object.values(allStartedContainersMetaInfo).map(({ container }) => container);
    });
}
module.exports = setup;
exports.default = setup;
