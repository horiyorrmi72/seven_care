import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from 'src/DTO/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtStrategy: JwtService) { }

    async registerUser(registerDto: RegisterDto) {
        try {
            const existingUser = await this.userModel.findOne({ email: registerDto.email });
            if (existingUser) {
                throw new ConflictException(`User already exists`);
            }
            const { password } = registerDto;
            const hashPassword = await bcrypt.hash(password, 12);
            const user = new this.userModel({ ...registerDto, password: hashPassword });
            await user.save();
            // console.log(user);
            return user;

        } catch (error) {
            throw new BadRequestException(error.message || 'internal server error');
        }


    }


    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;
            const user = await this.userModel.findOne({ email: loginDto.email });
            if (!user) { throw new BadRequestException('Signup and login again.'); }
            const isPassMatch = await bcrypt.compare(password, user.password);
            if (!isPassMatch) {
                throw new UnauthorizedException('Invalid data provided, kindly verify the provided credentials.')
            }

            const userId = { id: user._id };
            return {
                userName: user.username,
                token: await this.jwtStrategy.signAsync(userId)
            }
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException(error.message || 'Internal Server Error');
        }
    }
}
