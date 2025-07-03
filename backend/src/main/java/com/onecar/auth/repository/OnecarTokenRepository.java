package com.onecar.auth.repository;

import com.onecar.auth.entity.OnecarToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OnecarTokenRepository extends JpaRepository<OnecarToken, Long> {
    
    Optional<OnecarToken> findByAccessTokenAndIsRevokedFalse(String accessToken);
    
    Optional<OnecarToken> findByRefreshTokenAndIsRevokedFalse(String refreshToken);
    
    List<OnecarToken> findByMemberIdAndIsRevokedFalse(String memberId);
    
    @Modifying
    @Query("UPDATE OnecarToken t SET t.isRevoked = true WHERE t.memberId = :memberId")
    void revokeAllTokensByMemberId(String memberId);
}