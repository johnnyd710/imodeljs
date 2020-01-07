/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { TestRpcInterface, ZeroMajorRpcInterface, TestOp1Params, TestRpcInterface2, TestRpcInterface3, TestNotFoundResponse, TestNotFoundResponseCode, RpcTransportTestImpl, TokenValues } from "../common/TestRpcInterface";
import { RpcInterface, RpcManager, RpcRequest, RpcOperationsProfile, RpcPendingResponse, RpcInvocation, IModelTokenProps } from "@bentley/imodeljs-common";
import { BentleyError, BentleyStatus, Id64String, ClientRequestContext } from "@bentley/bentleyjs-core";

export async function testInterfaceResource() {
  const data = new Uint8Array(4);
  data[0] = 1;
  data[1] = 2;
  data[2] = 3;
  data[3] = 4;
  return Promise.resolve(data);
}

let op8Initializer = 0;

export const resetOp8Initializer = () => {
  op8Initializer = 0;
};

export class TestZeroMajorRpcImpl extends RpcInterface implements ZeroMajorRpcInterface {
  public static register() {
    RpcManager.registerImpl(ZeroMajorRpcInterface, TestZeroMajorRpcImpl);
  }

  public async op1(params: TestOp1Params): Promise<number> {
    return params.a + params.b;
  }
}

export class TestRpcImpl extends RpcInterface implements TestRpcInterface {
  public static register() {
    RpcManager.registerImpl(TestRpcInterface, TestRpcImpl);
  }

  public async interceptSendUnknownStatus(): Promise<void> {
    throw new Error("Not intercepted.");
  }

  public async interceptSendTimeoutStatus(): Promise<void> {
    throw new Error("Not intercepted.");
  }

  public async op1(params: TestOp1Params): Promise<number> {
    return params.a + params.b;
  }

  public async op2(id: Id64String): Promise<Id64String> {
    const val = id;
    return val;
  }

  public async op6(data: { x: number, y: number }): Promise<{ x: number, y: number }> {
    const val = data;
    return val;
  }

  public async op7(): Promise<RpcOperationsProfile> {
    const val = RpcRequest.aggregateLoad;
    return val;
  }

  public async op8(x: number, y: number): Promise<{ initializer: number; sum: number }> {
    if (!op8Initializer) {
      op8Initializer = TestRpcInterface.OP8_INITIALIZER;
      throw new RpcPendingResponse(TestRpcInterface.OP8_PENDING_MESSAGE);
    } else {
      const val = { initializer: op8Initializer, sum: x + y };
      return val;
    }
  }

  public async op9(requestId: string): Promise<string> {
    const invocation = RpcInvocation.current(this);
    if (!invocation || invocation.request.id !== requestId)
      throw new Error();

    const val = requestId;
    return val;
  }

  public async op10(): Promise<void> {
    throw new BentleyError(BentleyStatus.ERROR);
  }

  public async op11(input: string, call: number): Promise<string> {
    if (input === "oldvalue") {
      throw new TestNotFoundResponse(TestNotFoundResponseCode.CanRecover);
    } else if (input === "newvalue") {
      if (call === 1) {
        throw new TestNotFoundResponse(TestNotFoundResponseCode.Fatal);
      } else {
        const val = input;
        return val;
      }
    } else {
      throw new Error("Invalid.");
    }
  }

  public async op12(): Promise<Uint8Array> {
    const val = testInterfaceResource();
    return val;
  }

  public async op13(data: Uint8Array): Promise<void> {
    if (data[0] === 1 && data[1] === 2 && data[2] === 3 && data[3] === 4) {
      return;
    } else {
      throw new Error();
    }
  }

  public async op14(x: number, y: number): Promise<number> {
    return Promise.resolve(x + y);
  }

  public async op15(): Promise<void> {
    if (ClientRequestContext.current.applicationVersion !== "testbed1") {
      throw new Error("Wrong app version code.");
    }

    return;
  }

  public async op16(token: IModelTokenProps, values: TokenValues): Promise<boolean> {
    return token.key === values.key &&
      token.contextId === values.contextId &&
      token.iModelId === values.iModelId &&
      token.changeSetId === values.changeSetId &&
      token.openMode === values.openMode;
  }
}

export class TestRpcImpl2 extends RpcInterface implements TestRpcInterface2 {
  public static register() {
    RpcManager.registerImpl(TestRpcInterface2, TestRpcImpl2);
  }

  public static unregister() {
    RpcManager.unregisterImpl(TestRpcInterface2);
  }

  public static instantiate() {
    // Demonstrates how a consumer can create and supply an instance of the RPC implementation class if necessary.
    const instance = new TestRpcImpl2();
    RpcManager.supplyImplInstance(TestRpcInterface2, instance);
  }

  public async op1(input: number): Promise<number> {
    const val = input;
    return val;
  }
}

export class TestRpcImpl3 extends RpcInterface implements TestRpcInterface3 {
  public static register() {
    RpcManager.registerImpl(TestRpcInterface3, TestRpcImpl3);
  }

  public async op1(input: number): Promise<number> {
    const val = input;
    return val;
  }

  public async op2(size: number, fill: boolean): Promise<Uint8Array> {
    const data = new Uint8Array(size);

    if (fill) {
      for (let i = 0; i !== size; ++i) {
        data[i] = i % 2;
      }
    }

    return data;
  }
}

TestRpcImpl.register();
TestRpcImpl3.register();
TestZeroMajorRpcImpl.register();
RpcTransportTestImpl.register();
