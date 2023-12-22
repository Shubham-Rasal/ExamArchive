import nodemailer from "nodemailer";

const sendMail = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  const {
    NODEMAILER_HOST,
    NODEMAILER_PORT,
    NODEMAILER_USER,
    NODEMAILER_PASSWORD,
  } = process.env;

  if (
    !NODEMAILER_PORT ||
    !NODEMAILER_USER ||
    !NODEMAILER_PASSWORD ||
    !NODEMAILER_HOST
  ) {
    console.log(
      "Some of the essential environment variables for Nodemailer missing"
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: NODEMAILER_HOST,
    port: Number(NODEMAILER_PORT),
    secure: process.env.NODE_ENV === "production",
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: NODEMAILER_USER,
    to: email,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions) as any
    console.log(`Email sent: ${info.response}`);
    return true;
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
};

export default sendMail;
