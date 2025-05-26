
package com.Project.Backend.DTO;

import com.Project.Backend.Entity.UserEntity;

public class CreateSubcontractorRequest {
    private UserEntity user;
    private int offeringServiceId;
    private String service;
    private String serviceCategory;
    private int servicePrice; 
    private String description;

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public int getOfferingServiceId() {
        return offeringServiceId;
    }

    public void setOfferingServiceId(int offeringServiceId) {
        this.offeringServiceId = offeringServiceId;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }

    public void setServiceCategory(String serviceCategory) {
        this.serviceCategory = serviceCategory;
    }

    public int getServicePrice() {
        return servicePrice;
    }

    public void setServicePrice(int servicePrice) {
        this.servicePrice = servicePrice;
    }
}
