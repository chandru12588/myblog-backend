import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async(req,res)=>{
    const {email,password} = req.body;
    const hash = await bcrypt.hash(password,10);

    const user = await User.create({email,password:hash});
    res.json("Registered");
}

export const login = async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.json("Invalid user");

    const valid = await bcrypt.compare(password,user.password);
    if(!valid) return res.json("Wrong Password");

    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);
    res.json({token});
}
