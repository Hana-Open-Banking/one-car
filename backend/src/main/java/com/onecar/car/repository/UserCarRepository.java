package com.onecar.car.repository;

import com.onecar.car.entity.UserCar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserCarRepository extends JpaRepository<UserCar, Long> {
    List<UserCar> findByUserId(String userId);
    Optional<UserCar> findByLicensePlate(String licensePlate);
    boolean existsByLicensePlate(String licensePlate);
    boolean existsByVin(String vin);
} 