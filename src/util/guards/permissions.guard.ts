import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermissions } from '../../users/entities/user.entity';
import { database, IDatabase } from '../database/database';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private database: IDatabase;

  constructor(private readonly reflector: Reflector) {
    this.database = database;
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      UserPermissions[]
    >('permissions', [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = +request.params.id;
    const permissions = this.database.getPermissions(userId);

    const hasPermissions = requiredPermissions.every((permission) =>
      permissions.includes(permission),
    );

    if (!hasPermissions) {
      throw new ForbiddenException({
        success: false,
        errors: "This user don't have the required permissions",
      });
    }

    return true;
  }
}
