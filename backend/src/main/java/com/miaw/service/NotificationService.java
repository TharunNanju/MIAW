package com.miaw.service;

import com.miaw.dto.NotificationSettingsRequest;
import com.miaw.model.NotificationSettings;
import com.miaw.model.User;
import com.miaw.repository.NotificationSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final NotificationSettingsRepository notificationSettingsRepository;

    public NotificationService(NotificationSettingsRepository notificationSettingsRepository) {
        this.notificationSettingsRepository = notificationSettingsRepository;
    }

    public NotificationSettings getSettings(User user) {
        return notificationSettingsRepository.findByUser(user)
            .orElseGet(() -> {
                NotificationSettings settings = new NotificationSettings();
                settings.setUser(user);
                return notificationSettingsRepository.save(settings);
            });
    }

    public NotificationSettings updateSettings(User user, NotificationSettingsRequest request) {
        NotificationSettings settings = getSettings(user);
        settings.setMoodReminderEnabled(request.isMoodReminderEnabled());
        settings.setHabitReminderEnabled(request.isHabitReminderEnabled());
        settings.setMoodReminderTime(request.getMoodReminderTime());
        settings.setHabitReminderTime(request.getHabitReminderTime());
        return notificationSettingsRepository.save(settings);
    }
}
