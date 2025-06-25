package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "packages")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "packageId")
public class PackagesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int packageId;
    private String packageName;
    private double packagePrice;
    @Column(columnDefinition = "TEXT")
    private String packageDescription;
    private String packageImage;

    @OneToMany(mappedBy = "packages", cascade = CascadeType.REMOVE)
    @JsonManagedReference("package-service")
    private List<PackageServicesEntity> packageServices;


    @OneToMany(mappedBy = "packages")
    @JsonBackReference("transaction-package")
    private List<TransactionsEntity> transactionsEntity;

    public int getPackageId() {
        return packageId;
    }

    public void setPackageId(int packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public double getPackagePrice() {
        return packagePrice;
    }

    public void setPackagePrice(double packagePrice) {
        this.packagePrice = packagePrice;
    }

    public List<PackageServicesEntity> getPackageServices() {
        return packageServices;
    }

    public void setPackageServices(List<PackageServicesEntity> packageServices) {
        this.packageServices = packageServices;
    }

    public List<TransactionsEntity> getTransactionsEntity() {
        return transactionsEntity;
    }

    public void setTransactionsEntity(List<TransactionsEntity> transactionsEntity) {
        this.transactionsEntity = transactionsEntity;
    }

    public String getPackageDescription() {
        return packageDescription;
    }

    public void setPackageDescription(String packageDescription) {
        this.packageDescription = packageDescription;
    }

    public String getPackageImage() {
        return packageImage;
    }

    public void setPackageImage(String packageImage) {
        this.packageImage = packageImage;
    }
    
    
}
