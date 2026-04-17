package com.miaw.repository;

import com.miaw.model.NotificationSettings;
import com.miaw.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, Long> {
    Optional<NotificationSettings> findByUser(User user);
}
