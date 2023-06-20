import { IsArray, IsOptional, IsString } from 'class-validator';
import { UserPermissions } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  job?: string;

  @IsOptional()
  @IsArray()
  permissions: UserPermissions[];
}
