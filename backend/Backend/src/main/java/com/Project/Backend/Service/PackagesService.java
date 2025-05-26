package com.Project.Backend.Service;

import com.Project.Backend.DTO.ServicePackageDTO;
import com.Project.Backend.Entity.PackageServicesEntity;
import com.Project.Backend.Entity.PackagesEntity;
import com.Project.Backend.Repository.PackageServicesRepository;
import com.Project.Backend.Repository.PackagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PackagesService {

    @Autowired
    private PackagesRepository packagesRepository;

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

    public List<ServicePackageDTO> getAllPackages() {
        return packagesRepository.findALlPackageServices();
    }

}
