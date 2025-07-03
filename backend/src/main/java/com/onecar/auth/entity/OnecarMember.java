package com.onecar.auth.entity;

import com.onecar.common.domain.DateTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "onecar_member")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnecarMember extends DateTimeEntity implements UserDetails {
    
    @Id
    @Column(name = "id", length = 50)
    private String id;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "name", nullable = false, length = 50)
    private String name;
    
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    @Column(name = "phone", nullable = false, length = 15)
    private String phone;
    
    @Column(name = "user_seq_no", length = 50)
    private String userSeqNo; // 금융결제원에서 받는 user_seq_no
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private MemberRole role = MemberRole.USER;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    // Spring Security UserDetails 구현
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public String getUsername() {
        return id;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return isActive;
    }
    
    // 비즈니스 메서드
    public void updateUserSeqNo(String userSeqNo) {
        this.userSeqNo = userSeqNo;
    }
    
    public void deactivate() {
        this.isActive = false;
    }
    
    public void activate() {
        this.isActive = true;
    }
    
    public enum MemberRole {
        USER, ADMIN
    }
}