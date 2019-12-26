/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { OpenMode } from "@bentley/bentleyjs-core";
import { executeBackendCallback } from "@bentley/certa/lib/utils/CallbackUtils";
import { BentleyCloudRpcManager, ElectronRpcManager, IModelToken, RpcOperation, RpcConfiguration, RpcDefaultConfiguration } from "@bentley/imodeljs-common";
import { BackendTestCallbacks } from "../common/SideChannels";
import { rpcInterfaces } from "../common/TestRpcInterface";

function initializeCloud(protocol: string) {
  const config = BentleyCloudRpcManager.initializeClient({ info: { title: "rpc-integration-test", version: "v1.0" } }, rpcInterfaces);
  config.protocol.pathPrefix = `${protocol}://${window.location.hostname}:${Number(window.location.port) + 2000}`;

  for (const definition of rpcInterfaces) {
    RpcOperation.forEach(definition, (operation) => operation.policy.token = (request) => (request.findTokenPropsParameter() || new IModelToken("test", "test", "test", "test", OpenMode.Readonly)));
  }
}

before(async () => {
  const currentEnvironment: string = await executeBackendCallback(BackendTestCallbacks.getEnvironment);
  switch (currentEnvironment) {
    case "http": return initializeCloud("http");
    case "http2": return initializeCloud("https");
    case "electron": return ElectronRpcManager.initializeClient({}, rpcInterfaces);
    case "direct": {
      // (global as any).window = undefined;
      require("../backend/CommonBackendSetup");
      const config = RpcConfiguration.obtain(RpcDefaultConfiguration);
      config.interfaces = () => rpcInterfaces as any;
      return RpcConfiguration.initializeInterfaces(config);
    }
  }

  throw new Error(`Invalid test environment: "${currentEnvironment}"`);
});
