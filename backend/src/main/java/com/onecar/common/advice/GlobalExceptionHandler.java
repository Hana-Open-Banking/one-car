package com.onecar.common.advice;

import com.onecar.common.dto.BasicResponse;
import com.onecar.common.exception.BusinessException;
import com.onecar.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<BasicResponse> handleException(Exception e) {
        log.error(e.getMessage(), e);
        BasicResponse response = BasicResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<BasicResponse> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();
        BasicResponse response = BasicResponse.of(errorCode);
        return new ResponseEntity<>(response, HttpStatus.valueOf(errorCode.getStatus()));
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<BasicResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        BasicResponse response = BasicResponse.of(ErrorCode.INVALID_INPUT_VALUE,
                e.getBindingResult());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<BasicResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException e) {
        BasicResponse response = BasicResponse.of(e);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ResponseEntity<BasicResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException e) {
        BasicResponse response = BasicResponse.of(ErrorCode.METHOD_NOT_ALLOWED);
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(IllegalStateException.class)
    protected ResponseEntity<BasicResponse> handleIllegalStateException(IllegalStateException e) {
        log.error(e.getMessage(), e);
        BasicResponse response = BasicResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Spring Security 인증 실패 예외 처리
     */
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    protected ResponseEntity<BasicResponse> handleBadCredentialsException(
            org.springframework.security.authentication.BadCredentialsException e) {
        log.warn("로그인 실패 - 잘못된 인증 정보: {}", e.getMessage());
        BasicResponse response = BasicResponse.builder()
                .status(401)
                .message("아이디 또는 비밀번호가 올바르지 않습니다.")
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Spring Security 사용자를 찾을 수 없음 예외 처리
     */
    @ExceptionHandler(org.springframework.security.core.userdetails.UsernameNotFoundException.class)
    protected ResponseEntity<BasicResponse> handleUsernameNotFoundException(
            org.springframework.security.core.userdetails.UsernameNotFoundException e) {
        log.warn("로그인 실패 - 사용자를 찾을 수 없음: {}", e.getMessage());
        BasicResponse response = BasicResponse.builder()
                .status(404)
                .message("존재하지 않는 사용자입니다.")
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Spring Security 인증 예외 일반 처리
     */
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    protected ResponseEntity<BasicResponse> handleAuthenticationException(
            org.springframework.security.core.AuthenticationException e) {
        log.warn("인증 실패: {}", e.getMessage());
        BasicResponse response = BasicResponse.builder()
                .status(401)
                .message("인증에 실패했습니다. 아이디와 비밀번호를 확인해주세요.")
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

}
