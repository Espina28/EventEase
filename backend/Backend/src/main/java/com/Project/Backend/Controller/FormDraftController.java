package com.Project.Backend.Controller;

import com.Project.Backend.DTO.FormDraftDTO;
import com.Project.Backend.Service.FormDraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/form-draft")
public class FormDraftController {

    @Autowired
    private FormDraftService formDraftService;

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody FormDraftDTO progress) {
        String msg = formDraftService.saveOrUpdate(progress);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/load")
    public ResponseEntity<String> load(@RequestParam String email, @RequestParam  String eventName) {
        String data = formDraftService.getProgressByUserEmailAndEventName(email, eventName);
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/delete/{email}/{eventName}")
    public ResponseEntity<String> delete(@PathVariable String email, @PathVariable String eventName) {
        formDraftService.deleteByUserEmailAndEventName(email, eventName);
        return ResponseEntity.ok("Form deleted");
    }
}
