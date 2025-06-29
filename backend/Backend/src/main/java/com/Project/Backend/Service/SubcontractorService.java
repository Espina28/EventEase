package com.Project.Backend.Service;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    /**
     * Get counts of subcontractors by service category
     * @return List of maps containing category name and count
     */
    public List<Map<String, Object>> getSubcontractorCountsByCategory() {
        return subContractorRepository.countByServiceCategory();
    }

    public List<SubcontractorEntity> getSubcontractorByPackageName(String packageName) {
        return subContractorRepository.getSubcontractorsByPackageName(packageName);
    }
    
    public SubcontractorEntity getSubcontractorById(int id) {
        Optional<SubcontractorEntity> result = subContractorRepository.findById(id);
        return result.orElse(null);
    }

    public SubcontractorEntity getSubcontractorByEmail(String email) {
        return subContractorRepository.findByEmail(email);
    }



    @Autowired
    private UserService userService;

    public void deleteSubcontractor(int id) {
        // First get the subcontractor to access its associated user
        SubcontractorEntity subcontractor = subContractorRepository.findById(id).orElse(null);
        
        if (subcontractor != null && subcontractor.getUser() != null) {
            // Get the user ID before deleting the subcontractor
            int userId = subcontractor.getUser().getUserId();
            
            // Delete the subcontractor first
            subContractorRepository.deleteById(id);
            
            // Then delete the associated user
            userService.deleteUser(userId);
        } else {
            // Just delete the subcontractor if no user is associated
            subContractorRepository.deleteById(id);
        }
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
