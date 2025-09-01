package com.Project.Backend.Service;

import com.Project.Backend.Entity.TransactionProgressEntity;
import com.Project.Backend.Entity.TransactionsEntity;
import com.Project.Backend.Repository.TransactionProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransactionProgressService {

    @Autowired
    private TransactionProgressRepository transactionProgressRepository;

    /**
     * Create initial progress record when transaction is created
     */
    public TransactionProgressEntity createInitialProgress(TransactionsEntity transaction) {
        // Check if progress already exists
        if (transactionProgressRepository.existsByTransactionId(transaction.getTransaction_Id())) {
            throw new RuntimeException("Progress already exists for transaction ID: " + transaction.getTransaction_Id());
        }

        TransactionProgressEntity progress = new TransactionProgressEntity(
            transaction,
            0, // Initial progress is 0%
            "Transaction created and payment proof submitted"
        );

        return transactionProgressRepository.save(progress);
    }

    /**
     * Update progress for a transaction
     */
    public TransactionProgressEntity updateProgress(int transactionId, int newProgress, String note) {
        Optional<TransactionProgressEntity> existingProgress = 
            transactionProgressRepository.findByTransactionId(transactionId);

        if (existingProgress.isEmpty()) {
            throw new RuntimeException("Progress not found for transaction ID: " + transactionId);
        }

        TransactionProgressEntity progress = existingProgress.get();
        progress.setCurrentProgress(Math.max(0, Math.min(100, newProgress))); // Ensure 0-100 range
        if (note != null && !note.trim().isEmpty()) {
            progress.setProgressNote(note);
        }

        // Also update the progress field in the transaction entity
        TransactionsEntity transaction = progress.getTransaction();
        transaction.setProgress(progress.getCurrentProgress());

        return transactionProgressRepository.save(progress);
    }

    /**
     * Get progress by transaction ID
     */
    public Optional<TransactionProgressEntity> getProgressByTransactionId(int transactionId) {
        return transactionProgressRepository.findByTransactionId(transactionId);
    }

    /**
     * Get all progress records for a user
     */
    public List<TransactionProgressEntity> getProgressByUserEmail(String userEmail) {
        return transactionProgressRepository.findByUserEmail(userEmail);
    }

    /**
     * Get progress records by status
     */
    public List<TransactionProgressEntity> getProgressByStatus(TransactionProgressEntity.ProgressStatus status) {
        return transactionProgressRepository.findByStatus(status);
    }

    /**
     * Mark transaction as payment received (25% progress)
     */
    public TransactionProgressEntity markPaymentReceived(int transactionId) {
        return updateProgress(transactionId, 25, "Payment confirmed and verified");
    }

    /**
     * Mark transaction as planning phase (50% progress)
     */
    public TransactionProgressEntity markPlanningPhase(int transactionId) {
        return updateProgress(transactionId, 50, "Event planning in progress");
    }

    /**
     * Mark transaction as preparation phase (75% progress)
     */
    public TransactionProgressEntity markPreparationPhase(int transactionId) {
        return updateProgress(transactionId, 75, "Event preparation underway");
    }

    /**
     * Mark transaction as completed (100% progress)
     */
    public TransactionProgressEntity markCompleted(int transactionId) {
        return updateProgress(transactionId, 100, "Event completed successfully");
    }

    /**
     * Get all progress records
     */
    public List<TransactionProgressEntity> getAllProgress() {
        return transactionProgressRepository.findAll();
    }

    /**
     * Delete progress record
     */
    public void deleteProgress(int progressId) {
        transactionProgressRepository.deleteById(progressId);
    }

    /**
     * Get progress history for a transaction
     */
    public List<TransactionProgressEntity> getProgressHistory(int transactionId) {
        // This would typically return all progress records for a transaction
        // For now, we'll return the current progress record as a single-item list
        Optional<TransactionProgressEntity> progress = transactionProgressRepository.findByTransactionId(transactionId);
        if (progress.isPresent()) {
            return List.of(progress.get());
        }
        throw new RuntimeException("Progress history not found for transaction ID: " + transactionId);
    }
}
