package com.onecar.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "사용자 시퀀스 번호 업데이트 요청")
public class UpdateUserSeqNoRequest {
    
    @NotBlank(message = "사용자 시퀀스 번호는 필수입니다.")
    @Schema(description = "금융결제원에서 발급받은 사용자 시퀀스 번호", 
            example = "1000000002", 
            required = true)
    private String user_seq_no;
} 