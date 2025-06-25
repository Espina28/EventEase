package com.Project.Backend.Controller;

import com.Project.Backend.DTO.UnavailableDatesDTO;
import com.Project.Backend.Entity.UnavailableDatesEntity;
import com.Project.Backend.Service.UnavailableDatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/subcontractor/unavailable-dates")
public class UnavailableDatesController {

    @Autowired
    private UnavailableDatesService unavailableDatesService;

    // Get all unavailable dates for a subcontractor
    @GetMapping
    public ResponseEntity<List<UnavailableDatesEntity>> getUnavailableDates(@RequestParam String email) {
        List<UnavailableDatesEntity> unavailableDates = unavailableDatesService.getUnavailableDatesByEmail(email);
        return ResponseEntity.ok(unavailableDates);
    }

    // Add a new unavailable date
    @PostMapping()
    public ResponseEntity<?> addUnavailableDate(@RequestBody UnavailableDatesDTO dto) {
        try {
            UnavailableDatesEntity savedDate = unavailableDatesService.addUnavailableDate(
                dto.getEmail(), 
                dto.getDate(), 
                dto.getReason()
            );
            return ResponseEntity.ok(savedDate);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Add multiple unavailable dates at once
    @PostMapping("/batch")
    public ResponseEntity<?> addMultipleUnavailableDates(
            @RequestParam String email,
            @RequestBody List<Date> dates,
            @RequestParam(required = false, defaultValue = "") String reason) {
        try {
            List<UnavailableDatesEntity> savedDates = unavailableDatesService.addMultipleUnavailableDates(email, dates, reason);
            return ResponseEntity.ok(savedDates);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Delete an unavailable date
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUnavailableDate(@PathVariable String id) {
        try {
            // Check if the date exists first
            UnavailableDatesEntity date = unavailableDatesService.getUnavailableDateById(Integer.parseInt(id));
            if (date == null) {
                return ResponseEntity.notFound().build();
            }
            
            unavailableDatesService.deleteUnavailableDate(Integer.parseInt(id));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
