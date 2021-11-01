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
exports.TestcontainersEnvironment = exports.setGlobalsWithJsonString = void 0;
const fs_1 = require("fs");
const jest_environment_node_1 = __importDefault(require("jest-environment-node"));
const path_1 = require("path");
const GLOBAL_VARS_JSON_PATH = path_1.join(__dirname, "global.vars.json");
function setGlobalsWithJsonString(globals, jsonString) {
    const globalVars = JSON.parse(jsonString);
    const globalVarKeys = Object.keys(globalVars);
    globalVarKeys.forEach(globalVarKey => {
        globals[globalVarKey] = globalVars[globalVarKey];
    });
}
exports.setGlobalsWithJsonString = setGlobalsWithJsonString;
class TestcontainersEnvironment extends jest_environment_node_1.default {
    constructor(config) {
        super(config);
    }
    setup() {
        const _super = Object.create(null, {
            setup: { get: () => super.setup }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const globalVarsJsonString = fs_1.readFileSync(GLOBAL_VARS_JSON_PATH, "utf-8");
            setGlobalsWithJsonString(this.global, globalVarsJsonString);
            yield _super.setup.call(this);
        });
    }
    teardown() {
        const _super = Object.create(null, {
            teardown: { get: () => super.teardown }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.teardown.call(this);
        });
    }
    runScript(script) {
        return super.runScript(script);
    }
}
exports.TestcontainersEnvironment = TestcontainersEnvironment;
exports.default = TestcontainersEnvironment;
