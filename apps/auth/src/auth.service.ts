/**
File Name : auth.service
Description : Auth Server - Service
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.18  이유민      Modified    트랙잭션 추가
2025.05.18  이유민      Modified    에러 status code 및 메세지 수정
*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
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
  }) {
    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const newUser = await this.userRepository.create(
          {
            name,
            phone,
            role,
          },
          session,
        );

        const user_id = newUser._id.toString();

        await this.authRepository.create({ email, password }, user_id, session);
      });
      await session.commitTransaction();
      return;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async validateServiceUser(email: string, password: string): Promise<any> {
    const auth = await this.authRepository.findOneByEmail(email);

    if (!auth)
      throw new UnauthorizedException(
        '입력한 이메일 또는 비밀번호가 올바르지 않습니다.',
      );

    if (!(await bcrypt.compare(password, auth.password)))
      throw new UnauthorizedException(
        '입력한 이메일 또는 비밀번호가 올바르지 않습니다.',
      );

    const user = await this.userRepository.findOneById(auth.user_id);

    if (!user)
      throw new UnauthorizedException(
        '입력한 이메일 또는 비밀번호가 올바르지 않습니다.',
      );

    const payload = {
      user_id: auth.user_id,
      name: user.name,
      role: user.role,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async changeUserRole(user_id: string, role: string) {
    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        return this.userRepository.updateUserById(user_id, { role }, session);
      });
      await session.commitTransaction();
      return { message: '수정되었습니다.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
