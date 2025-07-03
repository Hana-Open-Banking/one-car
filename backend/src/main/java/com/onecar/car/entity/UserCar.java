package com.onecar.car.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_cars")
@Getter
@Setter
@NoArgsConstructor
public class UserCar extends DateTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "owner_name", nullable = false, length = 50)
    private String ownerName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;

    @Column(name = "manufacture_year", nullable = false)
    private Integer manufactureYear;

    @Column(name = "trim")
    private String trim;

    @Column(name = "vin", unique = true)
    private String vin;

    @Column(name = "mileage")
    private Integer mileage;

    @Column(name = "first_registration_date", nullable = false)
    private LocalDateTime firstRegistrationDate;

    @PrePersist
    protected void onCreate() {
        if (firstRegistrationDate == null) {
            firstRegistrationDate = LocalDateTime.now();
        }
    }
} 