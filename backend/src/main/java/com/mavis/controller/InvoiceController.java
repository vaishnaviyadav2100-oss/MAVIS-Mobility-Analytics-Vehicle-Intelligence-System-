package com.mavis.controller;

import com.mavis.entity.Invoice;
import com.mavis.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/my-invoices")
    public ResponseEntity<List<Invoice>> getMyInvoices(@RequestParam(defaultValue = "1") Long userId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Invoice> payInvoice(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String method = (body != null && body.containsKey("paymentMethod")) ? body.get("paymentMethod") : "Online UPI";
        return ResponseEntity.ok(invoiceService.payInvoice(id, method));
    }
}
