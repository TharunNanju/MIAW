package com.miaw.controller;

import com.miaw.dto.LoginRequest;
import com.miaw.dto.LoginResponse;
import com.miaw.dto.RefreshRequest;
import com.miaw.dto.RegisterRequest;
import com.miaw.dto.TokenResponse;
import com.miaw.model.User;
import com.miaw.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.registerAndIssueTokens(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        User user = authService.getCurrentUser();
        authService.logout(user);
    }

    @GetMapping("/me")
    public LoginResponse me() {
        User user = authService.getCurrentUser();
        return new LoginResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}
