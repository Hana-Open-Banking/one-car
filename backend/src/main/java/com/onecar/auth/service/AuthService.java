package com.onecar.auth.service;

import com.onecar.auth.dto.AuthResponse;
import com.onecar.auth.dto.SignInRequest;
import com.onecar.auth.dto.SignUpRequest;
import com.onecar.auth.entity.OnecarMember;
import com.onecar.auth.entity.OnecarToken;
import com.onecar.auth.repository.OnecarMemberRepository;
import com.onecar.auth.repository.OnecarTokenRepository;
import com.onecar.auth.util.JwtTokenProvider;
import com.onecar.common.exception.BusinessException;
import com.onecar.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final OnecarMemberRepository memberRepository;
    private final OnecarTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        log.info("회원가입 시작 - id: {}, email: {}", request.getId(), request.getEmail());
        
        // 입력값 검증
        validateSignUpRequest(request);
        
        // 중복 확인
        if (memberRepository.existsById(request.getId())) {
            throw new BusinessException(ErrorCode.DUPLICATE_USER_ID);
        }
        
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
        
        if (memberRepository.existsByPhone(request.getPhone())) {
            throw new BusinessException(ErrorCode.DUPLICATE_PHONE);
        }
        
        // 회원 생성
        OnecarMember member = OnecarMember.builder()
                .id(request.getId())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        
        memberRepository.save(member);
        memberRepository.flush(); // 즉시 DB에 반영
        
        // 자동 로그인 처리 - 저장된 사용자 정보로 Authentication 생성
        OnecarMember savedMember = memberRepository.findByIdAndIsActiveTrue(request.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedMember, null, savedMember.getAuthorities());
        
        // 토큰 생성 및 저장
        return createTokenResponse(authentication);
    }
    
    @Transactional
    public AuthResponse signIn(SignInRequest request) {
        log.info("로그인 시작 - id: {}", request.getId());
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getId(), request.getPassword())
        );
        
        // 기존 토큰 무효화
        tokenRepository.revokeAllTokensByMemberId(request.getId());
        
        // 새 토큰 생성 및 저장
        return createTokenResponse(authentication);
    }
    
    @Transactional
    public void signOut(String accessToken) {
        OnecarToken token = tokenRepository.findByAccessTokenAndIsRevokedFalse(accessToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
        
        token.revoke();
        tokenRepository.save(token);
        
        log.info("로그아웃 완료 - memberId: {}", token.getMemberId());
    }
    
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        OnecarToken token = tokenRepository.findByRefreshTokenAndIsRevokedFalse(refreshToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
        
        if (token.isRefreshTokenExpired()) {
            throw new BusinessException(ErrorCode.EXPIRED_TOKEN);
        }
        
        OnecarMember member = memberRepository.findByIdAndIsActiveTrue(token.getMemberId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        // 새 토큰 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(member, null, member.getAuthorities());
        
        // 기존 토큰 무효화
        token.revoke();
        tokenRepository.save(token);
        
        return createTokenResponse(authentication);
    }
    
    @Transactional
    public void updateUserSeqNo(String memberId, String userSeqNo) {
        OnecarMember member = memberRepository.findByIdAndIsActiveTrue(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        member.updateUserSeqNo(userSeqNo);
        memberRepository.save(member);
        
        log.info("사용자 시퀀스 번호 업데이트 완료 - memberId: {}, userSeqNo: {}", memberId, userSeqNo);
    }
    
    public String getUserSeqNoByAccessToken(String accessToken) {
        OnecarToken token = tokenRepository.findByAccessTokenAndIsRevokedFalse(accessToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
        
        if (token.isExpired()) {
            throw new BusinessException(ErrorCode.EXPIRED_TOKEN);
        }
        
        OnecarMember member = memberRepository.findByIdAndIsActiveTrue(token.getMemberId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        if (member.getUserSeqNo() == null) {
            throw new BusinessException(ErrorCode.USER_SEQ_NO_NOT_FOUND);
        }
        
        return member.getUserSeqNo();
    }
    
    public String getMemberIdByAccessToken(String accessToken) {
        OnecarToken token = tokenRepository.findByAccessTokenAndIsRevokedFalse(accessToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
        
        if (token.isExpired()) {
            throw new BusinessException(ErrorCode.EXPIRED_TOKEN);
        }
        
        return token.getMemberId();
    }
    
    public boolean checkIdAvailability(String id) {
        return !memberRepository.existsById(id);
    }
    
    private void validateSignUpRequest(SignUpRequest request) {
        if (!request.isPasswordMatched()) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }
    }
    
    private AuthResponse createTokenResponse(Authentication authentication) {
        OnecarMember member = (OnecarMember) authentication.getPrincipal();
        
        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());
        
        // 토큰 저장
        OnecarToken token = OnecarToken.builder()
                .memberId(member.getId())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresAt(LocalDateTime.ofInstant(
                        jwtTokenProvider.getExpirationDateFromToken(accessToken).toInstant(),
                        ZoneId.systemDefault()))
                .refreshTokenExpiresAt(LocalDateTime.ofInstant(
                        jwtTokenProvider.getExpirationDateFromToken(refreshToken).toInstant(),
                        ZoneId.systemDefault()))
                .build();
        
        tokenRepository.save(token);
        
        // 응답 생성
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenValidityInMilliseconds() / 1000)
                .memberInfo(AuthResponse.MemberInfo.builder()
                        .id(member.getId())
                        .name(member.getName())
                        .email(member.getEmail())
                        .phone(member.getPhone())
                        .userSeqNo(member.getUserSeqNo())
                        .build())
                .build();
    }
}