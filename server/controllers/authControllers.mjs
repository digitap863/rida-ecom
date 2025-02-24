import "dotenv/config"
import jwt from "jsonwebtoken"






const adminCredentials = {
    adminid: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
};
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body.data;

        if (email && password) {
            if (adminCredentials.adminid !== email) {
                return res
                    .status(401)
                    .send({ message: "Invalid Credentials", success: false });
            }
            if (adminCredentials.password !== password) {
                return res
                    .status(401)
                    .send({ message: "Invalid Password", success: false });
            }
            const token = jwt.sign(
                { id: adminCredentials.adminid, role: "admin" },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d",
                }
            );

            res
                .status(200)
                .send({ message: "login successful", success: true, token });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message, success: false });
    }
};





