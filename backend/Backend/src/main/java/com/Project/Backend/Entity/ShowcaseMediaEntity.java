package com.Project.Backend.Entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;


@Entity
@Table(name = "Showcase_Media")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "showcaseMedia_id")
public class ShowcaseMediaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int showcaseMedia_id;
    private String showcaseMedia_imageurl;
    private String showcaseMedia_fileName;

    @ManyToOne
    @JoinColumn(name = "showcase_id")
    @JsonBackReference(value = "showcase-showcaseMedia")
    private ShowcaseEntity showcase;

    public int getShowcaseMedia_id() {
        return showcaseMedia_id;
    }

    public void setShowcaseMedia_id(int showcaseMedia_id) {
        this.showcaseMedia_id = showcaseMedia_id;
    }

    public String getShowcaseMedia_imageurl() {
        return showcaseMedia_imageurl;
    }

    public void setShowcaseMedia_imageurl(String showcaseMedia_imageurl) {
        this.showcaseMedia_imageurl = showcaseMedia_imageurl;
    }

    public String getShowcaseMedia_fileName() {
        return showcaseMedia_fileName;
    }

    public void setShowcaseMedia_fileName(String showcaseMedia_fileName) {
        this.showcaseMedia_fileName = showcaseMedia_fileName;
    }

    public ShowcaseEntity getShowcase() {
        return showcase;
    }

    public void setShowcase(ShowcaseEntity showcase) {
        this.showcase = showcase;
    }
}
