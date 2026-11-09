import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        if (!token) {
            return res.status(401).json({
                message: "unauthorized access",
                success: false
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "authentication is not configured",
                success: false
            })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch {
            return res.status(401).json({
                message: "invalid or expired token",
                success: false
            })
        }

        if (typeof decoded !== "object" || typeof decoded.userId !== "string") {
            return res.status(401).json({
                message: "invalid token",
                success: false
            })
        }

        const authenticatedUser = await User.findById(decoded.userId)
        if (!authenticatedUser) {
            return res.status(401).json({
                message: "unauthorized access",
                success: false
            })
        }

        req.user = authenticatedUser
        return next()
    } catch (error) {
        return res.status(500).json({
            message: "authentication failed",
            success: false
        })
    }
}

export default protect