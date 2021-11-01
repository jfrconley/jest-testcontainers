import { DockerComposeEnvironment } from "testcontainers";
import {
  StartedTestContainer,
  TestContainer
} from "testcontainers/dist/test-container";
import {
  DockerComposeConfig,
  JestTestcontainersConfig,
  SingleContainerConfig
} from "./config";
export declare function buildTestcontainer(
  containerConfig: SingleContainerConfig
): TestContainer;
export declare function buildDockerComposeEnvironment(
  dockerComposeConfig: DockerComposeConfig
): DockerComposeEnvironment;
export interface StartedContainerAndMetaInfo {
  ip: string;
  name: string;
  portMappings: Map<number, number>;
  container: StartedTestContainer;
}
export declare function getMetaInfo(
  container: StartedTestContainer,
  ports?: number[]
): StartedContainerAndMetaInfo;
export declare function startContainer(
  containerConfig: SingleContainerConfig,
  containerBuilderFn?: typeof buildTestcontainer,
  infoGetterFn?: typeof getMetaInfo
): Promise<StartedContainerAndMetaInfo>;
export declare function startDockerComposeContainers(
  dockerComposeConfig: DockerComposeConfig,
  dockerComposeBuilderFn?: typeof buildDockerComposeEnvironment,
  infoGetterFn?: typeof getMetaInfo
): Promise<AllStartedContainersAndMetaInfo>;
export declare type AllStartedContainersAndMetaInfo = {
  [key: string]: StartedContainerAndMetaInfo;
};
export declare function startAllContainers(
  config: JestTestcontainersConfig,
  startContainerFn?: typeof startContainer,
  startDockerComposeContainersFn?: typeof startDockerComposeContainers
): Promise<AllStartedContainersAndMetaInfo>;
