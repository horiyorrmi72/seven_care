import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from 'src/DTO/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }
}

