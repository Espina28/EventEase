package com.Project.Backend.DTO;

import java.util.List;

public class ServicePackageDTO {
    private String subcontractor_serviceName;
    private String packageName;
    private double packagePrice;

    public ServicePackageDTO(String subcontractor_serviceName, String packageName, double packagePrice) {
        this.subcontractor_serviceName = subcontractor_serviceName;
        this.packageName = packageName;
        this.packagePrice = packagePrice;
    }

    public String getSubcontractorServiceName() {
        return subcontractor_serviceName;
    }

    public void setSubcontractorServiceName(String subcontractor_serviceName) {
        this.subcontractor_serviceName = subcontractor_serviceName;
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
}
