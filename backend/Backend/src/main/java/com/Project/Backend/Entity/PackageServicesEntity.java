package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

@Entity
@Table(name = "package_services")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "package_service_id")
public class PackageServicesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int package_service_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "packages_id")
    @JsonBackReference("package-service")
    private PackagesEntity packages;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcontractor_id")
    @JsonBackReference("subcontractor-package-service")
    private SubcontractorEntity subcontractor;

    public int getPackage_service_id() {
        return package_service_id;
    }

    public void setPackage_service_id(int package_service_id) {
        this.package_service_id = package_service_id;
    }

    public PackagesEntity getPackages() {
        return packages;
    }

    public void setPackages(PackagesEntity packages) {
        this.packages = packages;
    }

    public SubcontractorEntity getSubcontractor() {
        return subcontractor;
    }

    public void setSubcontractor(SubcontractorEntity subcontractor) {
        this.subcontractor = subcontractor;
    }
}
