import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  cardsWrap: {
    '& > div': {
      margin: '15px 0',
    },
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  container: {
    margin: '0 auto',
    maxWidth: 1360,
    padding: '0 10px',
  },
}));
