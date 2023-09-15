const { studentCodeMapping, generateUniqueCode } = require("./helpers/utils");
const { sendEmail } = require("./helpers/sendEmail");

const sendCodeToStudent = (studentEmail) => {
    const otp = generateUniqueCode();
    studentCodeMapping.set(studentEmail, otp);

    const emailContent = {
        subject: "OTP for School Connection App Onboarding",
        plainText: `Hi, This is your unique code to onboard to school connection app ${otp}.`
      }

      sendEmail(studentEmail, emailContent);
}

module.exports = {
    sendCodeToStudent
};