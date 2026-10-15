package com.mavis.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "job_cards")
public class JobCard {

    @Id
    private String id; // e.g. JC-801

    @Column(name = "booking_id")
    private String bookingId;

    @Column(name = "vehicle_name")
    private String vehicleName;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "mechanic_id")
    private Long mechanicId;

    @Column(name = "mechanic_name")
    private String mechanicName;

    private String status; // In Progress, Completed

    private String priority; // Normal, High, Critical

    @Column(name = "progress_percent")
    private Integer progressPercent;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "updated_at")
    private String updatedAt;

    public JobCard() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Long getMechanicId() { return mechanicId; }
    public void setMechanicId(Long mechanicId) { this.mechanicId = mechanicId; }

    public String getMechanicName() { return mechanicName; }
    public void setMechanicName(String mechanicName) { this.mechanicName = mechanicName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
