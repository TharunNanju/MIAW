package com.miaw.config;

import com.miaw.model.Role;
import com.miaw.model.User;
import com.miaw.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    public CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> userRepository.findByEmail("admin@miaw.local")
            .orElseGet(() -> {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@miaw.local");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                return userRepository.save(admin);
            });
    }
}
