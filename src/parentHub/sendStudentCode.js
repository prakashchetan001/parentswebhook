const { studentCodeMapping, generateUniqueCode } = require("./helpers/utils");
const { sendEmail } = require("./helpers/sendEmail");

const sendCodeToStudent = (studentEmail) => {
    const otp = generateUniqueCode();
    studentCodeMapping.set(studentEmail, otp);

    const emailContent = {
        subject: `OTP for School Connection App Onboarding : ${otp}`,
        plainText: `Hi, This is your unique code to onboard to school connection app ${otp}. This will expire in 10 minutes.`
      }

      sendEmail(studentEmail, emailContent);
}

module.exports = {
    sendCodeToStudent
};