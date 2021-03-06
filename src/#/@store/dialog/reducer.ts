import { ReactNode } from 'react';

import { LOCATION_CHANGE } from 'connected-react-router';
import get from 'lodash/get';
import { ActionMeta, handleActions } from 'redux-actions';

import { DialogProps } from '@material-ui/core/Dialog';

import { changeSettings, closeDialog, openDialog } from './actions';
import { Dialog, IDialogState } from './Dialog';

type S = IDialogState;
type P = ReactNode;
type M = Partial<DialogProps>;

const closeDialogHandler = (state: S): S => {
  return new Dialog({
    ...state,
    isOpened: false,
    props: null,
  });
};

const openDialogHandler = (state: S, { payload, meta }: ActionMeta<P, M>): S => {
  return new Dialog({
    dialogProps: meta,
    isOpened: true,
    props: payload,
  });
};

const locationChangeHandler = (state: S, { payload }: any) => {
  const { location } = payload;
  const isModal = get(location, 'state.modal');
  if (state.isOpened && !isModal) {
    return new Dialog({
      ...state,
      isOpened: false,
      props: null,
    });
  }
  return state;
};

const changeSettingsHandler = (state: S, { payload }: any) => {
  return new Dialog({
    ...state,
    dialogProps: { ...state.dialogProps, ...payload },
  });
};

export const dialog = handleActions<S, P, M>(
  {
    [closeDialog.toString()]: closeDialogHandler,
    [openDialog.toString()]: openDialogHandler,
    [changeSettings.toString()]: changeSettingsHandler,

    [LOCATION_CHANGE]: locationChangeHandler,
  },
  new Dialog()
) as any;
