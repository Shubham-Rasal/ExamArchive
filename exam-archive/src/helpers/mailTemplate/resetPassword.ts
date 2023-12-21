const resetPasswordMail = (resetLink: string) => {
  const subject = "Password Reset Instructions";
  const html = `<p>Dear Sir/Ma'am,</p>
    <br />
    <p>We have received a request to reset your password. If you did not initiate this request, please ignore this email.</p>
    <p>To proceed with the password reset, <a href=${resetLink}>click on the following link</a></p>
    <br />
    <p>Thank You,</p>
    <p>Team Exam Archive</p>`;

  return { subject, html };
};

export default resetPasswordMail;
