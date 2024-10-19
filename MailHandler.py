import os.path
import base64
import mimetypes
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from email.message import EmailMessage

class MailHandler:
    def __init__(self, creds):
        self.service = build("gmail", "v1", credentials=creds)
        self.mail    = EmailMessage()

    def createMail(self, from_email, to_email, subject, content, attachment_path=None):
        try:
            self.mail["From"]    = from_email
            self.mail["To"]      = to_email
            self.mail["Subject"] = subject
            self.mail.set_content(content)

            if attachment_path != None:
                type_subtype, _ = mimetypes.guess_type(attachment_path)
                maintype, subtype = type_subtype.split("/")
                
                with open(attachment_path, "rb") as fp:
                    attachment_data = fp.read()
                
                self.mail.add_attachment(attachment_data, maintype, subtype)

        except Exception as error:
            print(f"An error occurred while creating mail: {error}")

    def sendMail(self):
        try:
            encoded_message = base64.urlsafe_b64encode(self.mail.as_bytes()).decode()

            create_message = {"raw": encoded_message}

            send_message = (
                self.service.users()
                .messages()
                .send(userId="me", body=create_message)
                .execute()
            )
            print("Email sent!")

        except Exception as error:
            print(f"An error occurred while sending mail: {error}")

if __name__ == "__main__":
    SCOPES = ["https://mail.google.com/"]

    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    else:
        print("Error: token.json, was not found in root")
        exit(1)

    handler = MailHandler(creds)
    handler.createMail(
        "nmarzagaodev@gmail.com",               # From
        "nmarzagaodev@gmail.com",               # To
        "Test Mail",                            # Subject
        "this is a simple test mail to myself", # Content
        "./meme.jpg"                            # Attachment
    )

    handler.sendMail()