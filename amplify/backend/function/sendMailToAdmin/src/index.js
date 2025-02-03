const {
  SESClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand,
  ListIdentitiesCommand,
} = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: "ap-southeast-2" });

async function isEmailVerified(email) {
  try {
    const listIdentitiesParams = {
      IdentityType: "EmailAddress",
    };

    const listIdentitiesCommand = new ListIdentitiesCommand(
      listIdentitiesParams
    );

    const data = await sesClient.send(listIdentitiesCommand);

    return data.Identities.includes(email);
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return false;
  }
}

async function initiateEmailVerification(email) {
  try {
    const verifyEmailParams = {
      EmailAddress: email,
    };
    const verifyEmailCommand = new VerifyEmailIdentityCommand(
      verifyEmailParams
    );
    await sesClient.send(verifyEmailCommand);
    console.log(
      `Verification email sent to ${email}. Please verify the email.`
    );
  } catch (error) {
    console.error("Error initiating email verification:", error);
    throw error;
  }
}

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify({ error: "Request body is missing." }),
      };
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify({ error: "Invalid JSON payload." }),
      };
    }

    const { name, email, phone, message } = parsedBody;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify({ error: "Missing required fields." }),
      };
    }

    const isVerified = await isEmailVerified(email);
    if (!isVerified) {
      await initiateEmailVerification(email);
      return {
        statusCode: 403,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        body: JSON.stringify({
          error:
            "Sender email is not verified. A verification email has been sent.",
        }),
      };
    }

    const sendEmailParams = {
      Destination: {
        ToAddresses: ["muhammadmoiztanveer@gmail.com"],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New Contact Form Submission",
        },
      },
      Source: "muhammadmoiztanveer@gmail.com",
      ReplyToAddresses: [email],
    };

    const sendEmailCommand = new SendEmailCommand(sendEmailParams);
    await sesClient.send(sendEmailCommand);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({ error: "Failed to send email." }),
    };
  }
};
