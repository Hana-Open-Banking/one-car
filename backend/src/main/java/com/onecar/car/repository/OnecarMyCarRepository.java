package com.onecar.car.repository;

import com.onecar.car.entity.OnecarMyCar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OnecarMyCarRepository extends JpaRepository<OnecarMyCar, Long> {
    List<OnecarMyCar> findByMemberId(String memberId);
    Optional<OnecarMyCar> findByLicensePlate(String licensePlate);
    boolean existsByLicensePlate(String licensePlate);
    boolean existsByVin(String vin);
} 