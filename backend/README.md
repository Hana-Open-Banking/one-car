# OneCAR - 금융결제원 오픈뱅킹 회원가입 시스템

## 프로젝트 개요

OneCAR는 금융결제원(KFTC) 오픈뱅킹을 연동한 사용자 회원가입 시스템입니다.
사용자는 이름, 주민등록번호, 휴대폰번호를 입력하고 CoolSMS를 통한 본인인증을 거쳐 회원가입할 수 있으며,
KFTC 오픈뱅킹과 연동하여 액세스 토큰을 발급받을 수 있습니다.

## 주요 기능

1. **사용자 회원가입**
   - 이름, 주민등록번호, 휴대폰번호 입력
   - 중복 가입 방지

2. **휴대폰 본인인증**
   - CoolSMS를 통한 SMS 인증
   - 6자리 인증번호 발송 및 확인

3. **KFTC 오픈뱅킹 연동**
   - OAuth 2.0 인증 플로우
   - Access Token 발급 및 저장

## 기술 스택

- Java 17
- Spring Boot 3.5.3
- Spring Data JPA
- H2 Database (개발용)
- Oracle Database (운영용)
- CoolSMS SDK
- WebFlux (HTTP Client)
- Swagger OpenAPI 3

## 환경 설정

### 방법 1: 프로파일별 설정 파일 (추천)

1. `src/main/resources/application-local.yml` 파일 생성:
```yaml
coolsms:
  api-key: "your-actual-coolsms-api-key"
  api-secret: "your-actual-coolsms-api-secret"
  from-number: "01012345678"

kftc:
  client-id: "your-actual-kftc-client-id"
  client-secret: "your-actual-kftc-client-secret"
```

2. 프로파일 지정해서 실행:
```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```

### 방법 2: IDE 설정

**IntelliJ IDEA:**
1. Run/Debug Configurations 열기
2. Environment variables에 추가:
   - `COOLSMS_API_KEY=your-api-key`
   - `COOLSMS_API_SECRET=your-api-secret`
   - `COOLSMS_FROM_NUMBER=01012345678`
   - `KFTC_CLIENT_ID=your-client-id`
   - `KFTC_CLIENT_SECRET=your-client-secret`

### 방법 3: 실행 시 파라미터

```bash
./gradlew bootRun --args='--coolsms.api-key=your-api-key --coolsms.api-secret=your-secret --coolsms.from-number=01012345678 --kftc.client-id=your-client-id --kftc.client-secret=your-client-secret'
```

### 방법 4: 환경변수 설정

```bash
# CoolSMS 설정
export COOLSMS_API_KEY="your-coolsms-api-key"
export COOLSMS_API_SECRET="your-coolsms-api-secret"
export COOLSMS_FROM_NUMBER="your-sender-phone-number"

# KFTC 오픈뱅킹 설정
export KFTC_CLIENT_ID="your-kftc-client-id"
export KFTC_CLIENT_SECRET="your-kftc-client-secret"
```

### 애플리케이션 실행

```bash
./gradlew bootRun
```

애플리케이션은 `http://localhost:8081`에서 실행됩니다.

## API 사용법

### 1. 휴대폰 인증 코드 발송

```bash
POST /api/phone-verification/send
Content-Type: application/json

{
  "phoneNumber": "01012345678"
}
```

### 2. 휴대폰 인증 코드 확인

```bash
POST /api/phone-verification/verify
Content-Type: application/json

{
  "phoneNumber": "01012345678",
  "verificationCode": "123456"
}
```

### 3. 사용자 회원가입

```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "홍길동",
  "socialSecurityNumber": "1234567890123",
  "phoneNumber": "01012345678"
}
```

**응답:**
```json
{
  "status": 200,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "userId": 1,
    "name": "홍길동",
    "phoneNumber": "01012345678",
    "phoneVerified": true,
    "userSeqNo": null,
    "accessToken": null,
    "kftcAuthUrl": "http://localhost:8080/oauth2.0/authorize?response_type=code&client_id=...&redirect_uri=..."
  }
}
```

**이제 회원가입과 동시에 KFTC 인증 URL이 제공됩니다!** 사용자는 `kftcAuthUrl`로 이동하여 KFTC 오픈뱅킹 인증을 진행하면 됩니다.

### 4. KFTC 오픈뱅킹 연동 (선택사항)

별도로 KFTC 연동 URL을 요청하고 싶다면:

```bash
POST /api/users/{userId}/connect-kftc
```

**응답:**
```json
{
  "status": 200,
  "message": "KFTC 인증 URL이 생성되었습니다.",
  "data": "http://localhost:8080/oauth2.0/authorize?response_type=code&client_id=...&redirect_uri=..."
}
```

### 5. 사용자 정보 조회

```bash
GET /api/users/{userId}
```

**KFTC 연동 완료된 경우:**
```json
{
  "status": 200,
  "message": "사용자 정보 조회 성공",
  "data": {
    "userId": 1,
    "name": "홍길동",
    "phoneNumber": "01012345678",
    "phoneVerified": true,
    "userSeqNo": "U123456789",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "kftcAuthUrl": null
  }
}
```

**KFTC 연동이 안 된 경우:**
```json
{
  "status": 200,
  "message": "사용자 정보 조회 성공",
  "data": {
    "userId": 1,
    "name": "홍길동",
    "phoneNumber": "01012345678",
    "phoneVerified": true,
    "userSeqNo": null,
    "accessToken": null,
    "kftcAuthUrl": "http://localhost:8080/oauth2.0/authorize?response_type=code&client_id=..."
  }
}
```

## OAuth 콜백 처리

KFTC 오픈뱅킹 인증 완료 후 자동으로 `/oauth/callback` 엔드포인트로 콜백됩니다.
이때 자동으로 액세스 토큰이 발급되어 사용자 정보에 저장됩니다.

## Swagger UI

API 문서는 다음 URL에서 확인할 수 있습니다:
- http://localhost:8081/swagger-ui/index.html

## 개발 참고사항

1. **휴대폰 인증**: 회원가입 전에 반드시 휴대폰 인증을 완료해야 합니다.
2. **KFTC 연동**: 휴대폰 인증이 완료된 사용자만 KFTC 오픈뱅킹 연동이 가능합니다.
3. **토큰 관리**: KFTC에서 발급받은 액세스 토큰은 사용자 정보에 함께 저장됩니다.
4. **설정 파일 보안**: `application-local.yml` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않습니다.
5. **기본 프로파일**: `application.yml`에서 기본 프로파일을 `local`로 설정했습니다.

## 에러 처리

모든 API는 다음과 같은 형태의 에러 응답을 반환합니다:

```json
{
  "status": 400,
  "message": "오류 메시지",
  "data": null
}
```

주요 에러 케이스:
- 중복된 휴대폰번호/주민등록번호로 가입 시도
- 휴대폰 인증 없이 회원가입 시도
- 만료된 인증 코드 사용
- KFTC 토큰 발급 실패 