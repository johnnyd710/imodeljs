/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Hooks */

import { useState, useEffect } from "react";
import { FrontstageActivatedEventArgs, FrontstageManager } from "../frontstage/FrontstageManager";

/** React hook that maintains the active stageId.
 * @beta
 */
export function useActiveStageId(): string {
  const [activeStageId, setActiveStageId] = useState(FrontstageManager.activeFrontstageId);
  useEffect(() => {
    const handleFrontstageActivatedEvent = (args: FrontstageActivatedEventArgs) => {
      setActiveStageId(args.activatedFrontstageDef.id);
    };

    FrontstageManager.onFrontstageActivatedEvent.addListener(handleFrontstageActivatedEvent);
    return () => {
      FrontstageManager.onFrontstageActivatedEvent.removeListener(handleFrontstageActivatedEvent);
    };
  }, []);
  return activeStageId;
}
