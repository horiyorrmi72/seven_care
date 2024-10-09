import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from 'src/DTO/auth.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async registerUser(registerDto: RegisterDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: registerDto.email });
            if (existingUser) {
                throw new ConflictException(`User already exists`);
            }
            const user = new this.userModel(registerDto);
            await user.save();
            // console.log(user);
            return user;

        } catch (error) {
            throw new BadRequestException(error.message || 'internal server error');
        }


    }


    async login(loginDto: LoginDto) {
        try {
            const user = await this.userModel.findOne({ email: loginDto.email });
            if (!user) throw new BadRequestException('Signup and login again.')
            //generate token for user and send the response to client

            //send response
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message || 'Internal Server Error');
        }
    }
}
