package com.miaw.core.controller;

import com.miaw.core.service.MoodService;
import com.miaw.model.MoodEntry;
import com.miaw.model.MoodLevel;
import com.miaw.model.User;
import java.time.LocalDate;
import java.util.List;

public class MoodController {
    private final MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    public MoodEntry logMood(User user, MoodLevel moodLevel, String note, LocalDate date) {
        return moodService.logMood(user, moodLevel, note, date);
    }

    public List<MoodEntry> listMoods(User user) {
        return moodService.listMoods(user);
    }
}
