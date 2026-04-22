package org.example.orders;

public enum OrderStatus {
    /** Order persisted, inventory not yet reserved. */
    PENDING,
    /** Stock reserved; payment not yet completed (orchestrated saga step). */
    INVENTORY_RESERVED,
    CONFIRMED,
    FAILED
}
