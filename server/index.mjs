import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors"
import nodemailer from "nodemailer"
import axios from "axios"
import { dbConnect } from "./config/db.mjs";
import adminRouter from "./routes/adminRoutes.mjs";
import clientRouter from "./routes/clientRoutes.mjs";
const app = express();
const port = process.env.PORT || 8080;



app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));
app.use("/api/uploads", express.static("uploads"));



dbConnect()
app.use("/api/admin", adminRouter)
app.use("/api", clientRouter)

//contact us mail service
app.post("/api/contact", async (req, res) => {


    const { email, name, phone, message, recaptchaToken } = req.body;

    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPCHE}&response=${recaptchaToken}`);
    if (!response.data.success) {
        return res.status(400).send({ success: false, message: 'reCAPTCHA verification failed' });
    }

    const html = `
  <div style="font-family: Arial, sans-serif;">
      <h1 style="color: #333; font-size: 24px;">Contact Us</h1>
      <table style="width: 100%; border-collapse: collapse; font-size: 18px;">
          <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">Phone</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd;">Message</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
          </tr>
      
      </table>
  </div>
`;

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PWD,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: "",
            subject: `🚨 URGENT: Please Call ${name} ASAP 🚨`,
            html: html,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
                res
                    .status(200)
                    .send({ message: "Our Team will contact you soon.", success: true });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message, success: false });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});