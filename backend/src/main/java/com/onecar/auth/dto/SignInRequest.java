package com.onecar.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "로그인 요청")
public class SignInRequest {
    
    @NotBlank(message = "아이디는 필수입니다")
    @Schema(description = "아이디", example = "onecar_user")
    private String id;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Schema(description = "비밀번호", example = "OnecarPass123!")
    private String password;
}