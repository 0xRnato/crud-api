import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { User, UserPermissions } from '../../users/entities/user.entity';

export interface IDatabase {
  data: User[];
  findById(id: number): User | undefined;
  findByName(name: string): User[] | undefined;
  findAll(): User[];
  getAccessCount(id: number): number;
  getPermissions(id: number): UserPermissions[];
  create(createUserDto: CreateUserDto): User;
  delete(id: number): boolean;
  update(id: number, updateUserDto: UpdateUserDto): User | undefined;
}

export const database: IDatabase = {
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

  /**
   * Finds a user in the data array by their ID and increments their count property if found.
   *
   * @param {number} id - The ID of the user to find.
   * @return {User | undefined} The user object if found, otherwise undefined.
   */
  findById(id: number): User | undefined {
    const user = this.data.find((user) => user.id === id);
    if (user) {
      user.count++;
    }
    return user;
  },

  /**
   * Searches for users with a given name and increments their count.
   *
   * @param {string} name - The name to search for.
   * @return {User[]|undefined} - An array of users matching the name or undefined if none are found.
   */
  findByName(name: string): User[] | undefined {
    const users = this.data.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase()),
    );
    if (users.length > 0) {
      users.forEach((user) => {
        user.count++;
      });
    }
    return users;
  },

  /**
   * Returns the access count for a user with the given id if found, otherwise undefined.
   *
   * @param {number} id - The id of the user to retrieve the access count for.
   * @return {number | undefined} The access count for the user with the given id, or undefined if no user is found.
   */
  getAccessCount(id: number) {
    const user = this.data.find((user) => user.id === id);
    return user ? user.access : undefined;
  },

  /**
   * Returns an array of user permissions for the given user ID.
   *
   * @param {number} id - The ID of the user to get permissions for.
   * @return {UserPermissions[]} An array of user permissions if the user is found,
   * otherwise an empty array.
   */
  getPermissions(id: number): UserPermissions[] {
    const user = this.data.find((user) => user.id === id);
    return user ? user.permissions : [];
  },

  /**
   * Returns all the elements in the 'User' array.
   *
   * @return {User[]} The array of all 'User' elements.
   */
  findAll(): User[] {
    return JSON.parse(JSON.stringify(this.data));
  },

  /**
   * Creates a new user and adds them to the data array.
   *
   * @param {CreateUserDto} createUserDto - An object containing the user's information.
   * @return {User} The newly created user object.
   */
  create(createUserDto: CreateUserDto): User {
    const id: number = this.data.length + 1;
    const newUser: User = { ...createUserDto, id, count: 0 };
    this.data.push(newUser);
    return newUser;
  },

  /**
   * Deletes an element from the array if it exists, given the id of the element.
   *
   * @param {number} id - The id of the element to delete.
   * @return {boolean} Returns true if the element was deleted. Else, returns false.
   */
  delete(id: number): boolean {
    const index = this.data.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Updates a user with the given id using the information in the provided UpdateUserDto.
   *
   * @param {number} id - The id of the user to update.
   * @param {UpdateUserDto} updateUserDto - The data to update for the user.
   * @return {User | undefined} The updated user if the id is found, otherwise undefined.
   */
  update(id: number, updateUserDto: UpdateUserDto): User | undefined {
    const index = this.data.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updateUserDto };
      return this.data[index];
    }
    return undefined;
  },
};
