import map from 'lodash-es/map';
import { IUser, User } from '../../users';

export interface IMember {
  accessLevel: number;
  status: boolean;
  member: IUser;
}

export class Member implements IMember {
  public accessLevel: number;
  public status: boolean;
  public member: IUser;

  constructor(initial?: object) {
    map(initial, (val: any, key: string) => {
      if (key === 'member') {
        this.member = new User(val);
      } else {
        this[key] = val;
      }
    });
  }
}
