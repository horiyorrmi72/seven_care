import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { from } from "rxjs";
import { User,UserSchema } from "./users.schema";
import { Doctor, DoctorSchema } from "./doctors.schema";


export type AppointmentDocument = HydratedDocument<Appointments>;

interface AppointmentStatus {
    active: boolean;
    reason?: string;
}

@Schema()
export class Appointments {
    @Prop({
        required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'
    })
    patientId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
    doctorId: Types.ObjectId;

    @Prop({ required: true, type: Date })
    appointmentDate: Date;

    @Prop(raw({ active: { type: Boolean, default: false }, reason: { type: String } }))
    status: AppointmentStatus;  
}


export const AppointmentSchema = SchemaFactory.createForClass(Appointments)

