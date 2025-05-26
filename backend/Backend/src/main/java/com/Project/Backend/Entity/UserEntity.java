package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")
public class UserEntity {
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId;

    @OneToOne(mappedBy = "user")
    @JsonBackReference("subcontractor-user")
    private SubcontractorEntity subcontractor;

    @OneToMany(mappedBy = "user")
    @JsonManagedReference("user-transaction")
    private List<TransactionsEntity> transactions;

    private String firstname;

    private String lastname;

    private String email;

    private String password;

    private String phoneNumber;

    private String region;

    private String province;

    private String cityAndMul;

    private String barangay;

    private String role;

    private String profilePicture;

    private Boolean isGoogle;

    private Boolean isFacebook;

    public UserEntity() {
    }

    public UserEntity( String firstname, String lastname, String email, String password, String phoneNumber,String region ,String province ,
    String cityAndMul ,String barangay, String role, String profilePicture, Boolean isGoogle, Boolean isFacebook) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.region = region;
        this.province = province;
        this.cityAndMul = cityAndMul;
        this.barangay = barangay;
        this.role = role;
        this.profilePicture = profilePicture;
        this.isGoogle = isGoogle;
        this.isFacebook = isFacebook;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public SubcontractorEntity getSubcontractor() {
        return subcontractor;
    }

    public void setSubcontractor(SubcontractorEntity subcontractor) {
        this.subcontractor = subcontractor;
    }

    public List<TransactionsEntity> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionsEntity> transactions) {
        this.transactions = transactions;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCityAndMul() {
        return cityAndMul;
    }

    public void setCityAndMul(String cityAndMul) {
        this.cityAndMul = cityAndMul;
    }

    public String getBarangay() {
        return barangay;
    }

    public void setBarangay(String barangay) {
        this.barangay = barangay;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Boolean getGoogle() {
        return isGoogle;
    }

    public void setGoogle(Boolean google) {
        isGoogle = google;
    }

    public Boolean getFacebook() {
        return isFacebook;
    }

    public void setFacebook(Boolean facebook) {
        isFacebook = facebook;
    }
}
