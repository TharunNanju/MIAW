package com.miaw.dto;

import com.miaw.model.MoodLevel;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MoodEntryRequest {
    @NotNull
    private MoodLevel moodLevel;

    private String note;

    private LocalDate entryDate;

    public MoodLevel getMoodLevel() {
        return moodLevel;
    }

    public void setMoodLevel(MoodLevel moodLevel) {
        this.moodLevel = moodLevel;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }
}
