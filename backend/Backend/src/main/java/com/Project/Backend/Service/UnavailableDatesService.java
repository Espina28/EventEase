package com.Project.Backend.Service;

import com.Project.Backend.Entity.UnavailableDates;
import com.Project.Backend.Entity.SubcontractorEntity;
import com.Project.Backend.Repository.UnavailableDatesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UnavailableDatesService {

    @Autowired
    private UnavailableDatesRepo unavailableDatesRepo;
    
    @Autowired
    private SubcontractorService subcontractorService;
    
    // Get all unavailable dates for a specific subcontractor by email
    public List<UnavailableDates> getUnavailableDatesByEmail(String email) {
        return unavailableDatesRepo.findBySubcontractorEmail(email);
    }
    
    // Get all unavailable dates for a specific subcontractor by ID
    public List<UnavailableDates> getUnavailableDatesBySubcontractorId(int subcontractorId) {
        return unavailableDatesRepo.findBySubcontractorId(subcontractorId);
    }
    
    // Add a new unavailable date
    public UnavailableDates addUnavailableDate(String email, Date date, String reason) {
        SubcontractorEntity subcontractor = subcontractorService.getSubcontractorByEmail(email);
        if (subcontractor == null) {
            throw new RuntimeException("Subcontractor not found with email: " + email);
        }
        
        // Check if the date already exists for this subcontractor
        if (unavailableDatesRepo.existsBySubcontractorAndDate(subcontractor, date)) {
            throw new RuntimeException("This date is already marked as unavailable");
        }
        
        UnavailableDates unavailableDate = new UnavailableDates();
        unavailableDate.setSubcontractor(subcontractor);
        unavailableDate.setDate(date);
        unavailableDate.setReason(reason);
        unavailableDate.setCreated_at(new Timestamp(Instant.now().toEpochMilli()));
        
        return unavailableDatesRepo.save(unavailableDate);
    }
    
    // Delete an unavailable date
    public void deleteUnavailableDate(int id) {
        unavailableDatesRepo.deleteById(id);
    }
    
    // Get specific unavailable date by ID
    public UnavailableDates getUnavailableDateById(int id) {
        Optional<UnavailableDates> result = unavailableDatesRepo.findById(id);
        return result.orElse(null);
    }
    
    // Batch add unavailable dates
    public List<UnavailableDates> addMultipleUnavailableDates(String email, List<Date> dates, String reason) {
        SubcontractorEntity subcontractor = subcontractorService.getSubcontractorByEmail(email);
        if (subcontractor == null) {
            throw new RuntimeException("Subcontractor not found with email: " + email);
        }
        
        List<UnavailableDates> savedDates = dates.stream()
            .filter(date -> !unavailableDatesRepo.existsBySubcontractorAndDate(subcontractor, date))
            .map(date -> {
                UnavailableDates unavailableDate = new UnavailableDates();
                unavailableDate.setSubcontractor(subcontractor);
                unavailableDate.setDate(date);
                unavailableDate.setReason(reason);
                unavailableDate.setCreated_at(new Timestamp(Instant.now().toEpochMilli()));
                return unavailableDatesRepo.save(unavailableDate);
            })
            .toList();
        
        return savedDates;
    }
}
