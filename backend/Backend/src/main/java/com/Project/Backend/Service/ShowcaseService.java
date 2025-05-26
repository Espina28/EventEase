package com.Project.Backend.Service;

import com.Project.Backend.DTO.ShowcaseDTO;
import com.Project.Backend.Entity.ShowcaseEntity;
import com.Project.Backend.Entity.ShowcaseMediaEntity;
import com.Project.Backend.Entity.SubcontractorEntity;
import com.Project.Backend.Repository.ShowcaseRepository;
import org.springframework.boot.actuate.endpoint.Show;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class ShowcaseService {
    @Autowired
    private ShowcaseRepository showcaseRepository;
    @Autowired
    private SubcontractorService subcontractorService;
    @Autowired
    private ShowcaseMediaService showcaseMediaService;

    public ShowcaseEntity createShowcase(ShowcaseDTO showcase) {
        SubcontractorEntity subcontractor = null;
        ShowcaseEntity newShowcase =  new ShowcaseEntity();
        //save the image url to ShowcaseMediaEntity\
        try {
            subcontractor = subcontractorService.getSubcontractorByEmail(showcase.getEmail());
            newShowcase.setShowcase_title(showcase.getTitle());
            newShowcase.setShowcase_description(showcase.getDescription());
            newShowcase.setSubcontractor(subcontractor);
        } catch (Exception e) {
            throw new RuntimeException("Error creating showcase");
        }
        return showcaseRepository.save(newShowcase);
    }

    public ShowcaseEntity editShowcase(ShowcaseDTO showcase, int showcase_id) {
        try {
            // Retrieve existing showcase
            ShowcaseEntity existingShowcase = showcaseRepository.findById(showcase_id)
                    .orElseThrow(() -> new RuntimeException("Showcase not found with id: " + showcase_id));

            // Update fields
            existingShowcase.setShowcase_title(showcase.getTitle());
            existingShowcase.setShowcase_description(showcase.getDescription());


            // Save and return updated showcase
            return showcaseRepository.save(existingShowcase);
        } catch (Exception e) {
            throw new RuntimeException("Error editing showcase", e);
        }
    }

    public ShowcaseEntity updateShowcase(int id, ShowcaseEntity updatedShowcase) {
        try {
            ShowcaseEntity existingShowcase = findShowcaseById(id);
            if (existingShowcase != null) {
                existingShowcase.setShowcase_title(updatedShowcase.getShowcase_title());
                existingShowcase.setShowcase_description(updatedShowcase.getShowcase_description());
                return showcaseRepository.save(existingShowcase);
            } else {
                return null;
            }
        }catch (Exception e){
            throw new RuntimeException("Error updating showcase", e);
        }
    }


    public List<ShowcaseEntity> getAllShowcaseByUserEmail(String email){
        return showcaseRepository.getAllShowcaseByUserEmail(email);
    }

    public ShowcaseEntity findShowcaseById(int id) {
        return showcaseRepository.findById(id).orElse(null);
    }

    public String deleteShowcase(int id) {
        String message = "";
        try {
            ShowcaseEntity showcase = findShowcaseById(id);

            if(showcase == null)
                return "Showcase not found";
            showcaseRepository.deleteById(id);
        } catch (Exception e) {
            return null;
        }
        return message = "deleted successfully";
    }



}
