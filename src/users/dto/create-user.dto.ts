import { IsArray, IsDefined, IsString } from 'class-validator';
import { UserPermissions } from '../entities/user.entity';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  job: string;

  @IsDefined()
  @IsArray()
  permissions: UserPermissions[];
}
