import { cloneDeep } from 'lodash';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { UserPermissions } from '../../users/entities/user.entity';
import { IDatabase, database } from './database';

describe('database', () => {
  let db: IDatabase;

  beforeEach(() => {
    db = cloneDeep(database);
  });

  afterEach(() => {
    db = null;
  });

  describe('findById', () => {
    it('should return the user if found and increment the count', () => {
      const user = db.findById(1);
      expect(user).toEqual({
        id: 1,
        name: 'John Doe',
        job: 'Developer',
        count: 1,
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      });
    });

    it('should return undefined if user is not found', () => {
      const user = db.findById(3);
      expect(user).toBeUndefined();
    });
  });

  describe('findByName', () => {
    it('should return users with matching names and increment the count', () => {
      const users = db.findByName('john');
      expect(users.length).toBe(1);
      expect(users[0]).toEqual({
        id: 1,
        name: 'John Doe',
        job: 'Developer',
        count: 1,
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      });
    });

    it('should return an empty array if no users are found', () => {
      const users = db.findByName('unknown');
      expect(users.length).toBe(0);
    });
  });

  describe('findAll', () => {
    it('should return a copy of all users in the data array', () => {
      const users = db.findAll();
      expect(users.length).toBe(2);
      expect(users[0]).toEqual({
        id: 1,
        name: 'John Doe',
        job: 'Developer',
        count: 0,
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      });
      expect(users[1]).toEqual({
        id: 2,
        name: 'Jane Doe',
        job: 'Designer',
        count: 0,
        permissions: [],
      });
    });

    it('should not modify the original data array', () => {
      const users = db.findAll();
      users[0].name = 'Modified Name';
      expect(db.data[0].name).toBe('John Doe');
    });
  });

  describe('create', () => {
    it('should create a new user and add them to the data array', () => {
      const createUserDto: CreateUserDto = {
        name: 'Jane Smith',
        job: 'Designer',
        permissions: [],
      };
      const newUser = db.create(createUserDto);
      expect(newUser).toEqual({
        id: 3,
        name: 'Jane Smith',
        job: 'Designer',
        count: 0,
        permissions: [],
      });
      expect(db.data.length).toBe(3);
      expect(db.data[2]).toBe(newUser);
    });
  });

  describe('delete', () => {
    it('should delete the user with the specified id', () => {
      const result = db.delete(1);
      expect(result).toBe(true);
      expect(db.data.length).toBe(1);
    });

    it('should return false if the user to delete is not found', () => {
      const result = db.delete(3);
      expect(result).toBe(false);
      expect(db.data.length).toBe(2);
    });
  });

  describe('update', () => {
    it('should update the user with the specified id', () => {
      const updateUserDto: UpdateUserDto = {
        job: 'Architect',
        permissions: [],
      };
      const updatedUser = db.update(1, updateUserDto);
      expect(updatedUser).toEqual({
        id: 1,
        name: 'John Doe',
        job: 'Architect',
        count: 0,
        permissions: [],
      });
      expect(db.data[0]).toBe(updatedUser);
    });

    it('should return undefined if the user to update is not found', () => {
      const updateUserDto: UpdateUserDto = {
        job: 'Architect',
        permissions: [],
      };
      const updatedUser = db.update(3, updateUserDto);
      expect(updatedUser).toBeUndefined();
    });
  });
});
