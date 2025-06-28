package com.onecar.user.controller;

import com.onecar.common.dto.BasicResponse;
import com.onecar.user.dto.UserRegisterRequest;
import com.onecar.user.dto.UserRegisterResponse;
import com.onecar.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "사용자 관리", description = "사용자 회원가입 및 관리 API")
public class UserController {
    
    private final UserService userService;
    
    @Operation(summary = "사용자 회원가입", description = "이름, 주민등록번호, 휴대폰번호로 회원가입을 진행합니다.")
    @PostMapping("/register")
    public ResponseEntity<BasicResponse> registerUser(
            @Valid @RequestBody UserRegisterRequest request) {
        
        UserRegisterResponse response = userService.registerUser(request);
        
        BasicResponse basicResponse = BasicResponse.builder()
                .status(200)
                .message("회원가입이 완료되었습니다.")
                .data(response)
                .build();
        
        return ResponseEntity.ok(basicResponse);
    }
    
    @Operation(summary = "KFTC 오픈뱅킹 연동", description = "KFTC 오픈뱅킹 인증 URL을 반환합니다.")
    @PostMapping("/{userId}/connect-kftc")
    public ResponseEntity<BasicResponse> connectKftc(
            @Parameter(description = "사용자 ID", required = true) 
            @PathVariable Long userId) {
        
        String authUrl = userService.connectKftc(userId);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("KFTC 인증 URL이 생성되었습니다.")
                .data(authUrl)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "사용자 정보 조회", description = "사용자 정보를 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<BasicResponse> getUserInfo(
            @Parameter(description = "사용자 ID", required = true) 
            @PathVariable Long userId) {
        
        UserRegisterResponse response = userService.getUserInfo(userId);
        
        BasicResponse basicResponse = BasicResponse.builder()
                .status(200)
                .message("사용자 정보 조회 성공")
                .data(response)
                .build();
        
        return ResponseEntity.ok(basicResponse);
    }
} 