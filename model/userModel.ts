import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface Idate {
    name: string;
    email: string;
    password: string;
     OTP: string;

   token: string;
  verified: boolean;
  matchPassword(enterpassword: string): Promise<boolean>;
  _doc:any

}

interface UserData extends Idate, mongoose.Document{ }

const userModel = new mongoose.Schema({
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    OTP: {
      type: String,
    },

    token: {
      type: String,
    },

    verified: {
      type: Boolean,
    },
    
},
    {timestamps:true}
)

userModel.methods.matchPassword = async function (enterpassword: any) {
     return await bcrypt.compare(enterpassword, this.password)
}
    


userModel.pre('save', async function (this:UserData, next:any) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt: string = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<UserData>("users", userModel)

