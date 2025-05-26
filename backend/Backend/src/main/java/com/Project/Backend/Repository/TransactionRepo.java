package com.Project.Backend.Repository;

import com.Project.Backend.Entity.TransactionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<TransactionsEntity, Integer> {

    // Change from findByEventEntity_Event_id to findByEventEntityId
    @Query("SELECT t FROM TransactionsEntity t WHERE t.event.event_Id= :eventId")
    List<TransactionsEntity> findByEventEntityId(int eventId);

    @Query("SELECT t FROM TransactionsEntity t WHERE t.transactionStatus = :status AND t.transactionIsActive = :isActive")
    List<TransactionsEntity> findByTransactionStatusAndIsActive(TransactionsEntity.Status status, boolean isActive);
    
    // Change from findByTransaction_isActiveTrue to findByTransactionIsActiveTrue
    List<TransactionsEntity> findByTransactionIsActiveTrue();

    @Query("SELECT t FROM TransactionsEntity t " +
            "JOIN FETCH t.user u " +
            "JOIN FETCH t.event e " +
            "LEFT JOIN FETCH t.eventServices es " +
            "LEFT JOIN FETCH es.subcontractor")
    List<TransactionsEntity> findAllWithRelations();

    @org.springframework.data.jpa.repository.Query("SELECT t FROM TransactionsEntity t WHERE t.user.userId = :userId")
    List<TransactionsEntity> findByUserId(int userId);

}