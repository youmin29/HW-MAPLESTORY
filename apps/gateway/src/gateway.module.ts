import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    HttpModule,
  ],
  controllers: [AuthController, EventController],
  providers: [AuthService, EventService, JwtStrategy],
})
export class GatewayModule {}
