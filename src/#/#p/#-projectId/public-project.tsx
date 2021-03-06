import React, { useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import get from 'lodash/get';

import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core/';

import TelegramIco from '@components/@icons/Telegram';
import LoadingPage from '@components/loading-page';
import { NoMatch } from '@components/no-match';

import HiHeader from '#/#hi/@common/hi-header';
import { millisecondsToHours } from '#/@store/@common/helpers';
import { Member } from '#/@store/projects/members/Member';

import FollowProject from './follow-project';
import ProjectMetrics from './metrics';
import ProjectHead from './project-head';
import ProjectTeam from './project-team';
import ProjectValues from './project-values';
import { StatisticTablesTsx } from './statistics-tables/statistics-tables';
import { useStyles } from './styles';
import UsersActivity from './users-activity';

import { IProject } from '@types';

export interface IPublicProjectProps extends RouteComponentProps<{ projectId: string }> {
  isAuth: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  fetchPublicProject: any;
  project: IProject;
  publicProjectUuid: string;
  statistic: any;
  team: Array<{
    image: string;
    name: string;
  }>;
  userId: number;
}

export const PublicProjectTsx: React.FC<IPublicProjectProps> = ({
  fetchPublicProject,
  isAuth,
  isLoaded,
  isLoading,
  location,
  match,
  project,
  publicProjectUuid,
  statistic,
  userId,
}) => {
  const matchProjectUuid = useMemo(() => {
    return match.params.projectId;
  }, [match]);

  const members: Member[] = useMemo(() => {
    return (project && project.members ? project.members : []) as Member[];
  }, [project]);

  useEffect(() => {
    if (publicProjectUuid !== matchProjectUuid) {
      fetchPublicProject(matchProjectUuid);
    }
  }, [fetchPublicProject, matchProjectUuid, publicProjectUuid]);

  const classes = useStyles();

  const chartData = useMemo(() => {
    return members.map(el => ({
      id: el.member.id,
      name: get(el.member, 'displayName') || get(el.member, 'email', '').replace(/@.*$/, ''),
      y: millisecondsToHours(el.timeSum) || 0.01,
    }));
  }, [members]);

  const chartValueData = useMemo(() => {
    return members.map(el => ({
      id: el.member.id,
      name: get(el.member, 'displayName') || get(el.member, 'email', '').replace(/@.*$/, ''),
      y: el.valueSum || 0.1,
    }));
  }, [members]);

  if (isLoading || !isLoaded || !chartData || !chartValueData) {
    return <LoadingPage />;
  }
  if (!project.title) {
    return <NoMatch location={location} />;
  }

  return (
    <div className={classes.root}>
      <HiHeader hideSecond />

      <ProjectHead project={project} editProjectLink={`/projects/${project.id}/settings`} isAuth={isAuth} />
      <ProjectMetrics statistic={statistic} />
      <FollowProject project={project} />
      <div className={classes.sectionWrap}>
        <StatisticTablesTsx timeStatistic={chartData} worthPoints={chartValueData} userId={userId} />
      </div>
      <ProjectValues />
      <ProjectTeam members={get(members, 'list', [])} />
      <UsersActivity members={get(members, 'list', [])} project={project} />
      <AppBar key={'bottom'} position="static" component={'footer'}>
        <Toolbar className={classes.bottomBar}>
          <Typography variant="h6" color="inherit">
            Copyright &copy; Lorder
          </Typography>
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit" href={'https://t.me/joinchat/BmXj_kK5vnoAWdQF7tTc1g'} target={'_blank'}>
              <TelegramIco />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
