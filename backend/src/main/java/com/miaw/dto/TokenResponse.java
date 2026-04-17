package com.miaw.dto;

import com.miaw.model.Role;

public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private Long id;
    private String name;
    private String email;
    private Role role;

    public TokenResponse(String accessToken, String refreshToken, Long id, String name, String email, Role role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}
