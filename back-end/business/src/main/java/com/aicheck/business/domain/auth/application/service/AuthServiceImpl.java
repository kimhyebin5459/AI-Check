package com.aicheck.business.domain.auth.application.service;

import com.aicheck.business.domain.account.infrastructure.client.BankClient;
import com.aicheck.business.domain.auth.domain.entity.Member;
import com.aicheck.business.domain.auth.domain.entity.MemberType;
import com.aicheck.business.domain.auth.domain.repository.MemberRepository;
import com.aicheck.business.domain.auth.dto.BankMemberFeignResponse;
import com.aicheck.business.domain.auth.dto.SignInRequest;
import com.aicheck.business.domain.auth.dto.SignInResponse;
import com.aicheck.business.domain.auth.dto.SignupRequest;
import com.aicheck.business.domain.auth.dto.TokenReissueResponse;
import com.aicheck.business.domain.auth.exception.BusinessException;
import com.aicheck.business.global.error.BusinessErrorCodes;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;
    private final BankClient bankClient;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void signUp(SignupRequest request) {
        BankMemberFeignResponse response = bankClient.findBankMemberByEmail(request.getEmail());
        Member member = Member.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .managerId(response.getId())
                .bankMemberId(response.getId())
                .name(response.getName())
                .birth(response.getBirth())
                .type(request.getIsParent() ? MemberType.PARENT : MemberType.CHILD)
                .build();

        try {
            memberRepository.save(member);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(BusinessErrorCodes.DUPLICATED_SIGNUP);
        }
    }

    @Override
    public SignInResponse signIn(SignInRequest request) {
        Member member = memberRepository.findMemberByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.BUSINESS_MEMBER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new BusinessException(BusinessErrorCodes.INVALID_PASSWORD);
        }

        Authentication authentication = authenticate(member);
        String accessToken = jwtProvider.generateAccessToken(authentication);
        String refreshToken = jwtProvider.generateRefreshToken(authentication);

        return SignInResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .isParent(member.getType().equals(MemberType.PARENT))
                .accountConnected(member.getAccountNo() != null)
                .build();
    }

    @Override
    public TokenReissueResponse reIssueToken(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.BUSINESS_MEMBER_NOT_FOUND));
        Authentication authentication = authenticate(member);
        String accessToken = jwtProvider.generateAccessToken(authentication);
        return TokenReissueResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    private Authentication authenticate(Member member) {
        User user = new User(
                String.valueOf(member.getId()),
                "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + member.getType().name()))
        );
        return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    }
}