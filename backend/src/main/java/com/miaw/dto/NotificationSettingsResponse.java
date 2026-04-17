package com.miaw.dto;

import java.time.LocalTime;

public class NotificationSettingsResponse {
    private Long id;
    private boolean moodReminderEnabled;
    private boolean habitReminderEnabled;
    private LocalTime moodReminderTime;
    private LocalTime habitReminderTime;

    public NotificationSettingsResponse(Long id, boolean moodReminderEnabled, boolean habitReminderEnabled, LocalTime moodReminderTime, LocalTime habitReminderTime) {
        this.id = id;
        this.moodReminderEnabled = moodReminderEnabled;
        this.habitReminderEnabled = habitReminderEnabled;
        this.moodReminderTime = moodReminderTime;
        this.habitReminderTime = habitReminderTime;
    }

    public Long getId() {
        return id;
    }

    public boolean isMoodReminderEnabled() {
        return moodReminderEnabled;
    }

    public boolean isHabitReminderEnabled() {
        return habitReminderEnabled;
    }

    public LocalTime getMoodReminderTime() {
        return moodReminderTime;
    }

    public LocalTime getHabitReminderTime() {
        return habitReminderTime;
    }
}
