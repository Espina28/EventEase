package com.Project.Backend.Service;

import com.Project.Backend.DTO.FormDraftDTO;
import com.Project.Backend.Entity.FormDraftEntity;
import com.Project.Backend.Repository.FormDraftRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class FormDraftService {

    private FormDraftRepository formDataRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public FormDraftService(FormDraftRepository repository, ObjectMapper objectMapper) {
        this.formDataRepository = repository;
        this.objectMapper = objectMapper;
    }

    public String saveOrUpdate(FormDraftDTO progress) {
        try {
            FormDraftEntity formProgress = formDataRepository.findByEmailAndEventName(progress.getEventName(),progress.getEmail());
            if (formProgress == null) {
                formProgress = new FormDraftEntity();
                formProgress.setEmail(progress.getEmail());
                formProgress.setEventName(progress.getEventName());
            }
            formProgress.setProgressJSON(progress.getJsonData());
            LocalDateTime dateOnly = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            formProgress.setCreatedAt(Timestamp.valueOf(dateOnly));
            formDataRepository.save(formProgress);
        }catch (Exception e){
            return null;
        }
        return "Successfully save the draft";
    }


    public String getProgressByUserEmailAndEventName(String email, String eventName) {
      try {
          FormDraftEntity formProgress = formDataRepository.findByEmailAndEventName(eventName,email);
          if (formProgress != null)
            return formProgress.getProgressJSON();
      }catch (Exception e){
          return null;
      }
      return "No progress found";
    }

    @Transactional
    public void deleteByUserEmailAndEventName(String email, String eventName) {
        formDataRepository.deleteByEmailAndEventName(email,eventName);
    }

    // Convert JSON string to Java object (optional)
    public <T> T parseProgress(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON", e);
        }
    }

    // Convert Java object to JSON string (optional)
    public String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert to JSON", e);
        }
    }

}
