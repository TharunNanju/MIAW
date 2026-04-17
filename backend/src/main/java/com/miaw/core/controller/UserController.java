package com.miaw.core.controller;

import com.miaw.core.service.UserService;
import com.miaw.model.User;

public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    public User register(String name, String email, String password) {
        return userService.register(name, email, password);
    }

    public User login(String email, String password) {
        return userService.login(email, password);
    }
}
