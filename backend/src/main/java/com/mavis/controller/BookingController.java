package com.mavis.controller;

import com.mavis.dto.AssignMechanicRequest;
import com.mavis.dto.StatusUpdateRequest;
import com.mavis.entity.ServiceBooking;
import com.mavis.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceBooking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<ServiceBooking>> getMyBookings(@RequestParam(defaultValue = "1") Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<ServiceBooking> createBooking(@RequestBody ServiceBooking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceBooking> updateStatus(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateStatus(id, request.getStatus()));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<ServiceBooking> assignMechanic(@PathVariable String id, @RequestBody AssignMechanicRequest request) {
        return ResponseEntity.ok(bookingService.assignMechanic(id, request.getMechanicName(), request.getMechanicId()));
    }
}
