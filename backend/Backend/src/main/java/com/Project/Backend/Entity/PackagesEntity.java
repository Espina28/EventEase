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

    @OneToMany(mappedBy = "packages")
    @JsonManagedReference("package-service")
    private List<PackageServicesEntity> packageServices;


    @OneToOne(mappedBy = "packages")
    @JsonBackReference("transaction-package")
    private TransactionsEntity transactionsEntity;

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

    public TransactionsEntity getTransactionsEntity() {
        return transactionsEntity;
    }

    public void setTransactionsEntity(TransactionsEntity transactionsEntity) {
        this.transactionsEntity = transactionsEntity;
    }
}
