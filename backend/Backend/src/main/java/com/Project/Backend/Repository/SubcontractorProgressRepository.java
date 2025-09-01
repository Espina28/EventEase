package com.Project.Backend.Repository;

import com.Project.Backend.Entity.SubcontractorProgressEntity;
import com.Project.Backend.Entity.TransactionsEntity;
import com.Project.Backend.Entity.SubcontractorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubcontractorProgressRepository extends JpaRepository<SubcontractorProgressEntity, Integer> {

    /**
     * Find all subcontractor progress for a specific transaction
     */
    List<SubcontractorProgressEntity> findByTransaction(TransactionsEntity transaction);

    /**
     * Find subcontractor progress by transaction ID
     */
    @Query("SELECT sp FROM SubcontractorProgressEntity sp WHERE sp.transaction.transaction_Id = :transactionId")
    List<SubcontractorProgressEntity> findByTransactionId(@Param("transactionId") int transactionId);

    /**
     * Find subcontractor progress by transaction ID and subcontractor ID
     */
    @Query("SELECT sp FROM SubcontractorProgressEntity sp WHERE sp.transaction.transaction_Id = :transactionId AND sp.subcontractor.subcontractor_Id = :subcontractorId")
    Optional<SubcontractorProgressEntity> findByTransactionIdAndSubcontractorId(@Param("transactionId") int transactionId, @Param("subcontractorId") int subcontractorId);

    /**
     * Check if subcontractor progress exists for a transaction
     */
    boolean existsByTransaction(TransactionsEntity transaction);

    /**
     * Find all subcontractor progress for a specific subcontractor
     */
    List<SubcontractorProgressEntity> findBySubcontractor(SubcontractorEntity subcontractor);

    /**
     * Find subcontractor progress by subcontractor ID
     */
    @Query("SELECT sp FROM SubcontractorProgressEntity sp WHERE sp.subcontractor.subcontractor_Id = :subcontractorId")
    List<SubcontractorProgressEntity> findBySubcontractorId(@Param("subcontractorId") int subcontractorId);
}
