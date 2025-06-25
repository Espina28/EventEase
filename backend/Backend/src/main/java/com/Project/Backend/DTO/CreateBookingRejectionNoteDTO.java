package com.Project.Backend.DTO;

public class CreateBookingRejectionNoteDTO {
    private String rejectionNote;
    private String imageUrl;


    public String getRejectionNote() {
        return rejectionNote;
    }
    public void setRejectionRNote(String rejectionNote) {
        this.rejectionNote = rejectionNote;
    }
    public String getImageUrl() {
        return imageUrl;
    }
}
