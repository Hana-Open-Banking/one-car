package com.onecar.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KftcTokenResponse {
    
    @JsonProperty("access_token")
    private String accessToken;
    
    @JsonProperty("token_type")
    private String tokenType;
    
    @JsonProperty("expires_in")
    private Integer expiresIn;
    
    @JsonProperty("refresh_token")
    private String refreshToken;
    
    @JsonProperty("scope")
    private String scope;
    
    @JsonProperty("user_seq_no")
    private String userSeqNo;
    
    @JsonProperty("user_name")
    private String userName;
}