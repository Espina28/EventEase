package com.Project.Backend.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Project.Backend.Entity.EventEntity;
import com.Project.Backend.Repository.EventRepository;



@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private S3Service s3Service;

    public EventEntity create(EventEntity event) {
        return eventRepository.save(event);
    }

    public EventEntity findById(int id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found!"));
    }

    public List<EventEntity> readAll() {
        return eventRepository.findAll();
    }



    public EventEntity getEventByEventName(String eventName) {
        return eventRepository.findByName(eventName);
    }

    public EventEntity update(EventEntity event) {
        return eventRepository.save(event);
    }

    public void deleteById(int id) {
        eventRepository.deleteById(id);
    }
    
    public EventEntity updateEventImage(int eventId, MultipartFile file) throws IOException {
        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        if (file != null && !file.isEmpty()) {
            // Delete the previous image from S3 (if it exists)
            String existingImageUrl = event.getEvent_image();
            if (existingImageUrl != null && !existingImageUrl.isEmpty()) {
                // TODO: Implement S3 delete if needed
            }

            // Convert MultipartFile to File
            File convFile = File.createTempFile("upload", file.getOriginalFilename());
            file.transferTo(convFile);

            // Upload new image to S3
            String newImageUrl = s3Service.upload(convFile, "event_images", file.getOriginalFilename());
            event.setEvent_image(newImageUrl);

            // Delete temp file
            convFile.delete();
        }

        return eventRepository.save(event);
    }


    // public List<EventEntity> readAvailable() {
    //     return eventRepository.findByIsAvailableTrue();
    // }
}
