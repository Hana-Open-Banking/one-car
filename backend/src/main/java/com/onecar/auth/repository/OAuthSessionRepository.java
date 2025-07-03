package com.onecar.auth.repository;

import com.onecar.auth.entity.OAuthSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OAuthSessionRepository extends JpaRepository<OAuthSession, Long> {
    
    Optional<OAuthSession> findBySessionIdAndIsCompletedFalse(String sessionId);
    
    Optional<OAuthSession> findByStateAndIsCompletedFalse(String state);
    
    List<OAuthSession> findByMemberIdAndIsCompletedFalse(String memberId);
    
    @Query("SELECT s FROM OAuthSession s WHERE s.expiresAt < :now AND s.isCompleted = false")
    List<OAuthSession> findExpiredSessions(LocalDateTime now);
    
    void deleteByMemberIdAndIsCompletedTrue(String memberId);
} 