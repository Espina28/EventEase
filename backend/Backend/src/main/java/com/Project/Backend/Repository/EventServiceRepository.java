package com.Project.Backend.Repository;

import com.Project.Backend.DTO.GetTransactionDTO;
import com.Project.Backend.Entity.EventServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import com.Project.Backend.Entity.TransactionsEntity;

import java.util.List;

@Repository
public interface EventServiceRepository extends JpaRepository<EventServiceEntity, Integer> {
    
    // Find event services with no subcontractor assigned
    List<EventServiceEntity> findBySubcontractorIsNull();
    
    // Find event services by transaction ID
    @org.springframework.data.jpa.repository.Query("SELECT e FROM EventServiceEntity e WHERE e.transactionsId.transaction_Id = :transactionsId")
    List<EventServiceEntity> findByTransactionId(int transactionsId);
    
    // Find event services by subcontractor ID
    @org.springframework.data.jpa.repository.Query("SELECT e FROM EventServiceEntity e WHERE e.subcontractor.subcontractor_Id = :subcontractorId")
    List<EventServiceEntity> findBySubcontractor_SubcontractorId(int subcontractorId);
}
