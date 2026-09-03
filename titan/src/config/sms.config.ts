export const SMS_CONFIG = {
  PHONE_NUMBER  : process.env.SNS_TWILIO_PHONE_NUMBER, // Twilio에서 받은 번호
  ACCOUNT_SID : process.env.SNS_TWILIO_ACCOUNT_SID, // Twilio 계정 SID
  AUTH_TOKEN : process.env.SNS_TWILIO_AUTH_TOKEN, // Twilio 인증 토큰
}
