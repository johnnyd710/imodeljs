/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
declare module "*.md" {
  const markdown: string;
  export = markdown;
}

declare module "raf-schd" {
  function rafSchedule<TFn extends Function>(fn: TFn): ScheduleFn<TFn>;
  type CancelFn = {
    cancel: () => void,
  };
  export type ScheduleFn<TFn> = TFn & CancelFn;
  export default rafSchedule;
}
