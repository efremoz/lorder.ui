import { connect } from 'react-redux';

import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';

import { openDialog } from '#/@store/dialog';
import { showWarning } from '#/@store/notifications';
import { selectedProject } from '#/@store/projects';
import { openTaskModal } from '#/@store/tasks';
import { startUserWork } from '#/@store/user-works';

import { HeaderTsx } from './Header';

import { withResize } from '@hooks/withResize';
import { IState } from '@types';

const mapStateToProps = createStructuredSelector<IState, any>({
  selectedProject,
});

const mapDispatchToProps = {
  openDialog,
  openTaskModal,
  push,
  showWarning,
  startUserWork,
};

export const Header = connect<any, any, {}, any>(
  mapStateToProps,
  mapDispatchToProps
)(withResize(HeaderTsx));
