import { DialogProps } from '@material-ui/core/Dialog';
import map from 'lodash/map';

export interface IDialogState {
  isOpened: boolean;
  dialogProps?: Partial<DialogProps>;
  props?: any;
}

export class Dialog implements IDialogState {
  isOpened: boolean = false;
  dialogProps?: Partial<DialogProps> = {};
  props?: any;

  constructor(initial?: Dialog) {
    map(initial, (val: any, key: string) => {
      this[key] = val;
    });
  }
}