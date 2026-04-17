package com.miaw.core.report;

import com.miaw.model.MoodLevel;
import java.time.LocalDate;
import java.util.Map;

public class MoodReportResult {
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final Map<MoodLevel, Long> counts;

    public MoodReportResult(LocalDate startDate, LocalDate endDate, Map<MoodLevel, Long> counts) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.counts = counts;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Map<MoodLevel, Long> getCounts() {
        return counts;
    }
}
