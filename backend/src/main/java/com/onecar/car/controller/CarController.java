package com.onecar.car.controller;

import com.onecar.car.dto.CarDetailResponse;
import com.onecar.car.dto.CarRegistrationRequest;
import com.onecar.car.service.CarService;
import com.onecar.common.dto.BasicResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;

    @PostMapping("/register")
    @Operation(summary = "차량 등록",
            description = "차량번호와 소유자 이름으로 차량을 조회하여 원카 시스템에 등록합니다. " +
                    "차량번호와 소유자 정보가 일치하는 경우에만 등록이 가능합니다.")
    public ResponseEntity<BasicResponse> registerCar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CarRegistrationRequest request) {
        carService.registerCar(userDetails.getUsername(), request);
        return ResponseEntity.ok(BasicResponse.builder()
                .status(200)
                .message("차량이 성공적으로 등록되었습니다.")
                .data(null)
                .build());
    }

    @GetMapping("/my-cars")
    @Operation(summary = "내 차량 목록 조회",
            description = "현재 로그인한 사용자가 원카 시스템에 등록한 모든 차량의 목록을 조회합니다.")
    public ResponseEntity<BasicResponse> getMyCars(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<CarDetailResponse> cars = carService.getMyCars(userDetails.getUsername());
        return ResponseEntity.ok(BasicResponse.builder()
                .status(200)
                .message("성공")
                .data(cars)
                .build());
    }
} 