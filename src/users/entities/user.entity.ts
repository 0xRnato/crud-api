export class User {
  id: number;
  name: string;
  job: string;
  count: number;
  permissions: UserPermissions[];
}

export enum UserPermissions {
  Delete = 'delete',
  Update = 'update',
}
