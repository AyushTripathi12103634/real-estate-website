import usermodel from "../models/usermodel.js";
import { hashPassword, comparePassword } from "../helpers/authhelper.js";
import JWT, {decode} from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required",
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: "Password is required",
            });
        }
        if (!phone) {
            return res.status(400).send({
                success: false,
                message: "Phone is required",
            });
        }
        if (role === undefined || role === null) {
            return res.status(400).send({
                success: false,
                message: "Role is required",
            });
        }        

        const hashed_password = await hashPassword(password);

        const exist_email = await usermodel.findOne({ email: email });
        if (exist_email) {
            return res.status(409).send({
                success: false,
                message: "User already exists",
            });
        }

        const exist_phone = await usermodel.findOne({ phone: phone });
        if (exist_phone) {
            return res.status(409).send({
                success: false,
                message: "Phone already exists",
            });
        }

        try {
            const user = await new usermodel({
                name: name,
                email: email,
                phone: phone,
                role: role,
                password: hashed_password,
            }).save();
            return res.status(201).send({
                success: true,
                message: "user registered successfully",
                user,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed to create user",
                error: error,
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in register API",
            error: error,
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: "Password is required",
            });
        }
        const user = await usermodel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "No User found",
            });
        }
        const result = await comparePassword(password, user.password);
        if (result) {
            const token = JWT.sign(
                {
                    id: user._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            return res.status(200).send({
                success: true,
                message: "Logged in successfully",
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                token,
            });
        } else {
            return res.status(401).send({
                success: false,
                message: "Invalid Password",
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Failed to login",
        });
    }
};

export const changepasswordController = async(req, res) =>{
    try {
        const {email,password,new_password} = req.body;
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: "Password is required",
            });
        }
        const user = await usermodel.findOne({email:email});
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "No User found",
            });
        }
        
        const result = await comparePassword(password, user.password);
        if (result) {
            user.password = await hashPassword(new_password);
            await user.save();
            return res.status(200).send({
                success: true,
                message: "Password updated successfully",
            });
        } else {
            return res.status(401).send({
                success: false,
                message: "Invalid Password",
            });
        }
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"Error in change password controller"
        })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, new_pass } = req.body;
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "No User found",
            });
        }
        user.pass = await hashPassword(new_pass);
        await user.save();
        return res.status(200).send({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Failed to send reset token",
        });
    }
};

export const editProfileController = async (req, res) => {
    try {
        const { name, phone, identification, role } = req.body;
        const userId = decode(req.headers.authorization).id;
        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (identification) updates.identification = identification;
        if (role) updates.role = role;
        const user = await usermodel.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "No User found",
            });
        }
        return res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Failed to update profile",
        });
    }
};
