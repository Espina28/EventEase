package com.Project.Backend.Service;

import com.Project.Backend.DTO.BookingTransactionDTO;
import com.Project.Backend.DTO.CreateTransactionDTO;
import com.Project.Backend.DTO.GetTransactionDTO;
import com.Project.Backend.Entity.*;
import com.Project.Backend.Repository.EventRepository;
import com.Project.Backend.Repository.EventServiceRepository;
import com.Project.Backend.Repository.PackageServicesRepository;
import com.Project.Backend.Repository.PackagesRepository;
import com.Project.Backend.Repository.PaymentRepository;
import com.Project.Backend.Repository.TransactionRepo;
import com.Project.Backend.Repository.UserRepository;

import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private SubcontractorService subcontractorService;
    
    @Autowired
    private PackagesService packagesService;
    
    @Autowired
    private EventServiceService eventServiceService;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    UserService userService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PackagesRepository packageRepository;

    @Autowired
    private EventServiceRepository EventServiceRepository;

    // ADD THIS - PaymentRepository injection
    @Autowired
    private PaymentRepository paymentRepository;

    // Create a new transaction
    public TransactionsEntity create(CreateTransactionDTO createTransactionDTO) {
        try{
            TransactionsEntity transactions = new TransactionsEntity();
            transactions.setTransactionVenue(createTransactionDTO.getVenue());
            transactions.setTransactionStatus(TransactionsEntity.Status.PENDING);
            transactions.setTransactionDate(createTransactionDTO.getEventDate());
            transactions.setTransactionNote(createTransactionDTO.getUserNote());
            transactions.setTransactionIsActive(true);
            transactions.setTransactionisApprove(false);
            transactions = transactionRepo.save(transactions);

            if(createTransactionDTO.getPackageName() != null){
                transactions.setPackages(packagesService.findByName(createTransactionDTO.getPackageName()));
            }

            transactions.setEvent(eventService.getEventByEventName(createTransactionDTO.getEventName()));
            transactions.setUser(userService.getUserByEmail(createTransactionDTO.getUserEmail()));
            transactionRepo.save(transactions);
            assignedEventService(createTransactionDTO.getServices(), transactions);

            return transactions;
        }catch(Exception e){
            throw new RuntimeException("Failed to create transaction: ", e);
        }
    }

    //connecting the transactions and the chosen services of subcontractors in event_service table;
    public List<SubcontractorEntity> assignedEventService(List<Integer> sucontractorsId, TransactionsEntity transactions){
        List<SubcontractorEntity> subcontractors = new ArrayList<>();

        for(int subcontractorid: sucontractorsId){
            SubcontractorEntity subcontractorEntity = subcontractorService.getSubcontractorById(subcontractorid);
            if(subcontractorEntity == null){
                throw new RuntimeException("Subcontractor with id " + subcontractorid + " not found");
            }
            EventServiceEntity eventServiceEntity = new EventServiceEntity();
            eventServiceEntity.setTransactionsId(transactions);
            eventServiceEntity.setSubcontractor(subcontractorEntity);
            eventServiceService.create(eventServiceEntity);
            subcontractors.add(subcontractorService.getSubcontractorById(subcontractorid));
        }
        return subcontractors;
    };

    public TransactionsEntity validateTransaction(int id, String status){
        TransactionsEntity transaction = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction with id " + id + " not found"));
        switch (status){
            case "APPROVED":
                    transaction.setTransactionStatus(TransactionsEntity.Status.ONGOING);
                    transaction.setTransactionisApprove(true);
                    break;
            case "CANCELLED":
                    transaction.setTransactionStatus(TransactionsEntity.Status.CANCELLED);
                    transaction.setTransactionisApprove(false);
                    break;
            case "COMPLETED":
                    transaction.setTransactionStatus(TransactionsEntity.Status.COMPLETED);
                    break;
            default:
                    throw new RuntimeException("Invalid transaction status: " + status);
        }
        return transactionRepo.save(transaction);
    }

    // Get transaction by ID
    public TransactionsEntity getById(int id) {
        return transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction with id " + id + " not found"));
    }

    // Get all transactions.findAll();
    public List<GetTransactionDTO> getAllPendingTransactions() {
        List<TransactionsEntity> existingTransactions = transactionRepo.findByTransactionStatusAndIsActive(TransactionsEntity.Status.PENDING, true);
        List<GetTransactionDTO> result = new ArrayList<>();

        for(TransactionsEntity transaction : existingTransactions){
            GetTransactionDTO getTransactionDTO = new GetTransactionDTO();
            getTransactionDTO.setTransaction_Id(transaction.getTransaction_Id());
            getTransactionDTO.setUserEmail(transaction.getUser().getEmail());
            getTransactionDTO.setUserName(transaction.getUser().getFirstname() + " " + transaction.getUser().getLastname());
            getTransactionDTO.setPhoneNumber(transaction.getUser().getPhoneNumber());
            getTransactionDTO.setUserAddress(transaction.getUser().getProvince() + " " + transaction.getUser().getBarangay());
            getTransactionDTO.setEventName(transaction.getEvent().getEvent_name());
            getTransactionDTO.setTransactionVenue(transaction.getTransactionVenue());
            getTransactionDTO.setTransactionStatus(transaction.getTransactionStatus().toString());
            getTransactionDTO.setTransactionDate(transaction.getTransactionDate());
            getTransactionDTO.setTransactionNote(transaction.getTransactionNote());
            getTransactionDTO.setPayment(transaction.getPayment());
            if(transaction.getPackages() != null){
                getTransactionDTO.setPackages(transaction.getPackages().getPackageName());
            }

            if (transaction.getEventServices() != null) {
                getTransactionDTO.setSubcontractors(getSubcontractors(transaction.getEventServices()));
            }
            result.add(getTransactionDTO);
        }
        return result;
    }

    private List<Map<String, Object>>  getSubcontractors(List<EventServiceEntity> eventServices){
       return eventServices.stream()
               .map(eventService -> {
                   SubcontractorEntity subcontractor = subcontractorService.getSubcontractorById(
                           eventService.getSubcontractor().getSubcontractor_Id()
                   );

                   Map<String, Object> subcontractorDetails = new HashMap<>();
                   subcontractorDetails.put("subcontractorId", subcontractor.getSubcontractor_Id());
                   subcontractorDetails.put("subcontractorName", subcontractor.getUserId().getFirstname() + " " + subcontractor.getUserId().getLastname());
                   subcontractorDetails.put("subcontractorEmail", subcontractor.getUserId().getEmail());
                   subcontractorDetails.put("serviceName", subcontractor.getSubcontractor_serviceName());
                   subcontractorDetails.put("serviceCategory", subcontractor.getSubcontractor_serviceCategory());
                   //add the category here
                   return subcontractorDetails;
               })
               .collect(Collectors.toList());
    }

    public List<GetTransactionDTO>getAllTransactions() {
        List<TransactionsEntity> existingTransactions = transactionRepo.findAll();
        List<GetTransactionDTO> result = new ArrayList<>();

        for(TransactionsEntity transaction : existingTransactions){
            GetTransactionDTO getTransactionDTO = new GetTransactionDTO();
            getTransactionDTO.setTransaction_Id(transaction.getTransaction_Id());
            getTransactionDTO.setUserEmail(transaction.getUser().getEmail());
            getTransactionDTO.setUserName(transaction.getUser().getFirstname() + " " + transaction.getUser().getLastname());
            getTransactionDTO.setPhoneNumber(transaction.getUser().getPhoneNumber());
            getTransactionDTO.setUserAddress(transaction.getUser().getProvince() + " " + transaction.getUser().getBarangay());
            getTransactionDTO.setEventName(transaction.getEvent().getEvent_name());
            getTransactionDTO.setTransactionVenue(transaction.getTransactionVenue());
            getTransactionDTO.setTransactionStatus(transaction.getTransactionStatus().toString());
            getTransactionDTO.setTransactionDate(transaction.getTransactionDate());
            getTransactionDTO.setTransactionNote(transaction.getTransactionNote());
            getTransactionDTO.setPayment(transaction.getPayment());
            if(transaction.getPackages() != null){
                getTransactionDTO.setPackages(transaction.getPackages().getPackageName());
            }

            if (transaction.getEventServices() != null) {
                getTransactionDTO.setSubcontractors(getSubcontractors(transaction.getEventServices()));
            }
            result.add(getTransactionDTO);
        }
        return result;
    }

    // Delete transaction
    public void delete(int id) {
        if (!transactionRepo.existsById(id)) {
            throw new RuntimeException("Transaction with id " + id + " not found");
        }
        transactionRepo.deleteById(id);
    }

    // Get transactions by event ID
    public List<TransactionsEntity> getByEventId(int eventId) {
        return transactionRepo.findByEventEntityId(eventId);
    }
    
    // Get transactions by status
    public List<TransactionsEntity> getByStatus(String status) {
        return transactionRepo.findByTransactionStatusAndIsActive(TransactionsEntity.Status.valueOf(status), true);
    }

    // MODIFIED METHOD - Solution 1 Implementation
    @Transactional
    public TransactionsEntity createBookingTransaction(BookingTransactionDTO bookingData, MultipartFile paymentProof) throws IOException {
        
        System.out.println("=== TRANSACTION SERVICE DEBUG ===");
        System.out.println("Looking for user with email: " + bookingData.getUserEmail());
        
        try {
            // 1. Find the user by email
            UserEntity user = userRepository.findByEmail(bookingData.getUserEmail());
            if (user == null) {
                System.out.println("ERROR: User not found with email: " + bookingData.getUserEmail());
                throw new RuntimeException("User not found with email: " + bookingData.getUserEmail());
            }
            System.out.println("Found user: " + user.getFirstname() + " " + user.getLastname());
            
            // 2. Find the event by ID
            System.out.println("Looking for event with ID: " + bookingData.getEventId());
            EventEntity event = eventRepository.findById(bookingData.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + bookingData.getEventId()));
            System.out.println("Found event: " + event.getEvent_name());
            
            // 3. Validate that it's either package OR custom services, not both
            boolean hasPackage = "PACKAGE".equals(bookingData.getServiceType()) && bookingData.getPackageId() != null;
            boolean hasCustomServices = "CUSTOM".equals(bookingData.getServiceType()) && 
                                    bookingData.getServiceIds() != null && 
                                    !bookingData.getServiceIds().isEmpty();
            
            System.out.println("Has package: " + hasPackage);
            System.out.println("Has custom services: " + hasCustomServices);
            
            if (hasPackage && hasCustomServices) {
                throw new RuntimeException("Cannot have both package and custom services in the same booking");
            }
            
            if (!hasPackage && !hasCustomServices) {
                throw new RuntimeException("Must select either a package or custom services");
            }
            
            // 4. Upload payment proof to S3
            String paymentReceiptUrl = null;
            if (paymentProof != null && !paymentProof.isEmpty()) {
                System.out.println("Uploading payment proof to S3...");
                try {
                    File convFile = File.createTempFile("payment_proof", paymentProof.getOriginalFilename());
                    paymentProof.transferTo(convFile);
                    paymentReceiptUrl = s3Service.upload(convFile, "payment_proofs", paymentProof.getOriginalFilename());
                    convFile.delete();
                    System.out.println("Payment proof uploaded successfully: " + paymentReceiptUrl);
                } catch (Exception e) {
                    System.out.println("ERROR: Failed to upload payment proof: " + e.getMessage());
                    throw new IOException("Failed to upload payment proof: " + e.getMessage());
                }
            }
            
            // 5. Create Transaction (without payment initially)
            System.out.println("Creating transaction...");
            TransactionsEntity transaction = new TransactionsEntity();
            transaction.setUser(user);
            transaction.setEvent(event);
            transaction.setTransactionVenue(bookingData.getTransactionVenue());
            transaction.setTransactionDate(bookingData.getTransactionDate());
            transaction.setTransactionNote(bookingData.getTransactionNote());
            transaction.setTransactionStatus(TransactionsEntity.Status.PENDING);
            transaction.setTransactionIsActive(true);
            transaction.setTransactionisApprove(false);
            
            // Don't set payment yet - we'll do this after saving the transaction
            transaction.setPayment(null);
            
            // 6. Handle Package OR Custom Services (mutually exclusive)
            if (hasPackage) {
                System.out.println("Processing package booking...");
                PackagesEntity packageEntity = packageRepository.findById(bookingData.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Package not found with ID: " + bookingData.getPackageId()));
                transaction.setPackages(packageEntity);
                transaction.setEventServices(null);
                System.out.println("Package set: " + packageEntity.getPackageName());
                
            } else if (hasCustomServices) {
                System.out.println("Processing custom services booking...");
                transaction.setPackages(null);
                // EventServices will be created after transaction is saved
            }
            
            // 7. Save transaction first (without payment)
            System.out.println("Saving transaction (without payment)...");
            TransactionsEntity savedTransaction = transactionRepo.save(transaction);
            System.out.println("Transaction saved with ID: " + savedTransaction.getTransaction_Id());
            
            // 8. Handle custom services after transaction is saved
            if (hasCustomServices) {
                System.out.println("Creating EventService records...");
                List<EventServiceEntity> eventServices = new ArrayList<>();
                for (int serviceId : bookingData.getServiceIds()) {
                    System.out.println("Creating EventService for service ID: " + serviceId);
                    EventServiceEntity eventService = new EventServiceEntity();
                    eventService.setTransactionsId(savedTransaction);
                    
                    // Try to find the subcontractor by ID
                    try {
                        SubcontractorEntity subcontractor = subcontractorService.getSubcontractorById(serviceId);
                        eventService.setSubcontractor(subcontractor);
                        System.out.println("Assigned subcontractor: " + subcontractor.getSubcontractor_serviceName());
                    } catch (Exception e) {
                        System.out.println("WARNING: Subcontractor not found for ID " + serviceId + ", will be assigned later by admin");
                        eventService.setSubcontractor(null); // Will be assigned later by admin
                    }
                    
                    eventServices.add(eventService);
                }
                
                // Save the EventService records
                eventServices = EventServiceRepository.saveAll(eventServices);
                savedTransaction.setEventServices(eventServices);
                System.out.println("Created " + eventServices.size() + " event services");
            }
            
            // 9. Create and save payment separately
            System.out.println("Creating payment record...");
            PaymentEntity payment = new PaymentEntity();
            payment.setTransaction(savedTransaction);  // Set the saved transaction
            payment.setPaymentReceipt(paymentReceiptUrl);
            payment.setPaymentNote(bookingData.getPaymentNote());
            payment.setPaymentStatus(PaymentEntity.STATUS.ACCEPTED);
            
            try {
                payment.setPaymentReferenceNumber(Integer.parseInt(bookingData.getPaymentReferenceNumber()));
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid payment reference number format: " + bookingData.getPaymentReferenceNumber());
            }
            
            // Save payment separately
            System.out.println("Saving payment...");
            PaymentEntity savedPayment = paymentRepository.save(payment);
            System.out.println("Payment saved with ID: " + savedPayment.getPaymentId());
            
            // 10. Update transaction with saved payment
            System.out.println("Updating transaction with payment...");
            savedTransaction.setPayment(savedPayment);
            savedTransaction = transactionRepo.save(savedTransaction);
            
            System.out.println("Transaction completed successfully with ID: " + savedTransaction.getTransaction_Id());
            return savedTransaction;
            
        } catch (Exception e) {
            System.out.println("ERROR: Exception in createBookingTransaction: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create booking transaction: " + e.getMessage(), e);
        }
    }

public List<TransactionsEntity> getReservationsByUserId(int userId) {
    return transactionRepo.findByUserId(userId);
}


}