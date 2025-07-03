package com.onecar.car.service;

import com.onecar.car.dto.CarDetailResponse;
import com.onecar.car.dto.CarRegistrationRequest;
import com.onecar.car.entity.Car;
import com.onecar.car.entity.OnecarMyCar;
import com.onecar.car.entity.UserCar;
import com.onecar.car.repository.CarRepository;
import com.onecar.car.repository.OnecarMyCarRepository;
import com.onecar.car.repository.UserCarRepository;
import com.onecar.common.exception.BusinessException;
import com.onecar.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarService {
    private final UserCarRepository userCarRepository;
    private final OnecarMyCarRepository onecarMyCarRepository;

    @Transactional
    public void registerCar(String memberId, CarRegistrationRequest request) {
        // "외부" 시스템(user_cars 테이블)에서 차량 정보 조회
        UserCar userCar = userCarRepository.findByLicensePlate(request.getLicensePlate())
                .orElseThrow(() -> new BusinessException(ErrorCode.CAR_NOT_FOUND));

        // 차량 소유자 이름 확인
        if (!request.getOwnerName().equals(userCar.getOwnerName())) {
            log.warn("차량 소유자 불일치 - 요청된 소유자: {}, 실제 소유자: {}", 
                    request.getOwnerName(), userCar.getOwnerName());
            throw new BusinessException(ErrorCode.OWNER_MISMATCH);
        }

        // 이미 등록된 차량인지 확인
        if (onecarMyCarRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new BusinessException(ErrorCode.DUPLICATE_LICENSE_PLATE);
        }

        if (onecarMyCarRepository.existsByVin(userCar.getVin())) {
            throw new BusinessException(ErrorCode.DUPLICATE_VIN);
        }

        // 원카 시스템에 차량 정보 저장
        Car car = userCar.getCar();
        OnecarMyCar onecarMyCar = new OnecarMyCar();
        onecarMyCar.setMemberId(memberId);
        onecarMyCar.setLicensePlate(userCar.getLicensePlate());
        onecarMyCar.setModel(car.getModel());
        onecarMyCar.setManufacturer(car.getManufacturer());
        onecarMyCar.setFuelType(car.getFuelType());
        onecarMyCar.setFuelEfficiency(car.getFuelEfficiency() != null ? car.getFuelEfficiency() : 0.0);
        onecarMyCar.setEngineDisplacement(car.getEngineDisplacement() != null ? car.getEngineDisplacement() : 0);
        onecarMyCar.setTransmissionType(car.getTransmissionType() != null ? car.getTransmissionType() : "미정");
        onecarMyCar.setVehicleType(car.getVehicleType() != null ? car.getVehicleType() : "미정");
        onecarMyCar.setManufactureYear(userCar.getManufactureYear() != null ? userCar.getManufactureYear() % 10000 : LocalDateTime.now().getYear());
        onecarMyCar.setTrim(userCar.getTrim() != null ? userCar.getTrim() : "기본");
        onecarMyCar.setVin(userCar.getVin());
        onecarMyCar.setBasePrice(car.getBasePrice());
        onecarMyCar.setCarImage(car.getCarImage());
        onecarMyCar.setMileage(userCar.getMileage());
        
        onecarMyCarRepository.save(onecarMyCar);
        
        log.info("차량 등록 완료 - memberId: {}, licensePlate: {}, ownerName: {}", 
                memberId, request.getLicensePlate(), request.getOwnerName());
    }

    @Transactional(readOnly = true)
    public List<CarDetailResponse> getMyCars(String memberId) {
        return onecarMyCarRepository.findByMemberId(memberId).stream()
                .map(this::convertToDetailResponse)
                .collect(Collectors.toList());
    }

    private CarDetailResponse convertToDetailResponse(OnecarMyCar myCar) {
        CarDetailResponse response = new CarDetailResponse();
        
        // Set car specification info
        response.setModel(myCar.getModel());
        response.setManufacturer(myCar.getManufacturer());
        response.setCarImage(myCar.getCarImage());
        response.setFuelType(myCar.getFuelType());
        response.setFuelEfficiency(myCar.getFuelEfficiency());
        response.setEngineDisplacement(myCar.getEngineDisplacement());
        response.setBasePrice(myCar.getBasePrice());
        response.setTransmissionType(myCar.getTransmissionType());
        response.setVehicleType(myCar.getVehicleType());

        // Set user car info
        response.setLicensePlate(myCar.getLicensePlate());
        response.setManufactureYear(myCar.getManufactureYear());
        response.setTrim(myCar.getTrim());
        response.setVin(myCar.getVin());
        response.setMileage(myCar.getMileage());
        response.setFirstRegistrationDate(myCar.getRegistrationDate());

        return response;
    }
} 