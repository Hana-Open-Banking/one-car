package com.onecar.car.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class CarDetailResponse {
    // Car specification info
    private String model;
    private String manufacturer;
    private String carImage;
    private String fuelType;
    private Double fuelEfficiency;
    private Integer engineDisplacement;
    private Long basePrice;
    private String transmissionType;
    private String vehicleType;

    // User car info
    private String licensePlate;
    private Integer manufactureYear;
    private String trim;
    private String vin;
    private Integer mileage;
    private LocalDateTime firstRegistrationDate;
} 