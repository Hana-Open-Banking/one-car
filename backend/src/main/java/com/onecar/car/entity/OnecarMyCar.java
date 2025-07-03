package com.onecar.car.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "onecar_mycar")
@Getter
@Setter
@NoArgsConstructor
public class OnecarMyCar extends DateTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false, length = 50)
    private String memberId;

    @Column(name = "license_plate", nullable = false)
    private String licensePlate;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "manufacturer", nullable = false)
    private String manufacturer;

    @Column(name = "fuel_type", nullable = false)
    private String fuelType;

    @Column(name = "fuel_efficiency")
    private Double fuelEfficiency;

    @Column(name = "engine_displacement")
    private Integer engineDisplacement;

    @Column(name = "transmission_type")
    private String transmissionType;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "base_price")
    private Long basePrice;

    @Lob
    @Column(name = "car_image")
    private String carImage;

    @Column(name = "mileage")
    private Integer mileage;

    @Column(name = "manufacture_year", nullable = false)
    private Integer manufactureYear;

    @Column(name = "trim")
    private String trim;

    @Column(name = "vin", unique = true)
    private String vin;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) {
            registrationDate = LocalDateTime.now();
        }
    }
} 