/**
File Name : roles.guard
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    역할 검사 기능 추가
2025.05.18  이유민      Modified    에러 status code 및 메세지 수정
*/
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@app/entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
    }

    return true;
  }
}
