const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6

    },

})

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
