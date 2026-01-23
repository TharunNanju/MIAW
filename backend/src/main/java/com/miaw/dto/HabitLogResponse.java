package com.miaw.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class HabitLogResponse {
    private Long id;
    private Long habitId;
    private LocalDate logDate;
    private boolean completed;
    private LocalDateTime createdAt;

    public HabitLogResponse(Long id, Long habitId, LocalDate logDate, boolean completed, LocalDateTime createdAt) {
        this.id = id;
        this.habitId = habitId;
        this.logDate = logDate;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getHabitId() {
        return habitId;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
