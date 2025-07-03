package com.onecar.auth.service;

import com.onecar.auth.entity.OAuthSession;
import com.onecar.auth.repository.OAuthSessionRepository;
import com.onecar.common.exception.BusinessException;
import com.onecar.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthSessionService {
    
    private final OAuthSessionRepository oAuthSessionRepository;
    private static final long SESSION_TIMEOUT_MINUTES = 30;
    
    @Transactional
    public String createOAuthSession(String memberId) {
        log.info("OAuth 세션 생성 시작 - memberId: {}", memberId);
        
        // 기존 완료되지 않은 세션들 정리
        oAuthSessionRepository.findByMemberIdAndIsCompletedFalse(memberId)
                .forEach(session -> {
                    session.complete();
                    oAuthSessionRepository.save(session);
                });
        
        // 새로운 세션 생성
        String sessionId = UUID.randomUUID().toString();
        String state = UUID.randomUUID().toString();
        
        OAuthSession session = OAuthSession.builder()
                .sessionId(sessionId)
                .memberId(memberId)
                .state(state)
                .expiresAt(LocalDateTime.now().plusMinutes(SESSION_TIMEOUT_MINUTES))
                .isCompleted(false)
                .build();
        
        oAuthSessionRepository.save(session);
        
        log.info("OAuth 세션 생성 완료 - sessionId: {}, state: {}", sessionId, state);
        return state;
    }
    
    @Transactional
    public OAuthSession findAndValidateSession(String state) {
        log.info("OAuth 세션 조회 및 검증 - state: {}", state);
        
        OAuthSession session = oAuthSessionRepository.findByStateAndIsCompletedFalse(state)
                .orElseThrow(() -> {
                    log.error("유효하지 않은 OAuth state: {}", state);
                    return new BusinessException(ErrorCode.INVALID_TOKEN);
                });
        
        if (session.isExpired()) {
            log.error("만료된 OAuth 세션 - state: {}", state);
            throw new BusinessException(ErrorCode.EXPIRED_TOKEN);
        }
        
        log.info("OAuth 세션 검증 완료 - memberId: {}", session.getMemberId());
        return session;
    }
    
    @Transactional
    public void completeSession(String state) {
        log.info("OAuth 세션 완료 처리 - state: {}", state);
        
        OAuthSession session = oAuthSessionRepository.findByStateAndIsCompletedFalse(state)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
        
        session.complete();
        oAuthSessionRepository.save(session);
        
        log.info("OAuth 세션 완료 - memberId: {}", session.getMemberId());
    }
    
    @Transactional
    public void cleanupExpiredSessions() {
        log.info("만료된 OAuth 세션 정리 시작");
        
        oAuthSessionRepository.findExpiredSessions(LocalDateTime.now())
                .forEach(session -> {
                    session.complete();
                    oAuthSessionRepository.save(session);
                });
        
        log.info("만료된 OAuth 세션 정리 완료");
    }
} 