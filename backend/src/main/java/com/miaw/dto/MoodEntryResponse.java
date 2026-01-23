package com.miaw.dto;

import com.miaw.model.MoodLevel;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MoodEntryResponse {
    private Long id;
    private LocalDate entryDate;
    private MoodLevel moodLevel;
    private String note;
    private LocalDateTime createdAt;

    public MoodEntryResponse(Long id, LocalDate entryDate, MoodLevel moodLevel, String note, LocalDateTime createdAt) {
        this.id = id;
        this.entryDate = entryDate;
        this.moodLevel = moodLevel;
        this.note = note;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public MoodLevel getMoodLevel() {
        return moodLevel;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
