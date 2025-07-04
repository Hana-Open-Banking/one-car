package com.onecar.auth.controller;

import com.onecar.auth.dto.AuthResponse;
import com.onecar.auth.dto.KftcOAuthCallbackRequest;
import com.onecar.auth.dto.RefreshTokenRequest;
import com.onecar.auth.dto.SignInRequest;
import com.onecar.auth.dto.SignUpRequest;
import com.onecar.auth.service.AuthService;
import com.onecar.auth.service.KftcOAuthService;
import com.onecar.auth.service.OAuthSessionService;
import com.onecar.common.dto.BasicResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "OneCard 회원가입, 로그인, 로그아웃 API")
public class AuthController {
    
    private final AuthService authService;
    private final KftcOAuthService kftcOAuthService;
    private final OAuthSessionService oAuthSessionService;
    
    @Value("${oauth.client.client-id}")
    private String kftcClientId;
    
    @Value("${oauth.client.redirect-uri}")
    private String kftcRedirectUri;
    
    @Value("${oauth.client.scope}")
    private String kftcScope;
    
    @Value("${openbanking.base-url}")
    private String kftcBaseUrl;
    
    @Value("${frontend.base-url}")
    private String frontendBaseUrl;
    
    @Value("${frontend.oauth-success-path}")
    private String frontendOAuthSuccessPath;
    
    @Value("${frontend.oauth-error-path}")
    private String frontendOAuthErrorPath;
    
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
    @Operation(summary = "아이디 중복 확인", description = "아이디 중복 확인을 진행합니다.")
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

    @GetMapping("/kftc-access-token")
    @Operation(summary = "KFTC Access Token 조회", description = "Access Token으로 KFTC Access Token을 조회합니다.")
    public ResponseEntity<BasicResponse> getKftcAccessToken(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization) {
        
        String accessToken = authorization.replace("Bearer ", "");
        String kftcAccessToken = authService.getKftcAccessTokenByOnecarToken(accessToken);
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("KFTC Access Token 조회 성공")
                .data(Map.of("kftc_access_token", kftcAccessToken))
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
    
    @GetMapping("/kftc-oauth-url")
    @Operation(
        summary = "KFTC OAuth URL 생성", 
        description = "KFTC OAuth 인증을 위한 URL을 생성합니다. 세션을 생성하고 OAuth URL을 반환합니다."
    )
    public ResponseEntity<BasicResponse> generateKftcOAuthUrl(
            @Parameter(hidden = true) @RequestHeader("Authorization") String authorization) {
        
        String accessToken = authorization.replace("Bearer ", "");
        String memberId = authService.getMemberIdByAccessToken(accessToken);
        
        log.info("KFTC OAuth URL 생성 요청 - memberId: {}", memberId);
        
        // OAuth 세션 생성
        String state = oAuthSessionService.createOAuthSession(memberId);
        
        // OAuth URL 생성
        String encodedScope = URLEncoder.encode(kftcScope, StandardCharsets.UTF_8);
        String oauthUrl = String.format(
                "%s/oauth/2.0/authorize?response_type=code&client_id=%s&redirect_uri=%s&scope=%s&state=%s",
                kftcBaseUrl, kftcClientId, kftcRedirectUri, encodedScope, state
        );
        
        log.info("KFTC OAuth URL 생성 완료 - memberId: {}, state: {}", memberId, state);
        
        Map<String, String> data = Map.of(
            "oauth_url", oauthUrl,
            "state", state
        );
        
        BasicResponse response = BasicResponse.builder()
                .status(200)
                .message("KFTC OAuth URL이 생성되었습니다.")
                .data(data)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/kftc-oauth-redirect-callback")
    @Operation(
        summary = "KFTC OAuth 리디렉트 콜백", 
        description = "KFTC OAuth 인증 완료 후 자동으로 호출되는 엔드포인트입니다. 자동으로 토큰을 교환하고 user_seq_no를 업데이트한 후 성공 페이지로 리디렉트합니다."
    )
    public void handleKftcOAuthRedirectCallback(
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            HttpServletResponse response) throws IOException {
        
        log.info("KFTC OAuth 리디렉트 콜백 처리 시작 - code: {}, state: {}", 
                code.substring(0, Math.min(code.length(), 10)) + "...", state);
        
        try {
            // OAuth 콜백 자동 처리
            String memberId = kftcOAuthService.processKftcOAuthRedirectCallback(code, state);
            
            log.info("KFTC OAuth 연동 완료 - memberId: {}", memberId);
            
            // 성공 페이지로 리디렉트
            String successUrl = frontendBaseUrl + frontendOAuthSuccessPath;
            response.sendRedirect(successUrl);
            
        } catch (Exception e) {
            log.error("KFTC OAuth 연동 실패 - code: {}, state: {}, error: {}", 
                    code, state, e.getMessage(), e);
            
            // 오류 페이지로 리디렉트
            String errorUrl = frontendBaseUrl + frontendOAuthErrorPath;
            response.sendRedirect(errorUrl);
        }
    }


}