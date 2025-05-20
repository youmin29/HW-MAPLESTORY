/**
File Name : auth.controller
Description : Auth Server - Controller
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.15  이유민      Modified    코드 리팩토링
2025.05.17  이유민      Modified    코드 리팩토링
2025.05.20  이유민      Modified    유저 API 추가
*/
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { UserRepository } from './repository/user.repository';
import { InventoryRepository } from '@event/repositories/inventory.repository';
import { Inventory, InventorySchema } from '@app/entity/inventory.entity';
import { ItemRepository } from '@event/repositories/item.repository';
import { Item, ItemSchema } from '@app/entity/item.entity';
import { Auth, AuthSchema } from '@app/entity/auth.entity';
import { User, UserSchema } from '@app/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalServiceStrategy } from './strategies/local-service.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Item.name, schema: ItemSchema },
    ]),
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    InventoryRepository,
    ItemRepository,
    LocalServiceStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
