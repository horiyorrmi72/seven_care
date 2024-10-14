export class MedicalHistoryDto {
    readonly allergies?: string[];
    readonly current_medications?: string[];
}

export class UpdateUserDto {
    readonly phoneNumber?: string;
    readonly name?: string;
    readonly medical_history?: MedicalHistoryDto;
}
