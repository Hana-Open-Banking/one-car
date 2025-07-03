package com.onecar.car.dto;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "차량 등록 요청")
public class CarRegistrationRequest {
    @Schema(description = "차량번호", example = "12가3456")
    @NotBlank(message = "차량번호는 필수입니다")
    private String licensePlate;

    @Schema(description = "소유자 이름", example = "홍길동")
    @NotBlank(message = "소유자 이름은 필수입니다")
    private String ownerName;
}