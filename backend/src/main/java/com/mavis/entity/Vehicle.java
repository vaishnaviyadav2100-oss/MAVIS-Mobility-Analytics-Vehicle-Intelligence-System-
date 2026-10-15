package com.mavis.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "registration_no", nullable = false, unique = true)
    private String registrationNo;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    private Integer year;

    @Column(name = "fuel_type")
    private String fuelType; // Petrol, Diesel, Electric, Hybrid, CNG

    private String odometer;

    private String color;

    @Column(name = "last_service")
    private String lastService;

    private String status; // Active, In Service

    public Vehicle() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getOdometer() { return odometer; }
    public void setOdometer(String odometer) { this.odometer = odometer; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getLastService() { return lastService; }
    public void setLastService(String lastService) { this.lastService = lastService; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
