import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DoctorDocument = HydratedDocument<Doctor>;
@Schema({ timestamps: true })
export class Doctor {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    email: string;

    @Prop({ required: true, trim: true })
    designation: string;

    @Prop({ required: true, trim: true })
    department: string;

    @Prop({ required: true, trim: true, default: 'doctor' })
    role: string;

    @Prop({ required: true, trim: true })
    password: string;

    @Prop({ type: Date, required: true, trim: true })
    joinedOn: Date

    @Prop({ type: Date, default: null })
    leftOn: Date | null;

    @Prop({ type: Boolean, required: true, default: false })
    active: boolean;

    @Prop({ required: true, default: true }) 
    isFirstLogin: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
