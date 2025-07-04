package com.onecar.auth.service;

import com.onecar.auth.dto.KftcTokenResponse;
import com.onecar.auth.entity.OAuthSession;
import com.onecar.common.exception.BusinessException;
import com.onecar.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class KftcOAuthService {
    
    private final WebClient webClient;
    private final AuthService authService;
    private final OAuthSessionService oAuthSessionService;
    
    @Value("${oauth.client.client-id}")
    private String kftcClientId;
    
    @Value("${oauth.client.client-secret}")
    private String kftcClientSecret;
    
    @Value("${oauth.client.redirect-uri}")
    private String kftcRedirectUri;
    
    @Value("${openbanking.base-url}")
    private String kftcBaseUrl;
    
    public void processKftcOAuthCallback(String code, String accessToken) {
        log.info("=== OneCard KFTC OAuth 콜백 처리 시작 ===");
        log.info("Authorization Code: {}", code.substring(0, Math.min(code.length(), 20)) + "...");
        log.info("OneCard Access Token: {}", accessToken.substring(0, Math.min(accessToken.length(), 20)) + "...");
        
        try {
            // 1. KFTC에서 토큰 받아오기 (application-local.yml의 설정 사용)
            log.info("1단계: KFTC 토큰 요청 시작");
            KftcTokenResponse tokenResponse = getTokenFromKftc(code);
            log.info("1단계: KFTC 토큰 응답 수신 완료");
            log.info("KFTC에서 받은 user_seq_no: {}", tokenResponse.getUserSeqNo());
            log.info("KFTC에서 받은 user_name: {}", tokenResponse.getUserName());
            
            // 2. 현재 사용자 식별
            log.info("2단계: OneCard 사용자 식별 시작");
            String memberId = authService.getMemberIdByAccessToken(accessToken);
            log.info("2단계: OneCard 회원 ID: {}", memberId);
            
            // 3. user_seq_no 업데이트
            log.info("3단계: user_seq_no 업데이트 시작");
            authService.updateUserSeqNo(memberId, tokenResponse.getUserSeqNo());
            log.info("3단계: user_seq_no 업데이트 완료");
            
            log.info("=== KFTC OAuth 연동 완료 ===");
            log.info("OneCard 회원 ID: {}, KFTC user_seq_no: {}", memberId, tokenResponse.getUserSeqNo());
            
        } catch (Exception e) {
            log.error("KFTC OAuth 연동 실패 - code: {}, error: {}", code, e.getMessage(), e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    public String processKftcOAuthRedirectCallback(String code, String state) {
        log.info("=== OneCard KFTC OAuth 리디렉트 콜백 처리 시작 ===");
        log.info("Authorization Code: {}", code.substring(0, Math.min(code.length(), 20)) + "...");
        log.info("State: {}", state);
        
        try {
            // 1. 세션 검증 및 사용자 식별
            log.info("1단계: OAuth 세션 검증 시작");
            OAuthSession session = oAuthSessionService.findAndValidateSession(state);
            String memberId = session.getMemberId();
            log.info("1단계: OAuth 세션 검증 완료 - memberId: {}", memberId);
            
            // 2. KFTC에서 토큰 받아오기
            log.info("2단계: KFTC 토큰 요청 시작");
            KftcTokenResponse tokenResponse = getTokenFromKftc(code);
            log.info("2단계: KFTC 토큰 응답 수신 완료");
            log.info("KFTC에서 받은 user_seq_no: {}", tokenResponse.getUserSeqNo());
            log.info("KFTC에서 받은 user_name: {}", tokenResponse.getUserName());
            
            // 3. user_seq_no 업데이트
            log.info("3단계: user_seq_no 업데이트 시작");
            authService.updateUserSeqNo(memberId, tokenResponse.getUserSeqNo());
            log.info("3단계: user_seq_no 업데이트 완료");
            
            // 4. 세션 완료 처리
            log.info("4단계: OAuth 세션 완료 처리");
            oAuthSessionService.completeSession(state);
            
            log.info("=== KFTC OAuth 연동 완료 ===");
            log.info("OneCard 회원 ID: {}, KFTC user_seq_no: {}", memberId, tokenResponse.getUserSeqNo());
            
            return memberId;
            
        } catch (Exception e) {
            log.error("KFTC OAuth 연동 실패 - code: {}, state: {}, error: {}", code, state, e.getMessage(), e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
    
    private KftcTokenResponse getTokenFromKftc(String code) {
        log.info("=== KFTC 토큰 요청 시작 ===");
        log.info("Authorization Code: {}", code.substring(0, Math.min(code.length(), 20)) + "...");
        log.info("Client ID: {}", kftcClientId);
        log.info("Client Secret: {}***", kftcClientSecret != null ? kftcClientSecret.substring(0, Math.min(kftcClientSecret.length(), 10)) : "null");
        log.info("Redirect URI: {}", kftcRedirectUri);
        log.info("KFTC Base URL: {}", kftcBaseUrl);
        
        // Form 데이터 생성
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("code", code);
        formData.add("client_id", kftcClientId);
        formData.add("client_secret", kftcClientSecret);
        formData.add("redirect_uri", kftcRedirectUri);
        formData.add("grant_type", "authorization_code");
        
        log.info("KFTC 토큰 엔드포인트 호출: {}", kftcBaseUrl + "/oauth/2.0/token");
        
        return webClient.post()
                .uri(kftcBaseUrl + "/oauth/2.0/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(KftcTokenResponse.class)
                .doOnSuccess(response -> {
                    if (response != null) {
                        log.info("=== KFTC 토큰 응답 성공 ===");
                        log.info("Access Token: {}...", response.getAccessToken() != null ? 
                                response.getAccessToken().substring(0, Math.min(response.getAccessToken().length(), 20)) : "null");
                        log.info("Token Type: {}", response.getTokenType());
                        log.info("Expires In: {}", response.getExpiresIn());
                        log.info("User Seq No: {}", response.getUserSeqNo());
                        log.info("User Name: {}", response.getUserName());
                        log.info("Scope: {}", response.getScope());
                    } else {
                        log.error("KFTC 토큰 응답이 null입니다!");
                    }
                })
                .doOnError(error -> log.error("KFTC 토큰 요청 실패: {}", error.getMessage(), error))
                .onErrorMap(ex -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR))
                .block();
    }
    

}