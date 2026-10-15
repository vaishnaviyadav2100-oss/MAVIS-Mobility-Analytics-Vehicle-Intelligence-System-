package com.mavis.dto;

import java.util.List;

public class AIComplaintResponse {
    private String category;
    private String priority;
    private Double urgencyScore;
    private String summary;
    private List<String> inspectionAreas;
    private String preliminaryGuidance;
    private String suggestedService;
    private String estimatedTime;
    private String safetyNotice;

    public AIComplaintResponse() {}

    public AIComplaintResponse(String category, String priority, Double urgencyScore, String summary,
                               List<String> inspectionAreas, String preliminaryGuidance,
                               String suggestedService, String estimatedTime, String safetyNotice) {
        this.category = category;
        this.priority = priority;
        this.urgencyScore = urgencyScore;
        this.summary = summary;
        this.inspectionAreas = inspectionAreas;
        this.preliminaryGuidance = preliminaryGuidance;
        this.suggestedService = suggestedService;
        this.estimatedTime = estimatedTime;
        this.safetyNotice = safetyNotice;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(Double urgencyScore) { this.urgencyScore = urgencyScore; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getInspectionAreas() { return inspectionAreas; }
    public void setInspectionAreas(List<String> inspectionAreas) { this.inspectionAreas = inspectionAreas; }

    public String getPreliminaryGuidance() { return preliminaryGuidance; }
    public void setPreliminaryGuidance(String preliminaryGuidance) { this.preliminaryGuidance = preliminaryGuidance; }

    public String getSuggestedService() { return suggestedService; }
    public void setSuggestedService(String suggestedService) { this.suggestedService = suggestedService; }

    public String getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; }

    public String getSafetyNotice() { return safetyNotice; }
    public void setSafetyNotice(String safetyNotice) { this.safetyNotice = safetyNotice; }
}
