package com.mavis.dto;

import java.util.Map;

public class AIComplaintRequest {
    private String complaint;
    private Map<String, Object> vehicle;

    public AIComplaintRequest() {}

    public String getComplaint() { return complaint; }
    public void setComplaint(String complaint) { this.complaint = complaint; }

    public Map<String, Object> getVehicle() { return vehicle; }
    public void setVehicle(Map<String, Object> vehicle) { this.vehicle = vehicle; }
}
