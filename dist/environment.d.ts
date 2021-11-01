/// <reference types="node" />
import NodeEnvironment from "jest-environment-node";
import { Script } from "vm";
export declare function setGlobalsWithJsonString(
  globals: any,
  jsonString: string
): void;
export declare class TestcontainersEnvironment extends NodeEnvironment {
  constructor(config: any);
  setup(): Promise<void>;
  teardown(): Promise<void>;
  runScript<T = any>(script: Script): T | null;
}
export default TestcontainersEnvironment;
