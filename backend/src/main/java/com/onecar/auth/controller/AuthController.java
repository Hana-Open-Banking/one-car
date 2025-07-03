package com.onecar.auth.controller;

import com.onecar.auth.dto.AuthResponse;
import com.onecar.auth.dto.KftcOAuthCallbackRequest;
import com.onecar.auth.dto.RefreshTokenRequest;
import com.onecar.auth.dto.SignInRequest;
import com.onecar.auth.dto.SignUpRequest;
import com.onecar.auth.dto.UpdateUserSeqNoRequest;
import com.onecar.auth.service.AuthService;
import com.onecar.auth.service.KftcOAuthService;
import com.onecar.common.dto.BasicResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "OneCard 회원가입, 로그인, 로그아웃 API")
public class AuthController {
    
    private final AuthService authService;
    private final KftcOAuthService kftcOAuthService;
    
    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "OneCard 서비스 회원가입을 진행합니다.")
    public ResponseEntity<BasicResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        log.info("회원가입 요청 - id: {}", request.getId());
        
        AuthResponse authResponse = authService.signUp(request);
        
        BasicResponse response = BasicResponse.builder()
                .status(201)
                .message("회원가입이 완료되었습니다.")
                .data(authResponse)
                .build();
        
        return ResponseEntity.status(201).body(response);
    }
    
    @PostMapping("/signin")
    @Operation(summary = "로그인", description = "OneCard 서비스 로그인을 진행합니다.")
    public ResponseEntity<BasicResponse> signIn(@Valid @RequestBody SignInRequest request) {
        log.info("로그인 요청 - id: {}", request.getId());
        
        AuthResponse authResponse = authService.signIn(request);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("로그인이 완료되었습니다.")
                .data(authResponse)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signout")
    @Operation(summary = "로그아웃", description = "현재 세션을 종료하고 토큰을 무효화합니다.")
    public ResponseEntity<BasicResponse> signOut(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization) {
        
        String accessToken = authorization.replace("Bearer ", "");
        authService.signOut(accessToken);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("로그아웃이 완료되었습니다.")
                .data(null)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.")
    public ResponseEntity<BasicResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefresh_token();
        
        AuthResponse authResponse = authService.refreshToken(refreshToken);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("토큰이 갱신되었습니다.")
                .data(authResponse)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-id/{id}")
    @Operation(summary = "아이디 중복 확인", description = "회원가입 시 아이디 중복 여부를 확인합니다.")
    public ResponseEntity<BasicResponse> checkIdAvailability(@PathVariable String id) {
        boolean isAvailable = authService.checkIdAvailability(id);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message(isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.")
                .data(Map.of("available", isAvailable))
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user-seq-no")
    @Operation(summary = "사용자 시퀀스 번호 조회", description = "Access Token으로 금융결제원 사용자 시퀀스 번호를 조회합니다.")
    public ResponseEntity<BasicResponse> getUserSeqNo(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization) {
        
        String accessToken = authorization.replace("Bearer ", "");
        String userSeqNo = authService.getUserSeqNoByAccessToken(accessToken);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("사용자 시퀀스 번호 조회 성공")
                .data(Map.of("user_seq_no", userSeqNo))
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/user-seq-no")
    @Operation(summary = "사용자 시퀀스 번호 업데이트", description = "금융결제원에서 받은 사용자 시퀀스 번호를 업데이트합니다.")
    public ResponseEntity<BasicResponse> updateUserSeqNo(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody UpdateUserSeqNoRequest request) {
        
        String accessToken = authorization.replace("Bearer ", "");
        String userSeqNo = request.getUser_seq_no();
        
        // 토큰에서 회원 ID 추출
        String memberId = authService.getMemberIdByAccessToken(accessToken);
        
        log.info("사용자 시퀀스 번호 업데이트 요청 - memberId: {}, userSeqNo: {}", memberId, userSeqNo);
        
        authService.updateUserSeqNo(memberId, userSeqNo);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("사용자 시퀀스 번호가 업데이트되었습니다.")
                .data(null)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/kftc-oauth-callback")
    @Operation(
        summary = "KFTC OAuth 콜백 처리", 
        description = "KFTC에서 OAuth 인증 완료 후 받은 Authorization Code로 user_seq_no를 업데이트합니다."
    )
    public ResponseEntity<BasicResponse> handleKftcOAuthCallback(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody KftcOAuthCallbackRequest request) {
        
        String accessToken = authorization.replace("Bearer ", "");
        String code = request.getCode();
        
        log.info("KFTC OAuth 콜백 처리 시작 - code: {}", code.substring(0, Math.min(code.length(), 10)) + "...");
        
        kftcOAuthService.processKftcOAuthCallback(code, accessToken);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("KFTC OAuth 연동이 완료되었습니다.")
                .data(null)
                .build();
        
        return ResponseEntity.ok(response);
    }


}