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
exports.startAllContainers = exports.startDockerComposeContainers = exports.startContainer = exports.getMetaInfo = exports.buildDockerComposeEnvironment = exports.buildTestcontainer = void 0;
const node_duration_1 = require("node-duration");
const testcontainers_1 = require("testcontainers");
const addWaitStrategyToContainer = (waitStrategy) => (container) => {
    if (waitStrategy === undefined) {
        return container;
    }
    if (waitStrategy.type === "ports") {
        return container.withStartupTimeout(new node_duration_1.Duration(waitStrategy.timeout, node_duration_1.TemporalUnit.SECONDS));
    }
    if (waitStrategy.type === "text") {
        return container.withWaitStrategy(testcontainers_1.Wait.forLogMessage(waitStrategy.text));
    }
    throw new Error("unknown wait strategy for container");
};
const addEnvironmentVariablesToContainer = (env) => (container) => {
    if (env === undefined) {
        return container;
    }
    return Object.keys(env).reduce((newContainer, key) => newContainer.withEnv(key, env[key]), container);
};
const addPortsToContainer = (ports) => (container) => {
    if (!Array.isArray(ports) || ports.length <= 0) {
        return container;
    }
    return container.withExposedPorts(...ports);
};
const addBindsToContainer = (bindMounts) => (container) => {
    if (!bindMounts)
        return container;
    for (const bindMount of bindMounts) {
        container.withBindMount(bindMount.source, bindMount.target, bindMount.mode);
    }
    return container;
};
const addCmdToContainer = (command) => (container) => {
    if (command == null) {
        return container;
    }
    container.withCmd(command);
    return container;
};
const addNameToContainer = (name) => (container) => {
    if (name === undefined) {
        return container;
    }
    return container.withName(name);
};
function buildTestcontainer(containerConfig) {
    const { image, tag, ports, name, env, wait, bindMounts, command } = containerConfig;
    const container = new testcontainers_1.GenericContainer(image, tag);
    return [
        addPortsToContainer(ports),
        addEnvironmentVariablesToContainer(env),
        addWaitStrategyToContainer(wait),
        addBindsToContainer(bindMounts),
        addCmdToContainer(command)
    ].reduce((res, func) => func(res), addNameToContainer(name)(container));
}
exports.buildTestcontainer = buildTestcontainer;
function buildDockerComposeEnvironment(dockerComposeConfig) {
    const environment = new testcontainers_1.DockerComposeEnvironment(dockerComposeConfig.composeFilePath, dockerComposeConfig.composeFile);
    if (dockerComposeConfig === null || dockerComposeConfig === void 0 ? void 0 : dockerComposeConfig.startupTimeout) {
        return environment.withStartupTimeout(new node_duration_1.Duration(dockerComposeConfig.startupTimeout, node_duration_1.TemporalUnit.MILLISECONDS));
    }
    return environment;
}
exports.buildDockerComposeEnvironment = buildDockerComposeEnvironment;
function getMetaInfo(container, ports) {
    const portMappings = new Map();
    return {
        container,
        ip: container.getContainerIpAddress(),
        name: container.getName(),
        portMappings: (ports || []).reduce((mapping, p) => container.getMappedPort(p)
            ? mapping.set(p, container.getMappedPort(p))
            : mapping, portMappings)
    };
}
exports.getMetaInfo = getMetaInfo;
function startContainer(containerConfig, containerBuilderFn = buildTestcontainer, infoGetterFn = getMetaInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = containerBuilderFn(containerConfig);
        const startedContainer = yield container.start();
        return infoGetterFn(startedContainer, containerConfig.ports);
    });
}
exports.startContainer = startContainer;
function startDockerComposeContainers(dockerComposeConfig, dockerComposeBuilderFn = buildDockerComposeEnvironment, infoGetterFn = getMetaInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const environment = dockerComposeBuilderFn(dockerComposeConfig);
        const startedEnvironment = yield environment.up();
        const containers = startedEnvironment.startedGenericContainers;
        return Object.keys(containers).reduce((acc, containerName) => (Object.assign(Object.assign({}, acc), { [containerName]: infoGetterFn(containers[containerName], Array.from(containers[containerName].boundPorts.ports.keys())) })), {});
    });
}
exports.startDockerComposeContainers = startDockerComposeContainers;
function startAllContainers(config, startContainerFn = startContainer, startDockerComposeContainersFn = startDockerComposeContainers) {
    return __awaiter(this, void 0, void 0, function* () {
        if ("dockerCompose" in config) {
            return startDockerComposeContainersFn(config.dockerCompose);
        }
        const containerKeys = Object.keys(config);
        const containerConfigs = Object.values(config);
        const startedContainersMetaInfos = yield Promise.all(containerConfigs.map(containerConfig => startContainerFn(containerConfig)));
        return containerKeys.reduce((acc, key, idx) => (Object.assign(Object.assign({}, acc), { [key]: startedContainersMetaInfos[idx] })), {});
    });
}
exports.startAllContainers = startAllContainers;
