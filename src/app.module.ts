import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';



@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `${process.env.NODE_ENV}.env`,
    isGlobal: true,
  }), MongooseModule.forRoot(process.env.db_uri), JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: '5400s' } }),
    UserModule, AuthModule, DoctorModule, AppointmentModule,],
  controllers: [AppController,],
  providers: [AppService],
})

export class AppModule { }


