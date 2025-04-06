package com.aicheck.business.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenReissueResponse {
    private String accessToken;
}
