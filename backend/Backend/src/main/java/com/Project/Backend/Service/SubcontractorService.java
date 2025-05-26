package com.Project.Backend.Service;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import com.Project.Backend.DTO.GetSubcontractor;
import com.Project.Backend.Repository.SubContractorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Project.Backend.Entity.SubcontractorEntity;
import software.amazon.awssdk.core.exception.SdkClientException;

@Service
public class SubcontractorService {

    @Autowired
    private SubContractorRepository subContractorRepository;
    @Autowired
    private S3Service s3Service;

    public SubcontractorEntity saveSubcontractor(SubcontractorEntity subcontractor) {
        return subContractorRepository.save(subcontractor);
    }

    public List<SubcontractorEntity> getAllSubcontractors() {
        return subContractorRepository.findAll();
    }

    public List<GetSubcontractor> getAvailableSubcontractors(Date date) {
        List<SubcontractorEntity> subcontractors = subContractorRepository.findAvailableSubcontractors(date);
        return subcontractors.stream()
                .filter(subcontractor -> subcontractor.getUser() != null)
                .map(subcontractor -> new GetSubcontractor(
                        subcontractor.getSubcontractor_Id(),
                        subcontractor.getUser().getFirstname() + " " + subcontractor.getUser().getLastname(),
                        subcontractor.getUser().getEmail(),
                        subcontractor.getUser().getPhoneNumber(),
                        null,
                        subcontractor.getSubcontractor_service_price(),
                        subcontractor.getSubcontractor_serviceName(),
                        subcontractor.getSubcontractor_description(),
                        subcontractor.getSubcontractor_serviceCategory(),
                        subcontractor.getUnavailableDates(),
                        subcontractor.getShowcase()
                ))
                .toList();

    }

    public SubcontractorEntity getSubcontractorById(int id) {
        Optional<SubcontractorEntity> result = subContractorRepository.findById(id);
        return result.orElse(null);
    }

    public SubcontractorEntity getSubcontractorByEmail(String email) {
        return subContractorRepository.findByEmail(email);
    }

    public void deleteSubcontractor(int id) {
        subContractorRepository.deleteById(id);
    }

    public String editDescription(String email, String description) throws SdkClientException {
       try {
           SubcontractorEntity subcontractor = getSubcontractorByEmail(email);
           subcontractor.setSubcontractor_description(description);
           subContractorRepository.save(subcontractor);
       }catch (Exception e) {
           return "Error";
       }
        return description;
    }
}
