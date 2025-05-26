package com.Project.Backend.Service;

import com.Project.Backend.Entity.PackageServicesEntity;
import com.Project.Backend.Repository.PackageServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PackageServicesService {

    @Autowired
    private PackageServicesRepository packageServicesRepository;
    @Autowired
    private PackagesService packagesService;

    public PackageServicesEntity create(PackageServicesEntity packageServices) {
        return packageServicesRepository.save(packageServices);
    }

//    public PackageServicesEntity updatePackageServices(PackageServicesEntity newPackageServicesData) {
//        try {
//            // Validate if the record to update exists
//            PackageServicesEntity existing = packageServicesRepository
//                    .findById(newPackageServicesData.getPackage_service_id())
//                    .orElseThrow(() -> new IllegalArgumentException("Package Services not found"));
//
//            // Validate and fetch related Package and Service entities
//            PackagesEntity relatedPackage = packagesService
//                    .getPackageById(newPackageServicesData.getPackages().getPackageId());
//
//            ServiceOfferedEntity relatedService = serviceOfferedService
//                    .findByService(newPackageServicesData.getOfferingEntity().());
//
//            if (relatedPackage == null || relatedService == null) {
//                throw new IllegalArgumentException("Related Package or Service not found");
//            }
//            newPackageServicesData.setPackages(relatedPackage);
//            newPackageServicesData.setOfferingEntity(relatedService);
//            return packageServicesRepository.save(newPackageServicesData);
//        } catch (IllegalArgumentException error) {
//            throw error; // keep the custom message (e.g. "not found")
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to update Package Services", e);
//        }
//    }

}
