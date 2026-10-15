package com.mavis.service;

import com.mavis.entity.Invoice;
import com.mavis.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public List<Invoice> getInvoicesByUserId(Long userId) {
        return invoiceRepository.findByUserId(userId);
    }

    public Invoice getInvoiceById(String id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found: " + id));
    }

    public Invoice payInvoice(String id, String paymentMethod) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus("Paid");
        invoice.setPaymentMethod(paymentMethod != null ? paymentMethod : "Online UPI");
        return invoiceRepository.save(invoice);
    }
}
