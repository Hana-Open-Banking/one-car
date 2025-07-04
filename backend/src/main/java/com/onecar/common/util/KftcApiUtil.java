package com.onecar.common.util;

import com.onecar.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class KftcApiUtil {
    
    private final WebClient webClient;
    private final AuthService authService;
    
    @Value("${openbanking.base-url}")
    private String kftcBaseUrl;
    
    public <T> T callKftcGetApi(String onecarAccessToken, String endpoint, Class<T> responseType) {
        String kftcAccessToken = authService.getKftcAccessTokenByOnecarToken(onecarAccessToken);
        
        log.info("KFTC API 호출 - GET {}", endpoint);
        
        return webClient.get()
                .uri(kftcBaseUrl + endpoint)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + kftcAccessToken)
                .retrieve()
                .bodyToMono(responseType)
                .doOnSuccess(response -> log.info("KFTC API 호출 성공 - GET {}", endpoint))
                .doOnError(error -> log.error("KFTC API 호출 실패 - GET {}: {}", endpoint, error.getMessage()))
                .block();
    }
    
    public <T> T callKftcPostApi(String onecarAccessToken, String endpoint, 
                                Object requestBody, Class<T> responseType) {
        String kftcAccessToken = authService.getKftcAccessTokenByOnecarToken(onecarAccessToken);
        
        log.info("KFTC API 호출 - POST {}", endpoint);
        
        return webClient.post()
                .uri(kftcBaseUrl + endpoint)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + kftcAccessToken)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(responseType)
                .doOnSuccess(response -> log.info("KFTC API 호출 성공 - POST {}", endpoint))
                .doOnError(error -> log.error("KFTC API 호출 실패 - POST {}: {}", endpoint, error.getMessage()))
                .block();
    }
}