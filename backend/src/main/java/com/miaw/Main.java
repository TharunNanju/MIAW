package com.miaw;

import com.miaw.core.controller.MoodController;
import com.miaw.core.controller.ReportController;
import com.miaw.core.controller.UserController;
import com.miaw.core.report.MoodReport;
import com.miaw.core.report.MoodReportResult;
import com.miaw.core.service.MoodService;
import com.miaw.core.service.ReportService;
import com.miaw.core.service.UserService;
import com.miaw.dao.InMemoryMoodDAO;
import com.miaw.dao.InMemoryUserDAO;
import com.miaw.db.DBConnection;
import com.miaw.model.MoodLevel;
import com.miaw.model.User;
import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        DBConnection connection = DBConnection.getInstance();
        connection.connect();

        InMemoryUserDAO userDAO = new InMemoryUserDAO();
        InMemoryMoodDAO moodDAO = new InMemoryMoodDAO();

        UserService userService = new UserService(userDAO);
        MoodService moodService = new MoodService(moodDAO);
        ReportService reportService = new ReportService(new MoodReport(moodDAO));

        UserController userController = new UserController(userService);
        MoodController moodController = new MoodController(moodService);
        ReportController reportController = new ReportController(reportService);

        User registered = userController.register("Jamie", "jamie@example.com", "password123");
        User loggedIn = userController.login("jamie@example.com", "password123");

        moodController.logMood(loggedIn, MoodLevel.CALM, "Felt steady and focused.", LocalDate.now());

        MoodReportResult report = reportController.generateMoodReport(
            loggedIn,
            LocalDate.now().minusDays(6),
            LocalDate.now()
        );

        System.out.println("User: " + registered.getName());
        System.out.println("Mood report from " + report.getStartDate() + " to " + report.getEndDate());
        report.getCounts().forEach((level, count) -> System.out.println(level + ": " + count));

        connection.close();
    }
}
