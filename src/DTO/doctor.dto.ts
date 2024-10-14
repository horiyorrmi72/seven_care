export class DoctorDTO {
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly department: string;
    readonly designation: string;
    readonly joinedOn: string;
    readonly role: string;
    readonly leftOn: string;
    readonly active: string;
}

export class updateDoctorsDataDto {
    name?: string;
    email?: string;
    password?: string;
    department?: string;
    designation?: string;
    joinedOn?: string;
    leftOn?: string;
    active?: string;
}