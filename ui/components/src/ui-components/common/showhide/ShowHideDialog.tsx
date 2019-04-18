/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Common */

import * as React from "react";
import { ShowHideItem, ShowHideID } from "./ShowHideItem";
import { GlobalDialog, GlobalDialogProps, DialogButtonType } from "@bentley/ui-core";
import { UiComponents } from "../../UiComponents";

/** Properties for the [[ShowHideDialog]] component
 * @public
 */
export interface ShowHideDialogProps<T extends ShowHideID> extends GlobalDialogProps {
  /** key-label pair list for id's to be shown/hidden, and an accompanying label. */
  items: Array<ShowHideItem<T>>;
  /** Hidden list to start with */
  initialHidden?: T[];
  /** Called when item is shown/hidden */
  onShowHideChange?: (cols: T[]) => boolean | undefined;
}

/** @internal */
interface ShowHideDialogState<T extends ShowHideID> {
  hiddenColumns: T[];
}

/**
 * [Dialog]($ui-core) Component used to toggle show/hide items, given through items prop, through a list of checkboxes.
 * @public
 */
export class ShowHideDialog<T extends ShowHideID> extends React.PureComponent<ShowHideDialogProps<T>, ShowHideDialogState<T>> {
  /** @internal */
  public readonly state: ShowHideDialogState<T>;
  constructor(props: ShowHideDialogProps<T>) {
    super(props);
    this.state = {
      hiddenColumns: props.initialHidden || [],
    };
  }

  /** @internal */
  public componentDidUpdate(oldProps: ShowHideDialogProps<T>) {
    if (this.props.initialHidden && oldProps.initialHidden !== this.props.initialHidden) {
      this.setState({ hiddenColumns: this.props.initialHidden });
    }
  }

  private _toggleItem = (item: ShowHideItem<T>) => {
    if (this.state.hiddenColumns.indexOf(item.id) !== -1)
      this._show(item);
    else
      this._hide(item);
  }

  private _hide = (item: ShowHideItem<T>) => {
    this.setState({ hiddenColumns: [...this.state.hiddenColumns, item.id] }, () => {
      if (this.props.onShowHideChange)
        this.props.onShowHideChange(this.state.hiddenColumns);
    });
  }

  private _show = (item: ShowHideItem<T>) => {
    const hiddenColumns = this.state.hiddenColumns.filter((value) => {
      return value !== item.id;
    });

    this.setState({ hiddenColumns }, () => {
      if (this.props.onShowHideChange)
        this.props.onShowHideChange(this.state.hiddenColumns);
    });
  }

  /** @internal */
  public render(): React.ReactNode {
    const { opened, items, initialHidden, onClose, onShowHideChange, ...props } = this.props;
    return (
      <GlobalDialog
        opened={opened}
        resizable={true}
        movable={true}
        modal={false}
        minWidth={300}
        minHeight={250}
        width={300}
        onClose={onClose}
        onEscape={onClose}
        onOutsideClick={onClose}
        buttonCluster={onClose && [{ onClick: onClose, type: DialogButtonType.Close }]}
        {...props}>
        {this.props.items.map((item, index) => {
          const visible = this.state.hiddenColumns.indexOf(item.id) === -1;
          const sel = () => {
            this._toggleItem(item);
          };
          const label = item.label || UiComponents.i18n.translate("UiComponents:showhide:noLabel");
          const id = "show-hide-dialog-input-" + index;
          return (
            <div key={index}>
              <input data-testid={id} id={id} type="checkbox" checked={visible} onChange={() => undefined} onClick={sel} />
              <label htmlFor={id}>{label}</label>
            </div>
          );
        })}
      </GlobalDialog>
    );
  }
}
