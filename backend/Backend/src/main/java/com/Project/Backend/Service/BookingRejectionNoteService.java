package com.Project.Backend.Service;

import com.Project.Backend.DTO.CreateBookingRejectionNoteDTO;
import com.Project.Backend.Entity.BookingRejectionNoteEntity;
import com.Project.Backend.Entity.TransactionsEntity;
import com.Project.Backend.Repository.BookingRejectionNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.exception.SdkClientException;

@Service
public class BookingRejectionNoteService {

    @Autowired
    @Lazy
    private TransactionService transactionService;
    @Autowired
    private BookingRejectionNoteRepository bookingRejectionNoteRepository;
    @Autowired
    private S3Service s3Service;

    public BookingRejectionNoteEntity createRejectionNote(TransactionsEntity transaction, CreateBookingRejectionNoteDTO rejectionNoteDTO){
        BookingRejectionNoteEntity bookingRejectionNote = new BookingRejectionNoteEntity();
        bookingRejectionNote.setRejectionNote(rejectionNoteDTO.getRejectionNote());
        bookingRejectionNote.setImageUrl(rejectionNoteDTO.getImageUrl());
        bookingRejectionNoteRepository.save(bookingRejectionNote);
        bookingRejectionNote.setTransaction(transaction);
        return bookingRejectionNote;
    }

    public String generatePresignedUrl(String userName,String uuidName) {
        try {
            return s3Service.generatePresignedUploadUrl(userName+"/RejectionNoteImage/" ,uuidName);
        }catch (SdkClientException e){
            throw new RuntimeException("Error in creating presigned URL");
        }
    }
}
