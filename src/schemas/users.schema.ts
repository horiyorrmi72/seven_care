import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true, unique: true })
    email: string;

    @Prop({ required: true, trim: true })
    username: string;

    @Prop({ required: true, minlength: 6 })
    password: string;

    @Prop({ trim: true })
    address: string;

    @Prop({ type: Date })
    DOB: Date;

    @Prop(raw({
        allergies: { type: [String] },
        current_medications: { type: [String] },
        life_style: { type: String },
        emergency_contact: { type: String },
    }))
    medical_history: {
        allergies: string[],
        current_medications: string[],
        life_style: string,
        emergency_contact: string

    }
}

export const UserSchema = SchemaFactory.createForClass(User);
