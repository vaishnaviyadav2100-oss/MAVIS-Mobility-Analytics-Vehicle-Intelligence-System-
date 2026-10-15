package com.mavis.dto;

public class PaymentRequest {
    private String invoiceId;
    private Double amount;
    private String currency;

    public PaymentRequest() {}

    public PaymentRequest(String invoiceId, Double amount, String currency) {
        this.invoiceId = invoiceId;
        this.amount = amount;
        this.currency = currency;
    }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
