package com.onecar.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "KFTC OAuth 콜백 요청")
public class KftcOAuthCallbackRequest {
    
    @NotBlank(message = "인증 코드는 필수입니다.")
    @Schema(description = "KFTC OAuth 인증 완료 후 받은 Authorization Code", 
            example = "2rjaHJa8q2uDN9u6D_-_8xQTpOv1vEut5EbaRe5feVM", 
            required = true)
    private String code;
    
    @Schema(description = "상태값 (선택사항)", 
            example = "onecard_1234567890")
    private String state;
} 