import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/DTO/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }

    @Post('signin')
    signIn(@Body() loginDto: LoginDto) {
        if (!loginDto) {
            throw new BadRequestException('all inputs are required.');

        }
        return this.authService.login(loginDto);

    }
}

