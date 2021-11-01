"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = void 0;
const cwd_1 = __importDefault(require("cwd"));
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
class JestTestcontainersConfigError extends Error {
    constructor(msg) {
        super(msg);
        this.name = this.constructor.name;
    }
}
function assertWaitConfig(wait) {
    if (wait === undefined) {
        return;
    }
    if (!["ports", "text"].includes(wait.type)) {
        throw new JestTestcontainersConfigError("wait can be ports or text");
    }
    if (wait && wait.type === "ports" && !Number.isInteger(wait.timeout)) {
        throw new JestTestcontainersConfigError("wait type ports requires timeout field as integer");
    }
    if (wait && wait.type === "text" && !wait.text) {
        throw new JestTestcontainersConfigError("wait type text requires a text to wait for");
    }
}
function assertBindConfig(bindMount) {
    if (!bindMount.source) {
        throw new JestTestcontainersConfigError("a bind is missing the source (host's) path");
    }
    if (!bindMount.target) {
        throw new JestTestcontainersConfigError("a bind is missing the target (container's) path");
    }
    if (!bindMount.mode) {
        throw new JestTestcontainersConfigError('a bind is missing the mode ("rw" or "ro")');
    }
}
function assertContainerConfigIsValid({ image, tag, ports, name, wait, env, bindMounts, command }) {
    if (!image || image.constructor !== String || image.trim().length <= 0) {
        throw new JestTestcontainersConfigError("an image should be presented");
    }
    if (tag !== undefined &&
        (tag.constructor !== String || tag.trim().length <= 0)) {
        throw new JestTestcontainersConfigError("tag is optional but should be string");
    }
    if (ports !== undefined &&
        (ports.constructor !== Array || !ports.every(Number.isInteger))) {
        throw new JestTestcontainersConfigError("ports should be a list of numbers");
    }
    if (name !== undefined &&
        (name.constructor !== String || name.trim().length <= 0)) {
        throw new JestTestcontainersConfigError("name is optional but should be string");
    }
    if (env !== undefined && env.constructor !== Object) {
        throw new JestTestcontainersConfigError("env should be an object of env key to value");
    }
    if (bindMounts !== undefined &&
        (bindMounts.constructor !== Array ||
            bindMounts.some((bindMount) => bindMount.constructor !== Object))) {
        throw new JestTestcontainersConfigError("binds should be a list of bind objects");
    }
    if (command != null &&
        (!Array.isArray(command) || !command.every(util_1.isString))) {
        throw new JestTestcontainersConfigError("Command should be a list of strings");
    }
    assertWaitConfig(wait);
    if (bindMounts)
        bindMounts.every(assertBindConfig);
}
function parseContainerConfig(config) {
    assertContainerConfigIsValid(config);
    const { image, tag, ports, name, env, wait, bindMounts, command } = config;
    const parsed = { image, tag, ports, name, env, wait, bindMounts, command };
    return Object.keys(parsed).reduce((acc, key) => (key !== undefined ? Object.assign(Object.assign({}, acc), { [key]: config[key] }) : acc), {});
}
function getConfigPath(envValue) {
    if (!envValue) {
        return path_1.resolve(cwd_1.default(), "jest-testcontainers-config.js");
    }
    if (path_1.isAbsolute(envValue)) {
        return envValue;
    }
    return path_1.resolve(cwd_1.default(), envValue);
}
function readJsFile(file) {
    try {
        return require(file);
    }
    catch (e) {
        throw new JestTestcontainersConfigError(`could not read file ${file} as js file: ${e.message}`);
    }
}
function readConfig(envValue) {
    const configPath = getConfigPath(envValue);
    if (!fs_1.existsSync(configPath)) {
        throw new JestTestcontainersConfigError(`config file could not be found at: ${configPath}`);
    }
    return readJsFile(configPath);
}
function parseConfig(containerConfigs) {
    if (!containerConfigs || Object.keys(containerConfigs).length < 1) {
        throw new JestTestcontainersConfigError("testcontainers config can not be empty");
    }
    if ("dockerCompose" in containerConfigs) {
        if (Object.keys(containerConfigs).length !== 1) {
            throw new JestTestcontainersConfigError("testcontainers config cannot contain other images when using 'dockerCompose' option");
        }
        return containerConfigs;
    }
    return Object.keys(containerConfigs).reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: parseContainerConfig(containerConfigs[key]) })), {});
}
exports.parseConfig = parseConfig;
exports.default = () => parseConfig(readConfig(process.env.JEST_TESTCONTAINERS_CONFIG_PATH));
