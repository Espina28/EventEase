package com.Project.Backend.Controller;

import com.Project.Backend.DTO.ServicePackageDTO;
import com.Project.Backend.Entity.PackageServicesEntity;
import com.Project.Backend.Entity.PackagesEntity;
import com.Project.Backend.Entity.SubcontractorEntity;
import com.Project.Backend.Service.PackagesService;
import com.Project.Backend.Service.SubcontractorService;
import com.Project.Backend.Service.PackageServicesService;
import com.Project.Backend.DTO.PackageServiceAttachmentDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/package")
public class PackageController {

    @Autowired
    private PackagesService packagesService;

    @Autowired
    private SubcontractorService subcontractorService;

    @Autowired
    private PackageServicesService packageServicesService;

    @GetMapping("/getServices/{packageName}")
    public ResponseEntity<?> getPackage(@PathVariable("packageName") String packageName) {
        List<ServicePackageDTO> services = packagesService.getAllServiceByPackageName(packageName);
        if(services == null || services.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(services);
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAllPackage(){
        List<PackagesEntity> packages = packagesService.getAllPackages();
        return ResponseEntity.ok(packages);
    }
    @PostMapping("/create")
    public ResponseEntity<?> createPackage(@RequestBody PackagesEntity pakage) {
        try {
            PackagesEntity createdPackage = packagesService.create(pakage);
            return ResponseEntity.ok(createdPackage);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePackage(@RequestBody PackagesEntity pakage) {
        try {
            PackagesEntity updatedPackage = packagesService.updatePackage(pakage);
            return ResponseEntity.ok(updatedPackage);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{packageId}")
    public ResponseEntity<?> deletePackage(@PathVariable("packageId") int packageId) {
        try {
            String result = packagesService.deletePackage(packageId);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/addService")
    public ResponseEntity<?> addServiceToPackage(@RequestBody Map<String, String> request) {
        try {
            int packageId = Integer.parseInt(request.get("packageId"));
            String subcontractorEmail = request.get("subcontractorEmail");
            
            PackageServicesEntity packageService = new PackageServicesEntity();
            
            // Get the package and subcontractor entities
            PackagesEntity packageEntity = packagesService.getPackageById(packageId);
            SubcontractorEntity subcontractorEntity = subcontractorService.getSubcontractorByEmail(subcontractorEmail);
            
            packageService.setPackages(packageEntity);
            packageService.setSubcontractor(subcontractorEntity);
            
            PackageServicesEntity created = packageServicesService.create(packageService);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/removeService/{packageServiceId}")
    public ResponseEntity<?> removeServiceFromPackage(@PathVariable("packageServiceId") int packageServiceId) {
        try {
            packageServicesService.delete(packageServiceId);
            return ResponseEntity.ok(Map.of("message", "Service removed from package successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload/image/{packageId}")
    public ResponseEntity<?> uploadPackageImage(
        @PathVariable int packageId,
        @org.springframework.web.bind.annotation.RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file
    ) {
        try {
            PackagesEntity updatedPackage = packagesService.updatePackageImage(packageId, file);
            return ResponseEntity.ok(updatedPackage);
        } catch (java.io.IOException e) {
            return ResponseEntity.badRequest().body("Package image upload failed: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Package not found: " + e.getMessage());
        }
    }

    @GetMapping("/get/{packageId}")
    public ResponseEntity<?> getPackageById(@PathVariable("packageId") int packageId) {
        try {
            PackagesEntity packageEntity = packagesService.getPackageById(packageId);
            if (packageEntity == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(packageEntity);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // @GetMapping("/serviceAttachments/{packageId}")
    // public ResponseEntity<?> getPackageServiceAttachments(@PathVariable("packageId") int packageId) {
    //     try {
    //         // First check if package exists
    //         PackagesEntity packageEntity = packagesService.getPackageById(packageId);
    //         if (packageEntity == null) {
    //             return ResponseEntity.notFound().build();
    //         }
            
    //         // Get service attachments for this package
    //         List<ServicePackageDTO> serviceAttachments = packagesService.getServiceAttachmentsByPackageId(packageId);
            
    //         if (serviceAttachments == null || serviceAttachments.isEmpty()) {
    //             return ResponseEntity.ok(List.of()); // Return empty list instead of 404
    //         }
            
    //         return ResponseEntity.ok(serviceAttachments);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    //     }
    // }

    @GetMapping("/service/{packageId}")
    public ResponseEntity<?> getPackageServices(@PathVariable("packageId") int packageId) {
        try {
            // First check if package exists
            PackagesEntity packageEntity = packagesService.getPackageById(packageId);
            if (packageEntity == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Get service attachments for this package
            List<PackageServiceAttachmentDTO> serviceAttachments = packagesService.getServiceAttachmentsByPackageId(packageId);
            
            return ResponseEntity.ok(serviceAttachments != null ? serviceAttachments : List.of());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
