package com.onecar.auth.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "kftc_token")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KftcToken extends DateTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "member_id", nullable = false, length = 50)
    private String memberId; // OnecarMember의 id와 연결
    
    @Column(name = "user_seq_no", nullable = false, length = 50)
    private String userSeqNo;

    @Column(name = "access_token", nullable = false, length = 4000)
    private String accessToken;

    @Column(name = "refresh_token", nullable = false, length = 4000)
    private String refreshToken;

    @Column(name = "token_type", length = 20)
    @Builder.Default
    private String tokenType = "Bearer";
    
    @Column(name = "expires_in")
    private Integer expiresIn;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "scope", length = 100)
    private String scope;
    
    // 비즈니스 메서드
    public void updateTokenInfo(String accessToken, String refreshToken, String tokenType, 
                               Integer expiresIn, String scope) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.expiresIn = expiresIn;
        this.expiresAt = expiresIn != null ? LocalDateTime.now().plusSeconds(expiresIn) : null;
        this.scope = scope;
    }
    
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
}