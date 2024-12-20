import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { User } from 'src/schemas/users.schema';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/DTO/user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('users')
    getUsers() {
        return this.userService.getUsers();
    }

    @Get('profile/:id')
    getUserProfile(@Param('id') id: string) {
        if (!id) { throw new BadRequestException('No user with the provided data found!') }
        return this.userService.getUserProfile(id);
    }

    @Patch('profile/:id')
    updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUserDetails(id, updateUserDto);
    }

}