package com.onecar.auth.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "oauth_session")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthSession extends DateTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "oauth_session_seq")
    @SequenceGenerator(name = "oauth_session_seq", sequenceName = "OAUTH_SESSION_SEQ", allocationSize = 1)
    private Long id;
    
    @Column(name = "session_id", nullable = false, unique = true, length = 255)
    private String sessionId;
    
    @Column(name = "member_id", nullable = false, length = 50)
    private String memberId;
    
    @Column(name = "state", nullable = false, length = 255)
    private String state;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;
    
    // 비즈니스 메서드
    public void complete() {
        this.isCompleted = true;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
} 