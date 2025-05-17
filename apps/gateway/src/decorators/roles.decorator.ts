/**
File Name : roles.decorator
Description : 역할 검사 데코레이터
Author : 이유민

History
Date        Author      Status      Description
2025.05.17  이유민      Created     
2025.05.17  이유민      Modified    역할 검사 기능 추가
*/
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
