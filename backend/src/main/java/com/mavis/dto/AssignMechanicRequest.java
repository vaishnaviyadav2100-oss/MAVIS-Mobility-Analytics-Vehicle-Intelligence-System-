package com.mavis.dto;

public class AssignMechanicRequest {
    private String mechanicName;
    private Long mechanicId;

    public AssignMechanicRequest() {}

    public String getMechanicName() { return mechanicName; }
    public void setMechanicName(String mechanicName) { this.mechanicName = mechanicName; }

    public Long getMechanicId() { return mechanicId; }
    public void setMechanicId(Long mechanicId) { this.mechanicId = mechanicId; }
}
