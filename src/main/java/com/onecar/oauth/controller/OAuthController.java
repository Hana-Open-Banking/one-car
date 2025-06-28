package com.onecar.oauth.controller;

import com.onecar.common.dto.BasicResponse;
import com.onecar.user.dto.UserRegisterResponse;
import com.onecar.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
@Tag(name = "OAuth", description = "KFTC 오픈뱅킹 OAuth 처리 API")
public class OAuthController {
    
    private final UserService userService;
    
    @Operation(summary = "KFTC OAuth 콜백", description = "KFTC 오픈뱅킹 인증 완료 후 콜백을 처리합니다.")
    @GetMapping("/callback")
    public ResponseEntity<BasicResponse> oauthCallback(
            @Parameter(description = "Authorization Code", required = true) 
            @RequestParam("code") String code,
            
            @Parameter(description = "State (사용자 ID)", required = true) 
            @RequestParam("state") String state,
            
            @Parameter(description = "Scope", required = false) 
            @RequestParam(value = "scope", required = false) String scope) {
        
        log.info("KFTC OAuth 콜백 수신: code={}, state={}, scope={}", code, state, scope);
        
        UserRegisterResponse response = userService.handleKftcCallback(code, state);
        
        BasicResponse basicResponse = BasicResponse.builder()
                .status(200)
                .message("KFTC 오픈뱅킹 연동이 완료되었습니다.")
                .data(response)
                .build();
        
        return ResponseEntity.ok(basicResponse);
    }
} 