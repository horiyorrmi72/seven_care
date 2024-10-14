import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DoctorModule } from './doctor/doctor.module';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), MongooseModule.forRoot('mongodb://127.0.0.1:27017/seven_care'), JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: '5400s' } }),
    UserModule, AuthModule, DoctorModule, ],
  controllers: [AppController,],
  providers: [AppService],
})

export class AppModule { }


