package com.miaw.controller;

import com.miaw.dto.HabitConsistencyResponse;
import com.miaw.dto.MoodSummaryResponse;
import com.miaw.model.User;
import com.miaw.service.AuthService;
import com.miaw.service.ReportService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final AuthService authService;
    private final ReportService reportService;

    public ReportController(AuthService authService, ReportService reportService) {
        this.authService = authService;
        this.reportService = reportService;
    }

    @GetMapping("/moods")
    public MoodSummaryResponse moodSummary(
        @RequestParam(defaultValue = "weekly") String period,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        User user = authService.getCurrentUser();
        LocalDate end = endDate != null ? endDate : LocalDate.now();
        LocalDate start;
        if (startDate != null) {
            start = startDate;
        } else if ("monthly".equalsIgnoreCase(period)) {
            start = end.withDayOfMonth(1);
        } else {
            start = end.minusDays(6);
        }
        return reportService.getMoodSummary(user, start, end);
    }

    @GetMapping("/habits")
    public List<HabitConsistencyResponse> habitSummary(@RequestParam(defaultValue = "30") int days) {
        User user = authService.getCurrentUser();
        return reportService.getHabitConsistencyReport(user, days);
    }
}
