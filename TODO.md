# TODO: Modify Subcontractor Progress to Support Multiple Images

## Backend Changes
- [x] Update SubcontractorProgressEntity.java: Change progressImageUrl field to store JSON string of multiple URLs
- [x] Update SubcontractorProgressDTO.java: Change progressImageUrl field to String (JSON)
- [x] Update TransactionController.java: Modify upload endpoint to accept MultipartFile[] images instead of single MultipartFile
- [x] Update TransactionProgressService.java: Modify updateSubcontractorProgress method to handle multiple image uploads and store URLs as JSON
- [x] Update TransactionProgressService.java: Change parameter name from imageUrl to imageUrlsJson in service methods
- [x] Update TransactionProgressService.java: Fix method calls to use correct parameter names

## Frontend Changes
- [x] Update subcontractor-progress.jsx: Change file input to accept multiple files
- [x] Update subcontractor-progress.jsx: Modify state management for multiple images
- [x] Update subcontractor-progress.jsx: Update FormData to append multiple images
- [x] Update subcontractor-progress.jsx: Update UI to display multiple uploaded images
- [x] Update subcontractor-progress.jsx: Refresh data after upload to show new images
- [x] Update subcontractor-progress.jsx: Fix file selection logic to accumulate files instead of replacing
- [x] Update subcontractor-progress.jsx: Add preview of selected files with remove buttons

## Testing
- [ ] Test multiple image upload functionality
- [ ] Verify backward compatibility with existing single image data
- [ ] Test image display in UI
