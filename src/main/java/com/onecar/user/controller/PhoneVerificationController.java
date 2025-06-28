package com.onecar.user.controller;

import com.onecar.common.dto.BasicResponse;
import com.onecar.user.dto.PhoneVerificationConfirmRequest;
import com.onecar.user.dto.PhoneVerificationRequest;
import com.onecar.user.service.PhoneVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/phone-verification")
@RequiredArgsConstructor
@Tag(name = "휴대폰 인증", description = "휴대폰 본인인증 API")
public class PhoneVerificationController {
    
    private final PhoneVerificationService phoneVerificationService;
    
    @Operation(summary = "휴대폰 인증 코드 발송", description = "입력한 휴대폰번호로 인증 코드를 발송합니다.")
    @PostMapping("/send")
    public ResponseEntity<BasicResponse> sendVerificationCode(
            @Valid @RequestBody PhoneVerificationRequest request) {
        
        phoneVerificationService.sendVerificationCode(request.getPhoneNumber());
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("인증 코드가 발송되었습니다.")
                .data(null)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "휴대폰 인증 코드 확인", description = "발송된 인증 코드를 확인합니다.")
    @PostMapping("/verify")
    public ResponseEntity<BasicResponse> verifyCode(
            @Valid @RequestBody PhoneVerificationConfirmRequest request) {
        
        boolean isVerified = phoneVerificationService.verifyCode(
                request.getPhoneNumber(), 
                request.getVerificationCode()
        );
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("휴대폰 인증이 완료되었습니다.")
                .data(isVerified)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "휴대폰 인증 여부 확인", description = "해당 휴대폰번호의 인증 여부를 확인합니다.")
    @GetMapping("/status/{phoneNumber}")
    public ResponseEntity<BasicResponse> checkVerificationStatus(
            @PathVariable String phoneNumber) {
        
        boolean isVerified = phoneVerificationService.isPhoneVerified(phoneNumber);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("휴대폰 인증 상태 조회 성공")
                .data(isVerified)
                .build();
        
        return ResponseEntity.ok(response);
    }
} 