package com.onecar.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    INTERNAL_SERVER_ERROR(500, "C_001", "서버에 문제가 발생하였습니다."),
    METHOD_NOT_ALLOWED(405, "C_002", "잘못된 HTTP Request Method 입니다."),
    INVALID_INPUT_VALUE(400, "C_003", "적절하지 않은 요청 값입니다."),
    INVALID_TYPE_VALUE(400, "C_004", "요청 값의 타입이 잘못되었습니다."),
    ENTITY_NOT_FOUND(400, "C_005", "지정한 Entity를 찾을 수 없습니다."),

    LOCATION_NOT_FOUND(400, "L_001", "잘못된 위치 정보입니다. 1~17 사이의 숫자를 입력해주세요."),

    MEMBER_NOT_FOUND(404, "M_001", "존재하지 않는 사용자입니다."),
    DUPLICATED_USERNAME(409, "M_002", "이미 존재하는 아이디입니다."),
    INVALID_PASSWORD(401, "M_003", "비밀번호가 올바르지 않습니다."),
    INVALID_TOKEN(401, "M_004", "토큰이 만료되었습니다."),
    
    DUPLICATE_USER_ID(409, "U_001", "이미 사용 중인 아이디입니다"),
    DUPLICATE_EMAIL(409, "U_002", "이미 사용 중인 이메일입니다"),
    DUPLICATE_PHONE(409, "U_003", "이미 사용 중인 휴대폰 번호입니다"),
    PASSWORD_MISMATCH(400, "U_004", "비밀번호가 일치하지 않습니다"),
    USER_NOT_FOUND(404, "U_005", "사용자를 찾을 수 없습니다"),
    EXPIRED_TOKEN(401, "T_002", "만료된 토큰입니다"),
    USER_SEQ_NO_NOT_FOUND(404, "U_006", "금융결제원 사용자 시퀀스 번호가 설정되지 않았습니다"),
    ;

    private final int status;
    private final String code;
    private final String message;

    ErrorCode(int status, String code, String message) {
        this.status = status;
        this.message = message;
        this.code = code;
    }

}
