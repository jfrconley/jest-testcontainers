export declare type EnvironmentVariableMap = {
  [key: string]: string;
};
export declare type WaitConfig = PortsWaitConfig | TextWaitConfig;
export declare type DockerComposeConfig = {
  composeFilePath: string;
  composeFile: string;
  startupTimeout?: number;
};
declare type DockerComposeContainersConfig = {
  dockerCompose?: DockerComposeConfig;
};
declare type MultipleContainerConfig = {
  [key: string]: SingleContainerConfig;
};
export declare type JestTestcontainersConfig =
  | DockerComposeContainersConfig
  | MultipleContainerConfig;
export interface SingleContainerConfig {
  image: string;
  tag?: string;
  ports?: number[];
  name?: string;
  env?: EnvironmentVariableMap;
  wait?: WaitConfig;
  bindMounts?: BindConfig[];
  command?: string[];
}
interface PortsWaitConfig {
  type: "ports";
  timeout: number;
}
interface TextWaitConfig {
  type: "text";
  text: string;
}
export interface BindConfig {
  source: string;
  target: string;
  mode: BindMode;
}
export declare type BindMode = "ro" | "rw";
export declare function parseConfig(containerConfigs: any): any;
declare const _default: () => JestTestcontainersConfig;
export default _default;
