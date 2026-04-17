package com.miaw.core.controller;

import com.miaw.core.report.MoodReportResult;
import com.miaw.core.service.ReportService;
import com.miaw.model.User;
import java.time.LocalDate;

public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    public MoodReportResult generateMoodReport(User user, LocalDate startDate, LocalDate endDate) {
        return reportService.generateMoodReport(user, startDate, endDate);
    }
}
