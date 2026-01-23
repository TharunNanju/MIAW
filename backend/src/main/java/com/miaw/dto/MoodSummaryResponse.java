package com.miaw.dto;

import com.miaw.model.MoodLevel;
import java.time.LocalDate;
import java.util.Map;

public class MoodSummaryResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private Map<MoodLevel, Long> moodCounts;

    public MoodSummaryResponse(LocalDate startDate, LocalDate endDate, Map<MoodLevel, Long> moodCounts) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.moodCounts = moodCounts;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Map<MoodLevel, Long> getMoodCounts() {
        return moodCounts;
    }
}
