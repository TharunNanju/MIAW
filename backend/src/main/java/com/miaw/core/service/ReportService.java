package com.miaw.core.service;

import com.miaw.core.report.MoodReportResult;
import com.miaw.core.report.ReportStrategy;
import com.miaw.model.User;
import java.time.LocalDate;

public class ReportService {
    private final ReportStrategy<MoodReportResult> reportStrategy;

    public ReportService(ReportStrategy<MoodReportResult> reportStrategy) {
        this.reportStrategy = reportStrategy;
    }

    public MoodReportResult generateMoodReport(User user, LocalDate startDate, LocalDate endDate) {
        return reportStrategy.generate(user, startDate, endDate);
    }
}
