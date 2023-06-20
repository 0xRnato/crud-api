import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';

export interface IDatabase {
  data: User[];
  findById(id: number): User | undefined;
  findByName(name: string): User[] | undefined;
  findAll(): User[];
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
