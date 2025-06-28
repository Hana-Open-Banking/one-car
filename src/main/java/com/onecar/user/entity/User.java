package com.onecar.user.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User extends DateTimeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50)
    private String name;
    
    @Column(nullable = false, unique = true, length = 13)
    private String socialSecurityNumber; // 주민등록번호
    
    @Column(nullable = false, unique = true, length = 11)
    private String phoneNumber; // 휴대폰번호
    
    @Column(nullable = false)
    private boolean phoneVerified = false; // 휴대폰 인증 여부
    
    @Column(length = 100)
    private String userSeqNo; // KFTC에서 발급받은 사용자 일련번호
    
    @Column(length = 1000)
    private String accessToken; // KFTC 액세스 토큰
    
    @Column(length = 1000)
    private String refreshToken; // KFTC 리프레시 토큰
    
    public void updatePhoneVerified() {
        this.phoneVerified = true;
    }
    
    public void updateKftcTokens(String userSeqNo, String accessToken, String refreshToken) {
        this.userSeqNo = userSeqNo;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
} 