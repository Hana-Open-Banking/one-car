package com.onecar.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "인증 응답")
public class AuthResponse {
    
    @JsonProperty("access_token")
    @Schema(description = "액세스 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    
    @JsonProperty("refresh_token")
    @Schema(description = "리프레시 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;
    
    @JsonProperty("token_type")
    @Schema(description = "토큰 타입", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";
    
    @JsonProperty("expires_in")
    @Schema(description = "토큰 만료 시간(초)", example = "3600")
    private Long expiresIn;
    
    @JsonProperty("member_info")
    @Schema(description = "회원 정보")
    private MemberInfo memberInfo;
    
    @Data
    @Builder
    @Schema(description = "회원 정보")
    public static class MemberInfo {
        @Schema(description = "아이디", example = "onecar_user")
        private String id;
        
        @Schema(description = "이름", example = "홍길동")
        private String name;
        
        @Schema(description = "이메일", example = "user@onecar.com")
        private String email;
        
        @Schema(description = "휴대폰 번호", example = "010-1234-5678")
        private String phone;
        
        @JsonProperty("user_seq_no")
        @Schema(description = "금융결제원 사용자 일련번호", example = "1000000001")
        private String userSeqNo;
    }
}