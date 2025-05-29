package com.Project.Backend.Controller;

import com.Project.Backend.DTO.*;
import com.Project.Backend.Entity.TransactionsEntity;
import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Repository.UserRepository;
import com.Project.Backend.Service.TokenService;
import com.Project.Backend.Service.TransactionService;
import com.Project.Backend.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    private final TokenService tokenService;

    @Autowired
    private final UserRepository userRepository;


    @Autowired
    private UserService userService;

    public TransactionController(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        
    }

    @PostMapping("/createTransaction")
    public ResponseEntity<TransactionsEntity> createTransaction(@RequestBody CreateTransactionDTO createTransactionDTO) {
        TransactionsEntity createdTransaction = transactionService.create(createTransactionDTO);
        return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
    }

    @PutMapping("/validateTransaction")
    public ResponseEntity<?> validateTransaction(@RequestParam int transactionId,
                                                 @RequestParam String status,
                                                 @RequestBody CreateBookingRejectionNoteDTO reason) {
        TransactionsEntity transactionsEntity = transactionService.validateTransaction(transactionId, status, reason);
        if(transactionsEntity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(transactionsEntity);
    }

    @GetMapping("/getAllPendingTransactions")
    public ResponseEntity<?> getAllTransactions() {
        List<GetTransactionDTO> transactions = transactionService.getAllPendingTransactions();
        if(transactions.isEmpty()){
            return ResponseEntity.status(404).body(Map.of("error", "No Transactions Found"));
        }
        return ResponseEntity.ok(transactions);
    }

   
    @GetMapping("/getTransactionById/{id}")
    public ResponseEntity<TransactionsEntity> getTransactionById(@PathVariable int id) {
        try {
            TransactionsEntity transaction = transactionService.getById(id);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/getTransactionByEmail/{email}")
    public ResponseEntity<List<GetTransactionDTO>> getTransactionByEmail(@PathVariable String email) {
        List<GetTransactionDTO> transactions = transactionService.getEventServicesByEmail(email);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/getAllTransactions")
    public ResponseEntity<?> getAllTranscations() {
        List<GetTransactionDTO> transactions = transactionService.getAllTransactions();
        if (transactions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/findAllJoinedWithUserAndEvent")
    public ResponseEntity<List<TransactionUserEventAndPackageDTO>> findAllJoinedWithUserAndEvent() {
        List<TransactionUserEventAndPackageDTO> transactions = transactionService.findAllJoinedWithUserAndEventAndPackages();
        if (transactions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/getPaymentAndSubcontractors/{transactionId}")
    public ResponseEntity<TransactionPaymentAndSubcontractorsDTO> findAllJoinedWIthPaymentAndSubcontractorsByTransactionId(@PathVariable int transactionId) {
        TransactionPaymentAndSubcontractorsDTO transactions = transactionService.findAllJoinedWIthPaymentAndSubcontractorsByTransactionId(transactionId);
        if (transactions != null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(transactions);
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable int id) {
        try {
            transactionService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
   
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TransactionsEntity>> getTransactionsByEventId(@PathVariable int eventId) {
        List<TransactionsEntity> transactions = transactionService.getByEventId(eventId);
        return ResponseEntity.ok(transactions);
    }
    
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TransactionsEntity>> getTransactionsByStatus(@PathVariable String status) {
        try {
            List<TransactionsEntity> transactions = transactionService.getByStatus(status.toUpperCase());
            return ResponseEntity.ok(transactions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
@PostMapping("/createBookingTransaction")
public ResponseEntity<?> createBookingTransaction(
    @RequestParam("paymentProof") MultipartFile paymentProof,
    @RequestParam("bookingData") String bookingDataJson) {
    
    try {
        System.out.println("=== CREATE BOOKING TRANSACTION DEBUG ===");
        System.out.println("Received paymentProof: " + (paymentProof != null ? paymentProof.getOriginalFilename() : "null"));
        System.out.println("Received bookingData JSON: " + bookingDataJson);
        
        // Validate inputs
        if (paymentProof == null || paymentProof.isEmpty()) {
            System.out.println("ERROR: Payment proof is missing");
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Payment proof file is required"
            ));
        }
        
        if (bookingDataJson == null || bookingDataJson.trim().isEmpty()) {
            System.out.println("ERROR: Booking data is missing");
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Booking data is required"
            ));
        }
        
        // Parse the booking data JSON
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        BookingTransactionDTO bookingData;
        try {
            bookingData = objectMapper.readValue(bookingDataJson, BookingTransactionDTO.class);
            System.out.println("Successfully parsed booking data");
            System.out.println("Service type: " + bookingData.getServiceType());
            System.out.println("Package ID: " + bookingData.getPackageId());
            System.out.println("Service categories: " + bookingData.getServiceIds());
        } catch (JsonProcessingException e) {
            System.out.println("ERROR: Failed to parse JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid booking data format: " + e.getMessage()
            ));
        }
        
        // Validate required fields
        if (bookingData.getUserEmail() == null || bookingData.getUserEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "User email is required"
            ));
        }
        
        if (bookingData.getEventId() <= 0) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Valid event ID is required"
            ));
        }
        
        if (bookingData.getPaymentReferenceNumber() == null || bookingData.getPaymentReferenceNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Payment reference number is required"
            ));
        }
        
        // Create the transaction with payment proof
        TransactionsEntity createdTransaction = transactionService.createBookingTransaction(bookingData, paymentProof);
        
        System.out.println("Transaction created successfully with ID: " + createdTransaction.getTransaction_Id());
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Booking submitted successfully!",
            "transactionId", createdTransaction.getTransaction_Id()
        ));
        
    } catch (Exception e) {
        System.out.println("ERROR: Exception occurred: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "success", false,
                "message", "Failed to create booking: " + e.getMessage()
            ));
    }
}
@GetMapping("/getCurrentUserReservations")
public ResponseEntity<?> getCurrentUserReservations(@RequestHeader("Authorization") String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", "Invalid token"));
    }

    String token = authHeader.substring(7);
    String email = tokenService.extractEmail(token);

    UserEntity user = userRepository.findByEmail(email);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("error", "User not found"));
    }

    List<TransactionsEntity> userTransactions = transactionService.getReservationsByUserId(user.getUserId());

    return ResponseEntity.ok(userTransactions);
}
    //package area
    @PostMapping("/createPackageBooking")
    public ResponseEntity<?> createPackageBooking(
            @RequestParam("paymentProof") MultipartFile paymentProof,
            @RequestParam("packageBookingData") String packageBookingDataJson,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        try {
            System.out.println("=== CREATE PACKAGE BOOKING DEBUG ===");
            System.out.println("Received paymentProof: " + (paymentProof != null ? paymentProof.getOriginalFilename() : "null"));
            System.out.println("Received packageBookingData JSON: " + packageBookingDataJson);

            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("ERROR: Invalid or missing authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Authorization token is required"
                ));
            }

            // Extract and validate token
            String token = authHeader.substring(7);
            String userEmail;
            try {
                userEmail = tokenService.extractEmail(token);
                if (userEmail == null || userEmail.trim().isEmpty()) {
                    throw new RuntimeException("Invalid token");
                }
            } catch (Exception e) {
                System.out.println("ERROR: Token validation failed: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Invalid or expired token"
                ));
            }

            // Validate inputs
            if (paymentProof == null || paymentProof.isEmpty()) {
                System.out.println("ERROR: Payment proof is missing");
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Payment proof file is required"
                ));
            }

            if (packageBookingDataJson == null || packageBookingDataJson.trim().isEmpty()) {
                System.out.println("ERROR: Package booking data is missing");
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Package booking data is required"
                ));
            }

            // Parse the package booking data JSON
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            PackageBookingDTO packageBookingData;
            try {
                packageBookingData = objectMapper.readValue(packageBookingDataJson, PackageBookingDTO.class);
                System.out.println("Successfully parsed package booking data");
                System.out.println("Package ID: " + packageBookingData.getPackageId());
                System.out.println("Event ID: " + packageBookingData.getEventId());
            } catch (JsonProcessingException e) {
                System.out.println("ERROR: Failed to parse JSON: " + e.getMessage());
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Invalid package booking data format: " + e.getMessage()
                ));
            }

            // Set user email from token
            packageBookingData.setUserEmail(userEmail);

            // Validate required fields
            // Remove eventId validation for package booking
            String validationError = validatePackageBookingData(packageBookingData);
            if (validationError != null) {
                // Ignore eventId validation error for package booking
                if (validationError.equals("Valid event ID is required")) {
                    // Skip this error
                } else {
                    return ResponseEntity.badRequest().body(Map.of(
                            "success", false,
                            "message", validationError
                    ));
                }
            }

            // Create the package booking transaction
            TransactionsEntity createdTransaction = transactionService.createPackageBooking(packageBookingData, paymentProof);

            System.out.println("Package booking created successfully with ID: " + createdTransaction.getTransaction_Id());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Package booking submitted successfully!",
                    "transactionId", createdTransaction.getTransaction_Id(),
                    "packageName", createdTransaction.getPackages().getPackageName(),
                    "eventName", createdTransaction.getEvent() != null ? createdTransaction.getEvent().getEvent_name() : ""
            ));

        } catch (Exception e) {
            System.out.println("ERROR: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to create package booking: " + e.getMessage()
                    ));
        }
    }

    @GetMapping("/getPackageBooking/{transactionId}")
    public ResponseEntity<?> getPackageBooking(@PathVariable int transactionId) {
        try {
            TransactionsEntity transaction = transactionService.getPackageBookingById(transactionId);

            if (transaction.getPackages() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Transaction is not a package booking"
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "transaction", transaction
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/getUserPackageBookings")
    public ResponseEntity<?> getUserPackageBookings(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Authorization token is required"
                ));
            }

            String token = authHeader.substring(7);
            String userEmail = tokenService.extractEmail(token);

            var packageBookings = transactionService.getUserPackageBookings(userEmail);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "packageBookings", packageBookings
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Failed to fetch package bookings: " + e.getMessage()
            ));
        }
    }

    private String validatePackageBookingData(PackageBookingDTO packageBookingData) {
        // Personal Information validation
        if (packageBookingData.getFirstName() == null || packageBookingData.getFirstName().trim().isEmpty()) {
            return "First name is required";
        }
        if (packageBookingData.getLastName() == null || packageBookingData.getLastName().trim().isEmpty()) {
            return "Last name is required";
        }
        if (packageBookingData.getEmail() == null || packageBookingData.getEmail().trim().isEmpty()) {
            return "Email is required";
        }
        if (packageBookingData.getContact() == null || packageBookingData.getContact().trim().isEmpty()) {
            return "Contact is required";
        }

        // Event Details validation
        if (packageBookingData.getEventName() == null || packageBookingData.getEventName().trim().isEmpty()) {
            return "Event name is required";
        }
        // Remove eventId validation for package booking
        // if (packageBookingData.getEventId() == null || packageBookingData.getEventId() <= 0) {
        //     return "Valid event ID is required";
        // }
        if (packageBookingData.getTransactionVenue() == null || packageBookingData.getTransactionVenue().trim().isEmpty()) {
            return "Transaction venue is required";
        }
        if (packageBookingData.getTransactionDate() == null) {
            return "Transaction date is required";
        }

        // Package validation
        if (packageBookingData.getPackageId() == null || packageBookingData.getPackageId() <= 0) {
            return "Valid package ID is required";
        }

        // Payment validation
        if (packageBookingData.getPaymentReferenceNumber() == null || packageBookingData.getPaymentReferenceNumber().trim().isEmpty()) {
            return "Payment reference number is required";
        }

        // User validation
        if (packageBookingData.getUserEmail() == null || packageBookingData.getUserEmail().trim().isEmpty()) {
            return "User email is required";
        }

        return null; // No validation errors
    }
}
