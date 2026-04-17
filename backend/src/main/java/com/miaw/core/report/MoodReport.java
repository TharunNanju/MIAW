package com.miaw.core.report;

import com.miaw.dao.MoodDAO;
import com.miaw.model.MoodEntry;
import com.miaw.model.MoodLevel;
import com.miaw.model.User;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public class MoodReport implements ReportStrategy<MoodReportResult> {
    private final MoodDAO moodDAO;

    public MoodReport(MoodDAO moodDAO) {
        this.moodDAO = moodDAO;
    }

    @Override
    public MoodReportResult generate(User user, LocalDate startDate, LocalDate endDate) {
        Map<MoodLevel, Long> counts = new EnumMap<>(MoodLevel.class);
        for (MoodLevel level : MoodLevel.values()) {
            counts.put(level, 0L);
        }
        List<MoodEntry> entries = moodDAO.findAllByUser(user).stream()
            .filter(entry -> !entry.getEntryDate().isBefore(startDate))
            .filter(entry -> !entry.getEntryDate().isAfter(endDate))
            .toList();
        entries.forEach(entry -> {
            MoodLevel level = entry.getMoodLevel();
            long current = counts.getOrDefault(level, 0L);
            counts.put(level, current + 1);
        });
        return new MoodReportResult(startDate, endDate, counts);
    }
}
