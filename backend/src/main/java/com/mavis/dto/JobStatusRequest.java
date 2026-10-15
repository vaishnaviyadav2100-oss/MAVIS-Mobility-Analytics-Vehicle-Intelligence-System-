package com.mavis.dto;

public class JobStatusRequest {
    private String status;
    private String notes;
    private Integer progressPercent;

    public JobStatusRequest() {}

    public JobStatusRequest(String status, String notes, Integer progressPercent) {
        this.status = status;
        this.notes = notes;
        this.progressPercent = progressPercent;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
}
