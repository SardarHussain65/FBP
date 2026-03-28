const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // Don't include password in queries by default

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

UserSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})

UserSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.password);
}

const User = mongoose.model("User", UserSchema)

module.exports = User
