package com.onecar.auth.repository;

import com.onecar.auth.entity.KftcToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KftcTokenRepository extends JpaRepository<KftcToken, Long> {
    Optional<KftcToken> findByMemberId(String memberId);
    Optional<KftcToken> findByUserSeqNo(String userSeqNo);
    boolean existsByMemberId(String memberId);
    boolean existsByUserSeqNo(String userSeqNo);
    void deleteByMemberId(String memberId);
}