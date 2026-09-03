export const MAIL_CONFIG = {
  HOST: process.env.HOST,                                       // SMTP 서버 (ex: 'smtp.naver.com')
  PORT: Number(process.env.PORT),                                                    // SMTP 포트 정보
  SECURE: false,                                                // true: SSL 사용, false: STARTTLS 사용
  USER: process.env.USER,                                          // 발신 아이디 혹은 발신 이메일
  PASS: process.env.PASS,                                               // 이메일 비밀번호 또는 앱 비밀번호 (naver의 경우에 2단계 인증이 있다면 앱 비밀번호를 발급받아야 한다.)
  FROM: process.env.FROM, //'"NestJS Default Mail" <titanUser@naver.com>'         // 기본 발신자
} as const