package com.miaw.dto;

import java.time.LocalTime;

public class NotificationSettingsRequest {
    private boolean moodReminderEnabled;
    private boolean habitReminderEnabled;
    private LocalTime moodReminderTime;
    private LocalTime habitReminderTime;

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
