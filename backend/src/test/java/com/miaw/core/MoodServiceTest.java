package com.miaw.core;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.miaw.core.report.MoodReport;
import com.miaw.core.report.MoodReportResult;
import com.miaw.core.service.MoodService;
import com.miaw.core.service.ReportService;
import com.miaw.dao.InMemoryMoodDAO;
import com.miaw.model.MoodLevel;
import com.miaw.model.User;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class MoodServiceTest {
    @Test
    void preventsMultipleMoodEntriesPerDay() {
        InMemoryMoodDAO moodDAO = new InMemoryMoodDAO();
        MoodService moodService = new MoodService(moodDAO);
        User user = new User();
        user.setId(1L);

        moodService.logMood(user, MoodLevel.CALM, "Note", LocalDate.now());

        assertThrows(IllegalStateException.class, () ->
            moodService.logMood(user, MoodLevel.HAPPY, "Another", LocalDate.now())
        );
    }

    @Test
    void generatesMoodReportCounts() {
        InMemoryMoodDAO moodDAO = new InMemoryMoodDAO();
        MoodService moodService = new MoodService(moodDAO);
        ReportService reportService = new ReportService(new MoodReport(moodDAO));
        User user = new User();
        user.setId(1L);

        moodService.logMood(user, MoodLevel.CALM, "Note", LocalDate.now());
        moodService.logMood(user, MoodLevel.HAPPY, "Note", LocalDate.now().minusDays(1));

        MoodReportResult result = reportService.generateMoodReport(
            user,
            LocalDate.now().minusDays(2),
            LocalDate.now()
        );

        assertEquals(1L, result.getCounts().get(MoodLevel.CALM));
        assertEquals(1L, result.getCounts().get(MoodLevel.HAPPY));
    }
}
