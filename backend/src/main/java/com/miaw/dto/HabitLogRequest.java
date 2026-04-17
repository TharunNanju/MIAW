package com.miaw.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class HabitLogRequest {
    @NotNull
    private LocalDate logDate;

    private boolean completed;

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
