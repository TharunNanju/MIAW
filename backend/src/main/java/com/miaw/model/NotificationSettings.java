package com.miaw.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalTime;

@Entity
@Table(name = "notification_settings")
public class NotificationSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private boolean moodReminderEnabled = true;

    @Column(nullable = false)
    private boolean habitReminderEnabled = true;

    private LocalTime moodReminderTime;

    private LocalTime habitReminderTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isMoodReminderEnabled() {
        return moodReminderEnabled;
    }

    public void setMoodReminderEnabled(boolean moodReminderEnabled) {
        this.moodReminderEnabled = moodReminderEnabled;
    }

    public boolean isHabitReminderEnabled() {
        return habitReminderEnabled;
    }

    public void setHabitReminderEnabled(boolean habitReminderEnabled) {
        this.habitReminderEnabled = habitReminderEnabled;
    }

    public LocalTime getMoodReminderTime() {
        return moodReminderTime;
    }

    public void setMoodReminderTime(LocalTime moodReminderTime) {
        this.moodReminderTime = moodReminderTime;
    }

    public LocalTime getHabitReminderTime() {
        return habitReminderTime;
    }

    public void setHabitReminderTime(LocalTime habitReminderTime) {
        this.habitReminderTime = habitReminderTime;
    }
}
