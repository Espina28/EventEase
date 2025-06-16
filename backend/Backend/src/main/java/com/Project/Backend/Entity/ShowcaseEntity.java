package com.Project.Backend.Entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;

import java.util.List;

@Entity
@Table(name = "Showcase")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "showcase_id")
public class ShowcaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int showcase_id;
    private String showcase_title;
    @Column(columnDefinition = "TEXT")
    private String showcase_description;

    //here
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference("subcontactor-showcase")
    @JoinColumn(name = "subcontractor_id", nullable = true)
    private SubcontractorEntity subcontractor;


    @OneToMany(mappedBy = "showcase", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "showcase-showcaseMedia")
    private List<ShowcaseMediaEntity> showcaseMediaEntity;

    public int getShowcase_id() {
        return showcase_id;
    }

    public void setShowcase_id(int showcase_id) {
        this.showcase_id = showcase_id;
    }

    public String getShowcase_title() {
        return showcase_title;
    }

    public void setShowcase_title(String showcase_title) {
        this.showcase_title = showcase_title;
    }

    public String getShowcase_description() {
        return showcase_description;
    }

    public void setShowcase_description(String showcase_description) {
        this.showcase_description = showcase_description;
    }

    public SubcontractorEntity getSubcontractor() {
        return subcontractor;
    }

    public void setSubcontractor(SubcontractorEntity subcontractor) {
        this.subcontractor = subcontractor;
    }

    public List<ShowcaseMediaEntity> getShowcaseMediaEntity() {
        return showcaseMediaEntity;
    }

    public void setShowcaseMediaEntity(List<ShowcaseMediaEntity> showcaseMediaEntity) {
        this.showcaseMediaEntity = showcaseMediaEntity;
    }
}
