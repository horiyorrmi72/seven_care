import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class AppointmentStatusDto {
    @IsBoolean()
    active: boolean;

    @IsString()
    reasons: string;
}


export class createAppointmentDTO {
    @IsNotEmpty()
    @IsString()
    patientId: string;

    @IsNotEmpty()
    @IsString()
    doctorId: string;

    @IsNotEmpty()
    @IsDateString()
    appointmentDate: string;

    @IsOptional()  
    status?: AppointmentStatusDto;
}

export class updateAppointmentDTO {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsOptional() 
    @IsString()
    patientId?: string;

    @IsOptional() 
    @IsString()
    doctorId?: string;

    @IsOptional() 
    @IsDateString()
    appointmentDate?: string;

    @IsOptional()
    status?: AppointmentStatusDto;
}
