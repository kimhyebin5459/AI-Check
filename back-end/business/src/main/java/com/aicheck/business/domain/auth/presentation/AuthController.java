package com.aicheck.business.domain.auth.presentation;

import com.aicheck.business.domain.auth.application.service.AuthService;
import com.aicheck.business.domain.auth.application.service.MailService;
import com.aicheck.business.domain.auth.dto.CheckCodeDto;
import com.aicheck.business.domain.auth.dto.SendAuthCodeRequest;
import com.aicheck.business.domain.auth.dto.SignInRequest;
import com.aicheck.business.domain.auth.dto.SignInResponse;
import com.aicheck.business.domain.auth.dto.SignupRequest;
import com.aicheck.business.global.auth.annotation.CurrentMemberId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private static final String AUTH_MAIL_SUBJECT = "AICHECK 가입 인증번호";

    private final AuthService authService;
    private final MailService mailService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody @Valid SignupRequest request) {
        authService.signUp(request);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<SignInResponse> signIn(@RequestBody @Valid SignInRequest request) {
        SignInResponse signInResponse = authService.signIn(request);
        return new ResponseEntity<>(signInResponse, HttpStatus.OK);
    }

    @PostMapping("/email")
    public ResponseEntity<Void> sendAuthenticationCode(
            @Valid @RequestBody SendAuthCodeRequest sendAuthCodeRequest) {
        mailService.sendAuthenticationCode(AUTH_MAIL_SUBJECT, sendAuthCodeRequest.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/email/check")
    public ResponseEntity<?> checkAuthenticationCode(@Valid @RequestBody CheckCodeDto checkCodeDTO) {
        mailService.checkCode(checkCodeDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reIssueToken(@CurrentMemberId Long memberId) {
        return ResponseEntity.ok().body(authService.reIssueToken(memberId));
    }


}
