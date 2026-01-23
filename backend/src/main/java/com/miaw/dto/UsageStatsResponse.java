package com.miaw.dto;

public class UsageStatsResponse {
    private long totalUsers;
    private long totalMoodEntries;
    private long totalJournalEntries;
    private long totalHabits;
    private long totalAssessments;

    public UsageStatsResponse(long totalUsers, long totalMoodEntries, long totalJournalEntries, long totalHabits, long totalAssessments) {
        this.totalUsers = totalUsers;
        this.totalMoodEntries = totalMoodEntries;
        this.totalJournalEntries = totalJournalEntries;
        this.totalHabits = totalHabits;
        this.totalAssessments = totalAssessments;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalMoodEntries() {
        return totalMoodEntries;
    }

    public long getTotalJournalEntries() {
        return totalJournalEntries;
    }

    public long getTotalHabits() {
        return totalHabits;
    }

    public long getTotalAssessments() {
        return totalAssessments;
    }
}
