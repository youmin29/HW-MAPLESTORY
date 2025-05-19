import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { RequestController } from './controllers/request.controller';
import { RequestService } from './services/request.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 3,
        },
      ],
    }),
    HttpModule,
  ],
  controllers: [
    AuthController,
    GroupController,
    EventController,
    RequestController,
  ],
  providers: [
    AuthService,
    GroupService,
    EventService,
    RequestService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class GatewayModule {}
