package com.Project.Backend.Service;

import com.Project.Backend.DTO.PackageServiceAttachmentDTO;
import com.Project.Backend.DTO.ServicePackageDTO;
import com.Project.Backend.Entity.PackageServicesEntity;
import com.Project.Backend.Entity.PackagesEntity;
import com.Project.Backend.Repository.PackageServicesRepository;
import com.Project.Backend.Repository.PackagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PackagesService {

    @Autowired
    private PackagesRepository packagesRepository;
    @Autowired
    private PackageServicesRepository packageServicesRepository;

    @Autowired
    private S3Service s3Service;

    public PackagesEntity create(PackagesEntity packages) {
        return packagesRepository.save(packages);
    }

    public PackagesEntity updatePackage(PackagesEntity newpackagedata) {
        PackagesEntity packages = null;
        try {
            packages = packagesRepository.findById(newpackagedata.getPackageId()).orElse(null);
            if(packages == null)
                throw new IllegalArgumentException("Package not found");

            packages.setPackagePrice(newpackagedata.getPackagePrice());
            packages.setPackageName(newpackagedata.getPackageName());
            packages.setPackageDescription(newpackagedata.getPackageDescription());
            return packagesRepository.save(packages);
        }catch(IllegalArgumentException  e){
            throw new RuntimeException(e.getMessage());
        }
    }

    public PackagesEntity getPackageById(int id) {
        return packagesRepository.findById(id).orElse(null);
    }

    public String deletePackage(int id) {
        String message = null;
        PackagesEntity packages = null;

        try{
            packages = packagesRepository.findById(id).orElse(null);
            if(packages == null){
                throw new IllegalArgumentException("Package not found");
            }
//
//            List<PackageServicesEntity> packageServicesEntities = packageServicesRepository.findAll();
//            for (PackageServicesEntity packageServicesEntity : packageServicesEntities) {
//                packageServicesRepository.deleteById(packageServicesEntity.getPackages().getPackageId());
//            }
            packagesRepository.deleteById(id);
            message = "Package deleted successfully";
            return message;
        }catch(Exception e){
            return e.getMessage();
        }
    }

    public PackagesEntity findByName(String packageName){
        return packagesRepository.findPackageByPackageName(packageName);
    }



    public List<ServicePackageDTO> getAllServiceByPackageName(String packageName){
        return packagesRepository.findServicePackagesByPackageName(packageName);
    }

    public List<PackagesEntity> getAllPackages() {
        return packagesRepository.findAll();
    }

    public PackagesEntity updatePackageImage(int packageId, org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        PackagesEntity packages = packagesRepository.findById(packageId)
            .orElseThrow(() -> new RuntimeException("Package not found with id: " + packageId));

        if (file != null && !file.isEmpty()) {
            // Delete the previous image from S3 (if it exists)
            String existingImageUrl = packages.getPackageImage();
            if (existingImageUrl != null && !existingImageUrl.isEmpty()) {
                // TODO: Implement S3 delete if needed
            }

            // Convert MultipartFile to File
            java.io.File convFile = java.io.File.createTempFile("upload", file.getOriginalFilename());
            file.transferTo(convFile);

            // Upload new image to S3
            String newImageUrl = s3Service.upload(convFile, "package_images", file.getOriginalFilename());
            packages.setPackageImage(newImageUrl);

            // Delete temp file
            convFile.delete();
        }

        return packagesRepository.save(packages);
    }
    
    public List<PackageServiceAttachmentDTO> getServiceAttachmentsByPackageId(int packageId) {
        return packagesRepository.findServiceAttachmentsByPackageId(packageId);
    }
}
