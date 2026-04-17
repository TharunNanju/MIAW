package com.miaw.core.report;

import com.miaw.model.User;
import java.time.LocalDate;

public interface ReportStrategy<R> {
    R generate(User user, LocalDate startDate, LocalDate endDate);
}
