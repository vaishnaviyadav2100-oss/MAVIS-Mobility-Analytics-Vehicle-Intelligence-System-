package com.mavis.dto;

public class PaymentResponse {
    private String orderId;
    private Long amount; // in paise for Razorpay
    private String currency;
    private String keyId;
    private String invoiceId;
    private String status;

    public PaymentResponse() {}

    public PaymentResponse(String orderId, Long amount, String currency, String keyId, String invoiceId, String status) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
        this.invoiceId = invoiceId;
        this.status = status;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
