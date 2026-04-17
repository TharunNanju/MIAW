package com.miaw.core.service;

import com.miaw.dao.UserDAO;
import com.miaw.model.Role;
import com.miaw.model.User;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public class UserService {
    private final UserDAO userDAO;

    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public User register(String name, String email, String password) {
        userDAO.findByEmail(email).ifPresent(existing -> {
            throw new IllegalArgumentException("Email already registered");
        });
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(hashPassword(password));
        user.setRole(Role.USER);
        return userDAO.save(user);
    }

    public User login(String email, String password) {
        User user = userDAO.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!user.getPasswordHash().equals(hashPassword(password))) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return user;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Password hashing failed", ex);
        }
    }
}
