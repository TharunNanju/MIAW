package com.miaw.core.service;

import com.miaw.dao.MoodDAO;
import com.miaw.model.MoodEntry;
import com.miaw.model.MoodLevel;
import com.miaw.model.User;
import java.time.LocalDate;
import java.util.List;

public class MoodService {
    private final MoodDAO moodDAO;

    public MoodService(MoodDAO moodDAO) {
        this.moodDAO = moodDAO;
    }

    public MoodEntry logMood(User user, MoodLevel moodLevel, String note, LocalDate date) {
        LocalDate entryDate = date != null ? date : LocalDate.now();
        moodDAO.findByUserAndDate(user, entryDate).ifPresent(existing -> {
            throw new IllegalStateException("Mood already logged for this date");
        });
        MoodEntry entry = new MoodEntry();
        entry.setUser(user);
        entry.setEntryDate(entryDate);
        entry.setMoodLevel(moodLevel);
        entry.setNote(note);
        return moodDAO.save(entry);
    }

    public List<MoodEntry> listMoods(User user) {
        return moodDAO.findAllByUser(user);
    }
}
