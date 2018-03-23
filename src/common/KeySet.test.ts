/*---------------------------------------------------------------------------------------------
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
 *--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import KeySet, { SerializedKeySet } from "./KeySet";
import { InstanceKey } from "./EC";
import { createRandomECInstanceNodeKey } from "../test-helpers/random/Hierarchy";
import { createRandomECInstanceKey, createRandomECInstanceId } from "../test-helpers/random/EC";
import { createRandomEntityProps } from "../test-helpers/random/IModelJs";

require("../test-helpers/Snapshots"); // tslint:disable-line:no-var-requires

describe("KeySet", () => {

  describe("construction", () => {

    it("creates empty set by default", () => {
      const set = new KeySet();
      expect(set.size).to.eq(0);
    });

    it("initializes from node keys", () => {
      const keys = [createRandomECInstanceNodeKey(), createRandomECInstanceNodeKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(2);
      expect(set.has(keys[0])).to.be.true;
      expect(set.has(keys[1])).to.be.true;
    });

    it("initializes from instance keys", () => {
      const keys = [createRandomECInstanceKey(), createRandomECInstanceKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(2);
      expect(set.has(keys[0])).to.be.true;
      expect(set.has(keys[1])).to.be.true;
    });

    it("initializes from entity props", () => {
      const props = [createRandomEntityProps(), createRandomEntityProps()];
      const set = new KeySet(props);
      expect(set.size).to.eq(2);
      expect(set.has(props[0])).to.be.true;
      expect(set.has(props[1])).to.be.true;
    });

    it("initializes from SerializedKeySet", () => {
      const instanceKey11 = createRandomECInstanceKey();
      const instanceKey12 = {
        className: instanceKey11.className,
        id: createRandomECInstanceId(),
      } as InstanceKey;
      const instanceKey2 = createRandomECInstanceKey();
      const nodeKey = createRandomECInstanceNodeKey();
      const serialized = {
        instanceKeys: [
          [instanceKey11.className, [instanceKey11.id.value, instanceKey12.id.value]],
          [instanceKey2.className, [instanceKey2.id.value]],
        ],
        nodeKeys: [nodeKey],
      } as SerializedKeySet;
      const set = new KeySet(serialized);
      expect(set.size).to.eq(4);
      expect(set.has(instanceKey11)).to.be.true;
      expect(set.has(instanceKey12)).to.be.true;
      expect(set.has(instanceKey2)).to.be.true;
      expect(set.has(nodeKey)).to.be.true;
    });

  });

  describe("clear", () => {

    it("clears node keys", () => {
      const keys = [createRandomECInstanceNodeKey(), createRandomECInstanceNodeKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(2);
      set.clear();
      expect(set.size).to.eq(0);
    });

    it("clears instance keys", () => {
      const keys = [createRandomECInstanceKey(), createRandomECInstanceKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(2);
      set.clear();
      expect(set.size).to.eq(0);
    });

    it("clears entity props", () => {
      const props = [createRandomEntityProps(), createRandomEntityProps()];
      const set = new KeySet(props);
      expect(set.size).to.eq(2);
      set.clear();
      expect(set.size).to.eq(0);
    });

  });

  describe("add", () => {

    it("adds a node key", () => {
      const set = new KeySet([createRandomECInstanceNodeKey()]);
      expect(set.size).to.eq(1);
      const key = createRandomECInstanceNodeKey();
      set.add(key);
      expect(set.size).to.eq(2);
      expect(set.has(key)).to.be.true;
    });

    it("adds an array of node keys", () => {
      const set = new KeySet([createRandomECInstanceNodeKey()]);
      expect(set.size).to.eq(1);
      const keys = [createRandomECInstanceNodeKey(), createRandomECInstanceNodeKey()];
      set.add(keys);
      expect(set.size).to.eq(3);
      expect(set.has(keys[0])).to.be.true;
      expect(set.has(keys[1])).to.be.true;
    });

    it("adds an instance key", () => {
      const set = new KeySet([createRandomECInstanceKey()]);
      expect(set.size).to.eq(1);
      const key = createRandomECInstanceKey();
      set.add(key);
      expect(set.size).to.eq(2);
      expect(set.has(key)).to.be.true;
    });

    it("adds an array of instance keys", () => {
      const set = new KeySet([createRandomECInstanceKey()]);
      expect(set.size).to.eq(1);
      const keys = [createRandomECInstanceKey(), createRandomECInstanceKey()];
      set.add(keys);
      expect(set.size).to.eq(3);
      expect(set.has(keys[0])).to.be.true;
      expect(set.has(keys[1])).to.be.true;
    });

    it("adds an entity prop", () => {
      const set = new KeySet([createRandomEntityProps()]);
      expect(set.size).to.eq(1);
      const prop = createRandomEntityProps();
      set.add(prop);
      expect(set.size).to.eq(2);
      expect(set.has(prop)).to.be.true;
    });

    it("adds an array of entity props", () => {
      const set = new KeySet([createRandomEntityProps()]);
      expect(set.size).to.eq(1);
      const props = [createRandomEntityProps(), createRandomEntityProps()];
      set.add(props);
      expect(set.size).to.eq(3);
      expect(set.has(props[0])).to.be.true;
      expect(set.has(props[1])).to.be.true;
    });

  });

  describe("delete", () => {

    it("deletes a node key", () => {
      const keys = [createRandomECInstanceNodeKey(), createRandomECInstanceNodeKey(), createRandomECInstanceNodeKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(3);
      set.delete(keys[1]);
      expect(set.size).to.eq(2);
      expect(set.has(keys[1])).to.be.false;
    });

    it("deletes an array of node keys", () => {
      const keys = [createRandomECInstanceNodeKey(), createRandomECInstanceNodeKey(), createRandomECInstanceNodeKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(3);
      set.delete([keys[1], keys[2]]);
      expect(set.size).to.eq(1);
      expect(set.has(keys[1])).to.be.false;
      expect(set.has(keys[2])).to.be.false;
    });

    it("deletes an instance key", () => {
      const keys = [createRandomECInstanceKey(), createRandomECInstanceKey(), createRandomECInstanceKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(3);
      set.delete(keys[1]);
      expect(set.size).to.eq(2);
      expect(set.has(keys[1])).to.be.false;
    });

    it("deletes an array of instance keys", () => {
      const keys = [createRandomECInstanceKey(), createRandomECInstanceKey(), createRandomECInstanceKey()];
      const set = new KeySet(keys);
      expect(set.size).to.eq(3);
      set.delete([keys[1], keys[2]]);
      expect(set.size).to.eq(1);
      expect(set.has(keys[1])).to.be.false;
      expect(set.has(keys[2])).to.be.false;
    });

    it("deletes an entity prop", () => {
      const props = [createRandomEntityProps(), createRandomEntityProps(), createRandomEntityProps()];
      const set = new KeySet(props);
      expect(set.size).to.eq(3);
      set.delete(props[1]);
      expect(set.size).to.eq(2);
      expect(set.has(props[1])).to.be.false;
    });

    it("deletes an array of entity props", () => {
      const props = [createRandomEntityProps(), createRandomEntityProps(), createRandomEntityProps()];
      const set = new KeySet(props);
      expect(set.size).to.eq(3);
      set.delete([props[1], props[2]]);
      expect(set.size).to.eq(1);
      expect(set.has(props[1])).to.be.false;
      expect(set.has(props[2])).to.be.false;
    });

  });

  describe("serialization", () => {

    it("roundtrip", () => {
      const instanceKey11 = createRandomECInstanceKey();
      const instanceKey12 = {
        className: instanceKey11.className,
        id: createRandomECInstanceId(),
      } as InstanceKey;
      const instanceKey2 = createRandomECInstanceKey();
      const nodeKey = createRandomECInstanceNodeKey();

      const source = new KeySet();
      source.add([instanceKey11, instanceKey12, instanceKey2]).add(nodeKey);

      const serialized = JSON.stringify(source);
      const deserialized = JSON.parse(serialized);
      expect(deserialized).to.matchSnapshot();

      const target = new KeySet(deserialized);
      expect(target.size).to.eq(4);
      expect(target.has(instanceKey11)).to.be.true;
      expect(target.has(instanceKey12)).to.be.true;
      expect(target.has(instanceKey2)).to.be.true;
      expect(target.has(nodeKey)).to.be.true;
    });

  });

});
