import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
