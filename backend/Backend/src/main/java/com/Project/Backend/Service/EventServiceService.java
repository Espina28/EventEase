package com.Project.Backend.Service;

import com.Project.Backend.Entity.EventServiceEntity;
import com.Project.Backend.Entity.SubcontractorEntity;
import com.Project.Backend.Entity.TransactionsEntity;
import com.Project.Backend.Repository.EventServiceRepository;
import com.Project.Backend.Repository.SubContractorRepository;
import com.Project.Backend.Repository.TransactionRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EventServiceService {

    @Autowired
    private EventServiceRepository eventServiceRepository;

    @Autowired
    private SubContractorRepository subcontractorRepository;

    @Autowired
    private TransactionRepo transactionRepository;

    public EventServiceEntity create(EventServiceEntity eventService) {
        return eventServiceRepository.save(eventService);
    }

    public EventServiceEntity readById(int id) {
        return eventServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public List<EventServiceEntity> getAll(){
        return eventServiceRepository.findAll();
    }

    public EventServiceEntity update(EventServiceEntity eventService) {
        return eventServiceRepository.save(eventService);
    }

    public void deleteById(int id) {
        eventServiceRepository.deleteById(id);
    }

        // Get event services by transaction ID
    public List<EventServiceEntity> getByTransactionId(int transactionId) {
        TransactionsEntity transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));
        return transaction.getEventServices();
    }

    // Get all unassigned event services
    public List<EventServiceEntity> getUnassignedEventServices() {
        return eventServiceRepository.findBySubcontractorIsNull();
    }

    // Assign subcontractor to event service
    public EventServiceEntity assignSubcontractor(int eventServiceId, int subcontractorId) {
        EventServiceEntity eventService = eventServiceRepository.findById(eventServiceId)
            .orElseThrow(() -> new RuntimeException("Event service not found with ID: " + eventServiceId));

        SubcontractorEntity subcontractor = subcontractorRepository.findById(subcontractorId)
            .orElseThrow(() -> new RuntimeException("Subcontractor not found with ID: " + subcontractorId));

        // Check if subcontractor is available for the event date
        Date eventDate = eventService.getTransactionsId().getTransactionDate();
        if (!isSubcontractorAvailable(subcontractor, eventDate)) {
            throw new RuntimeException("Subcontractor is not available on the event date");
        }

        eventService.setSubcontractor(subcontractor);
        return eventServiceRepository.save(eventService);
    }

    // Remove subcontractor from event service
    public EventServiceEntity removeSubcontractor(int eventServiceId) {
        EventServiceEntity eventService = eventServiceRepository.findById(eventServiceId)
            .orElseThrow(() -> new RuntimeException("Event service not found with ID: " + eventServiceId));

        eventService.setSubcontractor(null);
        return eventServiceRepository.save(eventService);
    }

    // Get available subcontractors for a service category and date
    public List<SubcontractorEntity> getAvailableSubcontractors(String serviceCategory, String eventDateStr) {
        Date eventDate = Date.valueOf(eventDateStr);
        List<SubcontractorEntity> allSubcontractors = subcontractorRepository.findBySubcontractorServiceCategory(serviceCategory);
        
        List<SubcontractorEntity> availableSubcontractors = new ArrayList<>();
        for (SubcontractorEntity subcontractor : allSubcontractors) {
            if (isSubcontractorAvailable(subcontractor, eventDate)) {
                availableSubcontractors.add(subcontractor);
            }
        }
        
        return availableSubcontractors;
    }

    // Bulk assign subcontractors
    public List<EventServiceEntity> bulkAssignSubcontractors(Map<Integer, Integer> assignments) {
        List<EventServiceEntity> updatedServices = new ArrayList<>();
        
        for (Map.Entry<Integer, Integer> assignment : assignments.entrySet()) {
            int eventServiceId = assignment.getKey();
            int subcontractorId = assignment.getValue();
            
            EventServiceEntity updatedService = assignSubcontractor(eventServiceId, subcontractorId);
            updatedServices.add(updatedService);
        }
        
        return updatedServices;
    }

    // Get event service by ID
    public EventServiceEntity getById(int eventServiceId) {
        return eventServiceRepository.findById(eventServiceId)
            .orElseThrow(() -> new RuntimeException("Event service not found with ID: " + eventServiceId));
    }

    // Helper method to check if subcontractor is available on a specific date
    private boolean isSubcontractorAvailable(SubcontractorEntity subcontractor, Date eventDate) {
        // Check if the subcontractor has any unavailable dates that conflict with the event date
        return subcontractor.getUnavailableDates().stream()
            .noneMatch(unavailableDate -> 
                eventDate.equals(unavailableDate.getDate())
            );
    }

}
