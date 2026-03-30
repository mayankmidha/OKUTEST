/**
 * OKU WhatsApp Care Bridge
 * Generates deep-links for clinical onboarding and coordinator support.
 */

const COORDINATOR_PHONE = "919953879928";

export type WhatsAppContext = "ONBOARDING_COMPLETE" | "BOOKING_CONFIRMED" | "CRISIS_SUPPORT" | "THERAPIST_MATCH";

export function getWhatsAppCareLink(type: WhatsAppContext, data: { name?: string, id?: string, topic?: string }) {
    let message = "";

    switch (type) {
        case "ONBOARDING_COMPLETE":
            message = `Hello OKU Care. My name is ${data.name || 'a new member'}. I just completed my clinical intake (ID: ${data.id || 'N/A'}). I'd like to discuss my next steps.`;
            break;
        case "BOOKING_CONFIRMED":
            message = `Hi, I've just booked a session on OKU for ${data.topic || 'Therapy'}. Can you help me prepare?`;
            break;
        case "CRISIS_SUPPORT":
            message = `URGENT: I need immediate support. (Ref: ${data.id || 'User'})`;
            break;
        case "THERAPIST_MATCH":
            message = `Hello, I'm looking for a therapist who specializes in ${data.topic || 'General Care'}. Can you help me choose from the collective?`;
            break;
    }

    return `https://wa.me/${COORDINATOR_PHONE}?text=${encodeURIComponent(message)}`;
}
