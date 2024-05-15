import { Document, model, Schema} from 'mongoose';

import { UserType } from '../../types/index.js';

export interface UserDocument extends UserType, Document {
  createdAt: Date,
  updatedAt: Date
}

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    required: true,
  },
  avatarPath: {
    type: String,
    required: true,
    minLength: [5, 'Min length for avatar path is 5']
  },
  firstname: {
    type: String,
    required: true,
    minLength: [2, 'Min length for avatar path is 2']
  },
  lastname: String
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', userSchema);
