"""Email service for sending event notifications to subscribed users."""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.settings import get_smtp_settings
from models.schemas import User


def _smtp_configured() -> bool:
    s = get_smtp_settings()
    return bool(s["host"] and s["user"] and s["password"])


def send_event_notification_emails(event_title: str, event_description: str = ""):
    """Send email to all users with subscribe_events=True (normal users)."""
    if not _smtp_configured():
        print("[WARNING] SMTP not configured. Skipping event notification emails.")
        return

    subscribers = User.objects(subscribe_events=True, is_admin=False, is_active=True)
    if not subscribers:
        return

    smtp = get_smtp_settings()
    subject = f"HICA: New Event - {event_title}"
    body = f"""
Hello,

A new event has been added to HICA:

**{event_title}**

{event_description or "Check the HICA website for details."}

Visit the events page to learn more.

— HICA Team
""".strip()

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = smtp["from_email"]
    msg.attach(MIMEText(body, "plain"))

    try:
        subscriber_list = list(subscribers)
        with smtplib.SMTP(smtp["host"], smtp["port"]) as server:
            if smtp["use_tls"]:
                server.starttls()
            server.login(smtp["user"], smtp["password"])
            for user in subscriber_list:
                if user.email:
                    msg["To"] = user.email
                    server.sendmail(smtp["from_email"], user.email, msg.as_string())
        print(f"[INFO] Event notification emails sent to {len(subscriber_list)} subscribers.")
    except Exception as e:
        print(f"[ERROR] Failed to send event notification emails: {e}")
