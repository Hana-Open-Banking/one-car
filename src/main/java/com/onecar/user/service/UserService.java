package com.onecar.user.service;

import com.onecar.common.exception.BusinessException;
import com.onecar.common.exception.ErrorCode;
import com.onecar.user.dto.KftcTokenResponse;
import com.onecar.user.dto.UserRegisterRequest;
import com.onecar.user.dto.UserRegisterResponse;
import com.onecar.user.entity.User;
import com.onecar.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PhoneVerificationService phoneVerificationService;
    private final KftcService kftcService;
    
    /**
     * 사용자 회원가입
     */
    public UserRegisterResponse registerUser(UserRegisterRequest request) {
        // 중복 확인
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BusinessException(ErrorCode.DUPLICATED_PHONE_NUMBER);
        }
        
        if (userRepository.existsBySocialSecurityNumber(request.getSocialSecurityNumber())) {
            throw new BusinessException(ErrorCode.DUPLICATED_SOCIAL_SECURITY_NUMBER);
        }
        
        // 휴대폰 인증 여부 확인
        if (!phoneVerificationService.isPhoneVerified(request.getPhoneNumber())) {
            throw new BusinessException(ErrorCode.PHONE_VERIFICATION_REQUIRED);
        }

        // 주민등록번호 체크섬 검증
        if (!validateSocialSecurityNumber(request.getSocialSecurityNumber())) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_SECURITY_NUMBER);
        }
        
        // 사용자 생성
        User user = User.builder()
                .name(request.getName())
                .socialSecurityNumber(request.getSocialSecurityNumber())
                .phoneNumber(request.getPhoneNumber())
                .phoneVerified(true)
                .build();
        
        user = userRepository.save(user);
        
        log.info("사용자 회원가입 완료: userId={}, phoneNumber={}", user.getId(), user.getPhoneNumber());
        
        // KFTC 인증 URL 생성
        String kftcAuthUrl = kftcService.generateAuthUrl(user.getId().toString());
        
        return UserRegisterResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .phoneVerified(user.isPhoneVerified())
                .kftcAuthUrl(kftcAuthUrl)  // KFTC 인증 URL 추가
                .build();
    }
    
    /**
     * KFTC 오픈뱅킹 연동
     */
    public String connectKftc(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND, "사용자를 찾을 수 없습니다."));
        
        if (!user.isPhoneVerified()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE, "휴대폰 인증이 필요합니다.");
        }
        
        // KFTC 인증 URL 생성
        String authUrl = kftcService.generateAuthUrl(userId.toString());
        
        log.info("KFTC 연동 시작: userId={}, authUrl={}", userId, authUrl);
        
        return authUrl;
    }
    
    /**
     * KFTC OAuth 콜백 처리
     */
    public UserRegisterResponse handleKftcCallback(String code, String state) {
        try {
            Long userId = Long.parseLong(state);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND, "사용자를 찾을 수 없습니다."));
            
            // KFTC 토큰 발급
            KftcTokenResponse tokenResponse = kftcService.getAccessToken(code);
            
            // 사용자 정보에 토큰 저장
            user.updateKftcTokens(
                    tokenResponse.getUserSeqNo(),
                    tokenResponse.getAccessToken(),
                    tokenResponse.getRefreshToken()
            );
            
            log.info("KFTC 연동 완료: userId={}, userSeqNo={}", userId, tokenResponse.getUserSeqNo());
            
            return UserRegisterResponse.builder()
                    .userId(user.getId())
                    .name(user.getName())
                    .phoneNumber(user.getPhoneNumber())
                    .phoneVerified(user.isPhoneVerified())
                    .userSeqNo(user.getUserSeqNo())
                    .accessToken(user.getAccessToken())
                    .kftcAuthUrl(null)  // 이미 KFTC 연동 완료
                    .build();
            
        } catch (NumberFormatException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE, "유효하지 않은 state 값입니다.");
        }
    }
    
    /**
     * 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserRegisterResponse getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND, "사용자를 찾을 수 없습니다."));
        
        // KFTC 연동이 안 되어 있으면 인증 URL 제공
        String kftcAuthUrl = (user.getAccessToken() == null) ? 
                kftcService.generateAuthUrl(userId.toString()) : null;
        
        return UserRegisterResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .phoneVerified(user.isPhoneVerified())
                .userSeqNo(user.getUserSeqNo())
                .accessToken(user.getAccessToken())
                .kftcAuthUrl(kftcAuthUrl)
                .build();
    }

    /**
     * 주민등록번호 체크섬 검증
     */
    private boolean validateSocialSecurityNumber(String ssn) {
        if (ssn == null || ssn.length() != 13) {
            log.warn("주민등록번호 길이 오류: {}", ssn != null ? ssn.length() : "null");
            return false;
        }
        
        try {
            // 숫자만 확인
            for (char c : ssn.toCharArray()) {
                if (!Character.isDigit(c)) {
                    log.warn("주민등록번호에 숫자가 아닌 문자 포함");
                    return false;
                }
            }
            
            // 체크섬 검증
            int[] weights = {2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5};
            int sum = 0;
            
            for (int i = 0; i < 12; i++) {
                sum += Character.getNumericValue(ssn.charAt(i)) * weights[i];
            }
            
            int remainder = sum % 11;
            int checkDigit = (11 - remainder) % 10;
            
            int actualCheckDigit = Character.getNumericValue(ssn.charAt(12));
            
            boolean isValidChecksum = checkDigit == actualCheckDigit;
            boolean isValidBirthDate = validateBirthDate(ssn);
            boolean isValid = isValidChecksum && isValidBirthDate;
            
            log.info("주민등록번호 검증: {} -> {} (체크섬: {}, 생년월일: {})", 
                    ssn.substring(0, 6) + "******", 
                    isValid ? "유효" : "무효",
                    isValidChecksum ? "통과" : "실패",
                    isValidBirthDate ? "통과" : "실패");
            
            return isValid;
            
        } catch (Exception e) {
            log.error("주민등록번호 검증 중 오류: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 생년월일 범위 검증
     */
    private boolean validateBirthDate(String ssn) {
        try {
            String yearPrefix = ssn.substring(0, 2);
            String month = ssn.substring(2, 4);
            String day = ssn.substring(4, 6);
            char genderCode = ssn.charAt(6);
            
            int yearNum = Integer.parseInt(yearPrefix);
            int monthNum = Integer.parseInt(month);
            int dayNum = Integer.parseInt(day);
            
            // 성별코드로 세기 판단
            int fullYear;
            if (genderCode == '1' || genderCode == '2') {
                fullYear = 1900 + yearNum;
            } else if (genderCode == '3' || genderCode == '4') {
                fullYear = 2000 + yearNum;
            } else {
                log.warn("유효하지 않은 성별코드: {}", genderCode);
                return false;
            }
            
            // 현재 연도 기준 범위 검증
            int currentYear = java.time.LocalDate.now().getYear();
            if (fullYear < 1900 || fullYear > currentYear + 1) {
                log.warn("유효하지 않은 생년: {}", fullYear);
                return false;
            }
            
            // 월 검증 (1~12)
            if (monthNum < 1 || monthNum > 12) {
                log.warn("유효하지 않은 월: {}", monthNum);
                return false;
            }
            
            // 일 검증 (1~31)
            if (dayNum < 1 || dayNum > 31) {
                log.warn("유효하지 않은 일: {}", dayNum);
                return false;
            }
            
            return true;
        } catch (Exception e) {
            log.error("생년월일 검증 중 오류: {}", e.getMessage());
            return false;
        }
    }
} 