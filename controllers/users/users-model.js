import mongoose from 'mongoose';
import usersSchema from './users-schema.js'
const usersModel = mongoose
    .model('usersModel', usersSchema);
export default usersModel;