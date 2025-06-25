package com.Project.Backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.Project.Backend.Repository.PaymentRepository;
import com.Project.Backend.Entity.PaymentEntity;
import com.Project.Backend.DTO.CreatePayment;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private TransactionService transactionService;

    @Autowired
    private S3Service s3Service;


    public PaymentEntity savePayment(CreatePayment payment) {
        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setTransaction(transactionService.getById(payment.getTransactionId()));
        paymentEntity.setPaymentNote(payment.getPaymentNote());
        paymentEntity.setPaymentReceipt(payment.getPaymentReceipt());
        paymentEntity.setPaymentReferenceNumber(payment.getPaymentReferenceNumber());
        return paymentRepository.save(paymentEntity);
    }

    public PaymentEntity getPaymentById(int paymentId) {
        return paymentRepository.findById(paymentId).orElse(null);
    }
    
    public String generatePresignedUrl(String folderPath,String uuidName) {
        return s3Service.generatePresignedUploadUrl(folderPath, uuidName);
    }
    
}
