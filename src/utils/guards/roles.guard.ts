import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    matchRoles(roles: string[], userRole: string): boolean {
        return roles.includes(userRole);
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;  
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role || !this.matchRoles(roles, user.role)) {
            throw new UnauthorizedException(`You do not have permission to perform this action,kindly contact the adminstrator for assistance.🟥`);
        }

        return true;
    }
}
