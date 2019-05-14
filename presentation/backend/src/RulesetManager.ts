/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Core */

import { RegisteredRuleset, Ruleset } from "@bentley/presentation-common";
import { NativePlatformDefinition } from "./NativePlatform";

/**
 * Presentation ruleset registry.
 * @public
 */
export interface RulesetManager {
  /**
   * Get a ruleset with the specified id.
   */
  get(id: string): RegisteredRuleset | undefined;

  /**
   * Register the supplied ruleset
   */
  add(ruleset: Ruleset): RegisteredRuleset;

  /**
   * Unregister the supplied ruleset
   */
  remove(ruleset: RegisteredRuleset | [string, string]): boolean;

  /**
   * Remove all rulesets registered in this session.
   */
  clear(): void;
}

/**
 * Presentation ruleset registry implementation.
 * @internal
 */
export class RulesetManagerImpl implements RulesetManager {

  private _getNativePlatform: () => NativePlatformDefinition;

  constructor(getNativePlatform: () => NativePlatformDefinition) {
    this._getNativePlatform = getNativePlatform;
  }

  /**
   * Get a ruleset with the specified id.
   */
  public get(id: string): RegisteredRuleset | undefined {
    const serializedRulesetsArray = this._getNativePlatform().getRulesets(id);
    const rulesetsArray: RulesetResponseJson[] = JSON.parse(serializedRulesetsArray);
    if (0 === rulesetsArray.length)
      return undefined;
    return new RegisteredRuleset(rulesetsArray[0].ruleset, rulesetsArray[0].hash, (ruleset: RegisteredRuleset) => this.remove(ruleset));
  }

  /**
   * Register the supplied ruleset
   */
  public add(ruleset: Ruleset): RegisteredRuleset {
    const hash = this._getNativePlatform().addRuleset(JSON.stringify(ruleset));
    return new RegisteredRuleset(ruleset, hash, (r: RegisteredRuleset) => this.remove(r));
  }

  /**
   * Unregister the supplied ruleset
   */
  public remove(ruleset: RegisteredRuleset | [string, string]): boolean {
    if (Array.isArray(ruleset))
      return this._getNativePlatform().removeRuleset(ruleset[0], ruleset[1]);
    return this._getNativePlatform().removeRuleset(ruleset.id, ruleset.uniqueIdentifier);
  }

  /**
   * Remove all rulesets registered in this session.
   */
  public clear(): void {
    this._getNativePlatform().clearRulesets();
  }
}

interface RulesetResponseJson {
  ruleset: Ruleset;
  hash: string;
}
