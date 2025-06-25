package com.Project.Backend.DTO;

public class PackageServiceAttachmentDTO {
    private int packageServiceId;
    private int packageId;
    private String packageName;
    private double packagePrice;
    private int subcontractorId;
    private String subcontractorServiceName;
    private String subcontractorServiceCategory;
    private String subcontractorEmail;

    // Constructor
    public PackageServiceAttachmentDTO(int packageServiceId, int packageId, String packageName, 
                                     double packagePrice, int subcontractorId, 
                                     String subcontractorServiceName, String subcontractorServiceCategory,
                                       String subcontractorEmail) {
        this.packageServiceId = packageServiceId;
        this.packageId = packageId;
        this.packageName = packageName;
        this.packagePrice = packagePrice;
        this.subcontractorId = subcontractorId;
        this.subcontractorServiceName = subcontractorServiceName;
        this.subcontractorServiceCategory = subcontractorServiceCategory;
        this.subcontractorEmail = subcontractorEmail;
    }

    // Getters and Setters
    public int getPackageServiceId() {
        return packageServiceId;
    }

    public void setPackageServiceId(int packageServiceId) {
        this.packageServiceId = packageServiceId;
    }

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

    public int getSubcontractorId() {
        return subcontractorId;
    }

    public void setSubcontractorId(int subcontractorId) {
        this.subcontractorId = subcontractorId;
    }

    public String getSubcontractorServiceName() {
        return subcontractorServiceName;
    }

    public void setSubcontractorServiceName(String subcontractorServiceName) {
        this.subcontractorServiceName = subcontractorServiceName;
    }

    public String getSubcontractorServiceCategory() {
        return subcontractorServiceCategory;
    }

    public void setSubcontractorServiceCategory(String subcontractorServiceCategory) {
        this.subcontractorServiceCategory = subcontractorServiceCategory;
    }

    public String getSubcontractorEmail() {
        return subcontractorEmail;
    }

    public void setSubcontractorEmail(String subcontractorEmail) {
        this.subcontractorEmail = subcontractorEmail;
    }
}