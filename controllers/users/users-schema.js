import mongoose from 'mongoose';
const schema = mongoose.Schema({
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user"],
    },
    blocked: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    dob: String,
    email: String,
    createdAt: { type: Date, default: Date.now },
    bookmarks: [{
        movieId: {
            type: String,
            required: true
        },
        movieCover: {
            type: String,
            required: true
        }
    }],
    followers: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        username: String
    }],
    following: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        username: String
    }],
}, {collection: 'users'});
export default schema;