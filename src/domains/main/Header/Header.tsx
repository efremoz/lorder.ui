import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import * as React from 'react';

import { ROLE } from 'src/@types';
import { CreateProjectPopup } from 'src/domains/@common/CreateProjectPopup';
import { LinkIconButton } from 'src/domains/@common/LinkIconButton';
import { Project } from 'src/store/projects';
import { ProjectButton } from './ProjectButton';

export interface IHeaderProps {
  classes: any;
  logOut: any;
  openDialog: any;
  openedProject: Project;
  projects: Array<Project & { percent: string; time: string }>;
  selectedProject: Project;
  userAvatar?: string;
  userEmail: string;
  userRole: ROLE;
}

export interface IHeaderState {
  expanded: boolean;
}

const projectFilter = (projects: Project[]) => (project: Project) =>
  ~projects.findIndex(pr => pr && project && pr.id === project.id);

export class HeaderTsx extends React.Component<IHeaderProps> {
  state = {
    expanded: false,
  };

  render() {
    const { classes, projects, selectedProject, logOut, userAvatar, userEmail, userRole } = this.props;
    const { expanded } = this.state;
    let filteredProjects: Array<Project & { percent: string; time: string }> = projects;
    if (!expanded) {
      filteredProjects = projects.filter(projectFilter([selectedProject]));
    }
    return (
      <AppBar position="static" className={classes.appBar} color="primary">
        <Toolbar>
          <LinkIconButton to="/" color="secondary">
            <AvTimerIcon />
          </LinkIconButton>
          <div className={classes.buttonBlock}>
            {filteredProjects.map(project => (
              <ProjectButton key={project.id} {...project} inProgress={project.id === selectedProject.id} />
            ))}
            {expanded && (
              <IconButton color="secondary" onClick={this.openCreateProject} className={classes.expandButton}>
                <AddIcon />
              </IconButton>
            )}
            <IconButton color="secondary" onClick={this.toggleExpandProjects} className={classes.expandButton}>
              {expanded ? <ChevronLeftIcon /> : <MoreHorizIcon />}
            </IconButton>
          </div>
          <div className={classes.grow} />
          <div>
            <Tooltip
              title={
                <div>
                  <p>Вы вошли как: {`${userEmail} (${userRole})`}</p>
                  <p>Нажмите, чтобы выйти</p>
                </div>
              }
            >
              <Avatar onClick={logOut} alt={userEmail} src={userAvatar || '/d-avatar.png'} className={classes.avatar} />
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    );
  }

  private toggleExpandProjects = () => this.setState(({ expanded }: IHeaderState) => ({ expanded: !expanded }));

  // private hideProjects = () => this.setState({ expanded: false });
  private openCreateProject = () => this.props.openDialog(CreateProjectPopup);
}
