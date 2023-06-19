import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';

export interface IDatabase {
  data: User[];
  findOne(name: string): User | undefined;
  findAll(): User[];
  create(createUserDto: CreateUserDto): User;
  delete(name: string): boolean;
  update(name: string, updateUserDto: UpdateUserDto): User | undefined;
}

export const database: IDatabase = {
  data: [
    {
      id: 1,
      name: 'John Doe',
      job: 'Developer',
      count: 0,
    },
  ],

  /**
   * Returns a User object if the user with a matching name is found in the data array.
   *
   * @param {string} name - the name to search for in the data array
   * @return {User | undefined} - a User object if a match is found, undefined otherwise
   */
  findOne(name: string): User | undefined {
    const user = this.data.find((user) => user.name === name);
    if (user) {
      user.count++;
    }
    return user;
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
   * Deletes a user from the data array by matching the name.
   *
   * @param {string} name - The name of the user to delete.
   * @return {boolean} Returns true if the user was deleted successfully, false otherwise.
   */
  delete(name: string): boolean {
    const index = this.data.findIndex((user) => user.name === name);
    if (index !== -1) {
      this.data.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Updates a user's information and returns the updated user object.
   *
   * @param {string} name - The name of the user to update.
   * @param {UpdateUserDto} updateUserDto - An object containing the updated information for the user.
   * @return {User | undefined} The updated user object, or undefined if the user was not found.
   */
  update(name: string, updateUserDto: UpdateUserDto): User | undefined {
    const index = this.data.findIndex((user) => user.name === name);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updateUserDto };
      return this.data[index];
    }
    return undefined;
  },
};
