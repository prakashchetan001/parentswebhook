const { sendEmail } = require("./helpers/sendEmail");
const {readMapFromFile, writeMapToFile, generateUniqueCode} = require("./helpers/utils");

const sendCodeToTeacher = (associatedTeachersEmails) => {
    const teacherEmailToUniqueCode = readMapFromFile();
    for( const email of associatedTeachersEmails) {
        if(teacherEmailToUniqueCode.size === 0 || !teacherEmailToUniqueCode.has(email))
        {
            const newCode = generateUniqueCode();

            teacherEmailToUniqueCode.set(email,newCode);
            writeMapToFile(teacherEmailToUniqueCode);

            const emailContent = {
              subject: "This is your unique code for Parental Consent",
              plainText: `Hi, This is your unique code to provide teacher consent ${newCode}.`+
              `We have verified that user is indeed a parent, you just need to share this code if any parent reaches out to you.`+
              `Once parent shares this code with us, we will add them as official parent in Microsoft systems.`
            }

            sendEmail(email,emailContent);
        }
    }
}

module.exports = {
    sendCodeToTeacher
  };