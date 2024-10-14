export class RegisterDto {
    readonly name: string;
    readonly email: string;
    readonly username: string;
    readonly address: string;
    readonly password: string;
    readonly DOB: string;
    readonly allergies: string[];
    readonly current_medications: string[];
    readonly life_style: string;
    readonly emergency_contact: string;
}

export class LoginDto {
    readonly email: string;
    readonly password: string;
    userType: 'doctor' | 'user' ;
}