namespace Uniflow.Enums;

public enum QuotaType
{
    general,
    freedom_fighter,
    tribal,
    district_quota,
    physically_challenged
}

public enum ApplicationStatus
{
    pending,
    seat_reserved,
    payment_pending,
    confirmed,
    rejected,
    expired,
    withdrawn
}

public enum PaymentStatus
{
    initiated,
    pending,
    verified,
    failed,
    refunded
}

public enum PaymentProvider
{
    bkash,
    nagad,
    rocket,
    sslcommerz,
    ssl_card
}

public enum NotificationChannel
{
    sms,
    email,
    push
}

public enum NotificationStatus
{
    pending,
    sent,
    failed
}
