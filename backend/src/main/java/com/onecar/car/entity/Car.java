package com.onecar.car.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
public class Car extends DateTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String manufacturer;

    @Lob
    @Column(name = "car_image")
    private String carImage;

    @Column(name = "fuel_type", nullable = false)
    private String fuelType;

    @Column(name = "fuel_efficiency")
    private Double fuelEfficiency;

    @Column(name = "engine_displacement")
    private Integer engineDisplacement;

    @Column(name = "base_price")
    private Long basePrice;

    @Column(name = "transmission_type")
    private String transmissionType;

    @Column(name = "vehicle_type")
    private String vehicleType;
} 