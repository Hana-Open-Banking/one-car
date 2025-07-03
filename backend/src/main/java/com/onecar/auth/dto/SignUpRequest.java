package com.onecar.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(description = "회원가입 요청")
public class SignUpRequest {
    
    @NotBlank(message = "아이디는 필수입니다")
    @Size(min = 4, max = 20, message = "아이디는 4~20자 사이여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "아이디는 영문, 숫자, 언더스코어만 가능합니다")
    @Schema(description = "아이디", example = "onecar_user")
    private String id;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$", 
             message = "비밀번호는 8~20자 사이이며, 대소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다")
    @Schema(description = "비밀번호", example = "OnecarPass123!")
    private String password;
    
    @NotBlank(message = "비밀번호 확인은 필수입니다")
    @Schema(description = "비밀번호 확인", example = "OnecarPass123!")
    private String passwordConfirm;
    
    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 10, message = "이름은 2~10자 사이여야 합니다")
    @Schema(description = "이름", example = "홍길동")
    private String name;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Schema(description = "이메일", example = "user@onecar.com")
    private String email;
    
    @NotBlank(message = "휴대폰 번호는 필수입니다")
    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "휴대폰 번호는 010-0000-0000 형식이어야 합니다")
    @Schema(description = "휴대폰 번호", example = "010-1234-5678")
    private String phone;
    
    public boolean isPasswordMatched() {
        return password != null && password.equals(passwordConfirm);
    }
}