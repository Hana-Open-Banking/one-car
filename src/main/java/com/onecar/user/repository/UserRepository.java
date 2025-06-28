package com.onecar.user.repository;

import com.onecar.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    Optional<User> findBySocialSecurityNumber(String socialSecurityNumber);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    boolean existsBySocialSecurityNumber(String socialSecurityNumber);
} 