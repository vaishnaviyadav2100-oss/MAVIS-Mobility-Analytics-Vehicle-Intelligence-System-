package com.mavis.service;

import com.mavis.entity.JobCard;
import com.mavis.entity.ServiceBooking;
import com.mavis.repository.JobCardRepository;
import com.mavis.repository.ServiceBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class JobCardService {

    private final JobCardRepository jobCardRepository;
    private final ServiceBookingRepository bookingRepository;

    public JobCardService(JobCardRepository jobCardRepository, ServiceBookingRepository bookingRepository) {
        this.jobCardRepository = jobCardRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<JobCard> getAllJobs() {
        return jobCardRepository.findAll();
    }

    public List<JobCard> getJobsByMechanicId(Long mechanicId) {
        return jobCardRepository.findByMechanicId(mechanicId);
    }

    public JobCard getJobById(String jobId) {
        return jobCardRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job Card not found: " + jobId));
    }

    @Transactional
    public JobCard updateJob(String jobId, JobCard updateData) {
        JobCard job = getJobById(jobId);
        if (updateData.getStatus() != null) job.setStatus(updateData.getStatus());
        if (updateData.getProgressPercent() != null) job.setProgressPercent(updateData.getProgressPercent());
        if (updateData.getNotes() != null) job.setNotes(updateData.getNotes());
        job.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a")));
        
        JobCard saved = jobCardRepository.save(job);

        // Synchronize linked ServiceBooking status so Admin & Customer dashboards reflect the latest status
        if (job.getBookingId() != null) {
            Optional<ServiceBooking> optBooking = bookingRepository.findById(job.getBookingId());
            if (optBooking.isPresent()) {
                ServiceBooking booking = optBooking.get();
                if (updateData.getStatus() != null) {
                    booking.setStatus(updateData.getStatus());
                }
                bookingRepository.save(booking);
            }
        }

        return saved;
    }
}
