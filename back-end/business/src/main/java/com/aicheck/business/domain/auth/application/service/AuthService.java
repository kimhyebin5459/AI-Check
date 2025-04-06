package com.aicheck.business.domain.auth.application.service;

import com.aicheck.business.domain.auth.dto.SignInRequest;
import com.aicheck.business.domain.auth.dto.SignInResponse;
import com.aicheck.business.domain.auth.dto.SignupRequest;
import com.aicheck.business.domain.auth.dto.TokenReissueResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    void signUp(SignupRequest request);

    SignInResponse signIn(SignInRequest request);
    
    TokenReissueResponse reIssueToken(Long memberId);
}
