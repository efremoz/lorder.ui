import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { Field } from 'redux-form';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';

import StartStopBtn from '#/@common/start-stop-btn';

import AssigneeList from './assignee-list';
import ChangeStatus from './change-status';
import PerformerField from './performer-field';
import StatusField from './status-field';
import { useStyles } from './styles';

import { ITask, IUser } from '@types';

interface ITaskStatusProps {
  assignees: IUser[];
  canStartTask: (sequenceNumber: number, projectId: number) => boolean;
  getTaskBySequenceNumber: (sequenceNumber: number, projectId: number) => undefined | ITask;
  isCurrent?: boolean;
  isMine?: boolean;
  onChangeAssignee: (userId: number) => void;
  onStart: (_: any) => void;
  onStop: (_: any) => void;
  projectId: number;
  sequenceNumber: number;
}

enum POPPER_TYPE {
  ASSIGNEE_LIST = 'assignees',
  CHANGE_STATUS = 'statuses',
}

type IPopperType = POPPER_TYPE | null;

let lastPopperType: IPopperType = null;
let nextPopperType: IPopperType = null;

export const TaskStatus: React.FC<ITaskStatusProps> = React.memo(
  ({
    assignees,
    canStartTask,
    getTaskBySequenceNumber,
    isCurrent,
    onChangeAssignee,
    onStart,
    onStop,
    sequenceNumber,
    projectId,
  }) => {
    const classes = useStyles();

    const isCanStart = useMemo(() => {
      return canStartTask(sequenceNumber, projectId);
    }, [canStartTask, sequenceNumber, projectId]);

    const task = useMemo(() => {
      return getTaskBySequenceNumber(sequenceNumber, projectId);
    }, [getTaskBySequenceNumber, sequenceNumber, projectId]);

    const anchorRef = React.useRef(null);

    const [popperType, setPopperType] = useState<IPopperType>(null);
    useLayoutEffect(() => {
      if (lastPopperType && popperType && lastPopperType !== popperType) {
        setPopperType(null);
        nextPopperType = popperType;
      }
      if (popperType === null && nextPopperType) {
        setPopperType(nextPopperType);
        nextPopperType = null;
      }
      lastPopperType = popperType;
    }, [popperType, setPopperType]);

    const handleMenuItemClick = useCallback(
      event => {
        onChangeAssignee(event.target.value);
        setPopperType(null);
      },
      [onChangeAssignee, setPopperType]
    );

    const assigneeListToggle = useCallback(
      e => {
        e.stopPropagation();
        setPopperType(poperType => (poperType === POPPER_TYPE.ASSIGNEE_LIST ? null : POPPER_TYPE.ASSIGNEE_LIST));
      },
      [setPopperType]
    );

    const handleClose = useCallback(() => {
      setPopperType(null);
    }, [setPopperType]);

    const open = Boolean(popperType);
    return (
      <div className={classes.wrapper}>
        <ClickAwayListener onClickAway={handleClose}>
          <div className={classes.taskStatus} ref={anchorRef}>
            <Field name="statusTypeName" component={StatusField} projectId={projectId} />
            <Field
              name="performerId"
              component={PerformerField}
              assigneeListToggle={assigneeListToggle}
              open={open}
              assignees={assignees}
            />
            <Popper open={open} anchorEl={anchorRef.current} transition className={classes.popper}>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <div id="menu-list-grow">
                    {popperType === POPPER_TYPE.ASSIGNEE_LIST && (
                      <AssigneeList assignees={assignees} onItemClick={handleMenuItemClick} />
                    )}
                    {popperType === POPPER_TYPE.CHANGE_STATUS && <ChangeStatus />}
                  </div>
                </Grow>
              )}
            </Popper>
          </div>
        </ClickAwayListener>
        {isCanStart && <StartStopBtn task={task} onStartNew={onStart} />}
      </div>
    );
  }
);
