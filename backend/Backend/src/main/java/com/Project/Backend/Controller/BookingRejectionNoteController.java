package com.Project.Backend.Controller;

import com.Project.Backend.Service.BookingRejectionNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/bookingrejectionnote")
public class BookingRejectionNoteController {

    @Autowired
    private BookingRejectionNoteService rejectionNoteService;


    @GetMapping("/generate-PresignedUrl")
    public ResponseEntity<?> generatePresignedURL(
            @RequestParam("file_name") String fileName,
            @RequestParam("user_name") String userName){
        String uuidName = java.util.UUID.randomUUID() + "_" + fileName;

        try{
            String presignedURL = rejectionNoteService.generatePresignedUrl(userName,uuidName);
            return ResponseEntity.ok(Map.of("presignedURL", presignedURL, "uuidName", uuidName));
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

}
