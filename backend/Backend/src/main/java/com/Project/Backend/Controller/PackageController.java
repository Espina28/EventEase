package com.Project.Backend.Controller;

import com.Project.Backend.DTO.ServicePackageDTO;
import com.Project.Backend.Entity.PackagesEntity;
import com.Project.Backend.Service.PackagesService;
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

    @GetMapping("/getServices/{packageName}")
    public ResponseEntity<?> getPackage(@PathVariable("packageName") String packageName) {
        List<ServicePackageDTO> services = packagesService.getAllServiceByPackageName(packageName);
        if(services.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(services);
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPackage(){
        List<ServicePackageDTO> packages = packagesService.getAllPackages();
        if(packages.isEmpty()){
            return ResponseEntity.status(404).body(Map.of("error", "No Packages Found"));
        }
        return ResponseEntity.ok(packages);
    }
}
