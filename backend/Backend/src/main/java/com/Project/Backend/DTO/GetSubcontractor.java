package com.Project.Backend.DTO;

import com.Project.Backend.Entity.ShowcaseEntity;
import com.Project.Backend.Entity.UnavailableDates;

import java.util.List;

public class GetSubcontractor {
    private int subcontractorId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private double servicePrice;
    private String serviceName;
    private String serviceDescription;
    private String category;
    private List<UnavailableDates> unavailableDates;
    private List<ShowcaseEntity> showcaseMedia;

    public GetSubcontractor(int subcontractorId, String name, String email,
                            String phone, String address, double servicePrice,
                            String serviceName, String serviceDescription,
                            String category, List<UnavailableDates> unavailableDates,
                            List<ShowcaseEntity> showcaseMedia) {
        this.subcontractorId = subcontractorId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.servicePrice = servicePrice;
        this.serviceName = serviceName;
        this.serviceDescription = serviceDescription;
        this.category = category;
        this.unavailableDates = unavailableDates;
        this.showcaseMedia = showcaseMedia;
    }

    public int getSubcontractorId() {
        return subcontractorId;
    }

    public void setSubcontractorId(int subcontractorId) {
        this.subcontractorId = subcontractorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getServicePrice() {
        return servicePrice;
    }

    public void setServicePrice(double servicePrice) {
        this.servicePrice = servicePrice;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceDescription() {
        return serviceDescription;
    }

    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<UnavailableDates> getUnavailableDates() {
        return unavailableDates;
    }

    public void setUnavailableDates(List<UnavailableDates> unavailableDates) {
        this.unavailableDates = unavailableDates;
    }

    public List<ShowcaseEntity> getShowcaseMedia() {
        return showcaseMedia;
    }

    public void setShowcaseMedia(List<ShowcaseEntity> showcaseMedia) {
        this.showcaseMedia = showcaseMedia;
    }
}
