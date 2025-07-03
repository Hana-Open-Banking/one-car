package com.onecar.auth.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "onecar_token")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnecarToken extends DateTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "token_seq")
    @SequenceGenerator(name = "token_seq", sequenceName = "ONECAR_TOKEN_SEQ", allocationSize = 1)
    private Long id;
    
    @Column(name = "member_id", nullable = false, length = 50)
    private String memberId;

    @Column(name = "access_token", nullable = false, length = 4000)
    private String accessToken;
    
    @Column(name = "refresh_token", nullable = false, length = 4000)
    private String refreshToken;
    
    @Column(name = "access_token_expires_at", nullable = false)
    private LocalDateTime accessTokenExpiresAt;
    
    @Column(name = "refresh_token_expires_at", nullable = false)
    private LocalDateTime refreshTokenExpiresAt;
    
    @Column(name = "is_revoked", nullable = false)
    @Builder.Default
    private Boolean isRevoked = false;
    
    // 비즈니스 메서드
    public void revoke() {
        this.isRevoked = true;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(accessTokenExpiresAt);
    }
    
    public boolean isRefreshTokenExpired() {
        return LocalDateTime.now().isAfter(refreshTokenExpiresAt);
    }
}