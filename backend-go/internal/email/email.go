// Package email sends the transactional mail Photato needs — today just the
// passwordless login link. The Sender interface keeps the HTTP layer decoupled
// from delivery: production wires an SMTPSender (generic net/smtp, pointed at
// whatever submission host the env configures), tests use a fake that records
// what would be sent.
package email

import (
	"fmt"
	"net"
	"net/smtp"
	"time"
)

// Sender delivers a plain-text email.
type Sender interface {
	// Send delivers a plain-text message to a single recipient. subject and body
	// are UTF-8. It returns an error if delivery could not be handed off.
	Send(to, subject, body string) error
}

// LoginLinkSubject is the subject line for the magic-link email (bilingual,
// Hungarian first to match Photato's primary audience).
const LoginLinkSubject = "Photato bejelentkezési link / login link"

// LoginLinkBody builds the plain-text body of the magic-link email: a bilingual
// one-liner, the link, and the 15-minute validity note.
func LoginLinkBody(link string) string {
	return "Szia!\r\n" +
		"\r\n" +
		"Kattints ide a Photato-ba való belépéshez:\r\n" +
		"Click here to sign in to Photato:\r\n" +
		"\r\n" +
		link + "\r\n" +
		"\r\n" +
		"A link 15 percig érvényes. / This link is valid for 15 minutes.\r\n" +
		"\r\n" +
		"Ha nem te kérted, nyugodtan hagyd figyelmen kívül ezt az emailt.\r\n" +
		"If you didn't request this, just ignore this email.\r\n" +
		"\r\n" +
		"Photato\r\n"
}

// SMTPSender delivers mail over SMTP submission with STARTTLS and PLAIN auth.
// It's provider-agnostic: point Host/Port/Username/Password at any submission
// server (Photato uses SMTP2GO). FromName is the display name (e.g. "Photato").
type SMTPSender struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string // envelope + header From address
	FromName string
}

// Send composes and delivers a plain-text message. It sets a From with the
// display name, a To, a Subject, a Date, and a UTF-8 content type.
func (s SMTPSender) Send(to, subject, body string) error {
	from := s.From
	if s.FromName != "" {
		from = fmt.Sprintf("%s <%s>", s.FromName, s.From)
	}
	msg := "From: " + from + "\r\n" +
		"To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Date: " + time.Now().Format(time.RFC1123Z) + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/plain; charset=utf-8\r\n" +
		"\r\n" +
		body

	addr := net.JoinHostPort(s.Host, s.Port)
	auth := smtp.PlainAuth("", s.Username, s.Password, s.Host)
	if err := smtp.SendMail(addr, auth, s.From, []string{to}, []byte(msg)); err != nil {
		return fmt.Errorf("send mail to %s: %w", to, err)
	}
	return nil
}

var _ Sender = SMTPSender{}
