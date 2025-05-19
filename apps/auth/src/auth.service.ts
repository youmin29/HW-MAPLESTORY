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
2025.05.19  이유민      Modified    코드 리팩토링
*/
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { UpdateUserRoleDto } from '@app/dto';

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
      const isEmail = await this.authRepository.findOneByEmail(email);
      if (isEmail) throw new ConflictException('이미 사용 중인 이메일입니다.');

      await session.withTransaction(async () => {
        const newUser = await this.userRepository.create(
          {
            name,
            phone,
            role,
          },
          session,
        );

        const user_id = new Types.ObjectId(newUser._id);

        await this.authRepository.create({ email, password, user_id }, session);
      });
      return { message: '회원가입이 성공적으로 완료되었습니다.' };
    } catch (error) {
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
      user_id: auth.user_id.toString(),
      name: user.name,
      role: user.role,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async changeUserRole(updateDto: UpdateUserRoleDto) {
    const { user_id, role } = updateDto;
    const ObjectUserId = new Types.ObjectId(user_id);

    const isUser = await this.userRepository.findOneById(ObjectUserId);
    if (!isUser) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    await this.userRepository.updateUserById(ObjectUserId, {
      role,
    });

    return { message: '수정되었습니다.' };
  }
}
