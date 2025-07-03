package com.onecar.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "토큰 갱신 요청")
public class RefreshTokenRequest {
    
    @NotBlank(message = "리프레시 토큰은 필수입니다.")
    @Schema(description = "갱신할 Refresh Token", 
            example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIn0...", 
            required = true)
    private String refresh_token;
} 