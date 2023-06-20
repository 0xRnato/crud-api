import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPermissions } from './entities/user.entity';
import { IDatabase } from '../util/database/database';

describe('UsersService', () => {
  let service: UsersService;
  let mockDatabase: IDatabase;

  beforeEach(() => {
    mockDatabase = {
      data: [
        {
          id: 1,
          name: 'John Doe',
          job: 'Developer',
          count: 0,
          permissions: [UserPermissions.Update, UserPermissions.Delete],
        },
        {
          id: 2,
          name: 'Jane Doe',
          job: 'Designer',
          count: 0,
          permissions: [],
        },
      ],
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      getAccessCount: jest.fn(),
      getPermissions: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };
    service = new UsersService();
    service['database'] = mockDatabase;
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        name: 'Alice',
        job: 'Engineer',
        permissions: [],
      };
      const newUser = {
        id: 3,
        name: 'Alice',
        job: 'Engineer',
        count: 0,
        permissions: [],
      };
      const mockCreate = jest
        .spyOn(mockDatabase, 'create')
        .mockReturnValue(newUser);

      const result = service.create(createUserDto);

      expect(result).toEqual(newUser);
      expect(mockCreate).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users when no name is specified', () => {
      const users = [
        {
          id: 1,
          name: 'John Doe',
          job: 'Developer',
          count: 0,
          permissions: [UserPermissions.Update, UserPermissions.Delete],
        },
        {
          id: 2,
          name: 'Jane Doe',
          job: 'Designer',
          count: 0,
          permissions: [],
        },
      ];
      const mockFindAll = jest
        .spyOn(mockDatabase, 'findAll')
        .mockReturnValue(users);

      const result = service.findAll();

      expect(result).toEqual(users);
      expect(mockFindAll).toHaveBeenCalled();
    });

    it('should return users with matching name when name is specified', () => {
      const name = 'Doe';
      const users = [
        {
          id: 1,
          name: 'John Doe',
          job: 'Developer',
          count: 0,
          permissions: [UserPermissions.Update, UserPermissions.Delete],
        },
        {
          id: 2,
          name: 'Jane Doe',
          job: 'Designer',
          count: 0,
          permissions: [],
        },
      ];
      const mockFindByName = jest
        .spyOn(mockDatabase, 'findByName')
        .mockReturnValue(users);

      const result = service.findAll(name);

      expect(result).toEqual(users);
      expect(mockFindByName).toHaveBeenCalledWith(name);
    });
  });

  describe('findById', () => {
    it('should return the user with the specified ID', () => {
      const id = 1;
      const user = {
        id: 1,
        name: 'John Doe',
        job: 'Developer',
        count: 0,
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      };
      const mockFindById = jest
        .spyOn(mockDatabase, 'findById')
        .mockReturnValue(user);

      const result = service.findById(id);

      expect(result).toEqual(user);
      expect(mockFindById).toHaveBeenCalledWith(id);
    });

    it('should increment the count property of the user with the specified ID', () => {
      const id = 1;
      const user = {
        id: 1,
        name: 'John Doe',
        job: 'Developer',
        count: 0,
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      };
      const mockFindById = jest
        .spyOn(mockDatabase, 'findById')
        .mockReturnValue({ ...user, count: 1 });

      const result = service.findById(id);

      expect(result.count).toBe(1);
      expect(mockFindById).toHaveBeenCalledWith(id);
    });
  });

  describe('findAccess', () => {
    it('should return the access count for the user with the specified ID', () => {
      const id = 1;
      const accessCount = 5;
      const mockGetAccessCount = jest
        .spyOn(mockDatabase, 'getAccessCount')
        .mockReturnValue(accessCount);

      const result = service.findAccess(id);

      expect(result).toBe(accessCount);
      expect(mockGetAccessCount).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update the user with the specified ID', () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'John Doe Jr.',
        job: 'Senior Developer',
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      };
      const updatedUser = {
        id: 1,
        name: 'John Doe Jr.',
        job: 'Senior Developer',
        count: 0,
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      };
      const mockUpdate = jest
        .spyOn(mockDatabase, 'update')
        .mockReturnValue(updatedUser);

      const result = service.update(id, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUpdate).toHaveBeenCalledWith(id, updateUserDto);
    });

    it('should throw NotFoundException if the user with the specified ID is not found', () => {
      const id = 3;
      const updateUserDto: UpdateUserDto = {
        name: 'John Doe Jr.',
        job: 'Senior Developer',
        permissions: [UserPermissions.Update, UserPermissions.Delete],
      };
      const mockUpdate = jest
        .spyOn(mockDatabase, 'update')
        .mockReturnValue(undefined);

      expect(() => {
        service.update(id, updateUserDto);
      }).toThrow(NotFoundException);
      expect(mockUpdate).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove the user with the specified ID', () => {
      const id = 1;
      const mockDelete = jest
        .spyOn(mockDatabase, 'delete')
        .mockReturnValue(true);

      const result = service.remove(id);

      expect(result).toBeUndefined();
      expect(mockDelete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if the user with the specified ID is not found', () => {
      const id = 3;
      const mockDelete = jest
        .spyOn(mockDatabase, 'delete')
        .mockReturnValue(false);

      expect(() => {
        service.remove(id);
      }).toThrow(NotFoundException);
      expect(mockDelete).toHaveBeenCalledWith(id);
    });
  });
});
