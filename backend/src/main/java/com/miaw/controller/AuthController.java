package com.miaw.controller;

import com.miaw.dto.LoginResponse;
import com.miaw.dto.RegisterRequest;
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
    public LoginResponse register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return new LoginResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @GetMapping("/login")
    public LoginResponse login() {
        User user = authService.getCurrentUser();
        return new LoginResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
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
