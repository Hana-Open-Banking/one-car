package com.onecar.auth.repository;

import com.onecar.auth.entity.OnecarMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OnecarMemberRepository extends JpaRepository<OnecarMember, String> {
    
    Optional<OnecarMember> findByIdAndIsActiveTrue(String id);
    
    boolean existsById(String id);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
}