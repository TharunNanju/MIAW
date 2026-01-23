package com.miaw.controller;

import com.miaw.dto.NotificationSettingsRequest;
import com.miaw.dto.NotificationSettingsResponse;
import com.miaw.model.NotificationSettings;
import com.miaw.model.User;
import com.miaw.service.AuthService;
import com.miaw.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final AuthService authService;
    private final NotificationService notificationService;

    public NotificationController(AuthService authService, NotificationService notificationService) {
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @GetMapping("/settings")
    public NotificationSettingsResponse settings() {
        User user = authService.getCurrentUser();
        NotificationSettings settings = notificationService.getSettings(user);
        return toResponse(settings);
    }

    @PutMapping("/settings")
    public NotificationSettingsResponse update(@RequestBody NotificationSettingsRequest request) {
        User user = authService.getCurrentUser();
        NotificationSettings settings = notificationService.updateSettings(user, request);
        return toResponse(settings);
    }

    private NotificationSettingsResponse toResponse(NotificationSettings settings) {
        return new NotificationSettingsResponse(
            settings.getId(),
            settings.isMoodReminderEnabled(),
            settings.isHabitReminderEnabled(),
            settings.getMoodReminderTime(),
            settings.getHabitReminderTime()
        );
    }
}
