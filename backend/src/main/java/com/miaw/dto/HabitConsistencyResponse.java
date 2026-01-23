package com.miaw.dto;

public class HabitConsistencyResponse {
    private Long habitId;
    private String habitName;
    private double completionRate;
    private int currentStreak;
    private int longestStreak;

    public HabitConsistencyResponse(Long habitId, String habitName, double completionRate, int currentStreak, int longestStreak) {
        this.habitId = habitId;
        this.habitName = habitName;
        this.completionRate = completionRate;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
    }

    public Long getHabitId() {
        return habitId;
    }

    public String getHabitName() {
        return habitName;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }
}
