/**
File Name : auth.service
Description : Auth Server - Service
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
*/
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { UserRepository } from './repository/user.repository';
import { Auth } from '@app/entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async create({
    email,
    password,
    name,
    phone,
    role,
  }: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
  }): Promise<Auth> {
    const newUser = await this.userRepository.create({
      name,
      phone,
      role,
    });

    const user_id = newUser._id.toString();

    return this.authRepository.create({ email, password }, user_id);
  }

  async validateServiceUser(email: string, password: string): Promise<any> {
    const auth = await this.authRepository.findOneByEmail(email);

    if (!auth) throw new ForbiddenException('접근할 수 없습니다.');

    if (!(await bcrypt.compare(password, auth.password)))
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');

    const user = await this.userRepository.findOneById(auth.user_id);

    if (!user) throw new ForbiddenException();

    const payload = {
      user_id: auth.user_id,
      name: user.name,
      role: user.role,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async changeUserRole(user_id: string, role: string): Promise<object> {
    return this.userRepository.updateUserById(user_id, { role });
  }
}
