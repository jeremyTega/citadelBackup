function loginNotificationMail(user, timestamp, ipAddress, userAgent) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Login Notification</title>
        <style>
            /* Global Styles */
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                text-align: center;
                background-color: #000000; /* Black background */
                color: #444444; /* Slightly darker text */
                font-weight: bold; /* Bold text */
            }
    
            /* Header Styles */
            .header {
                background-color: black;
                padding: 10px 0;
                border-top-left-radius: 10px; /* Rounded corners */
                border-top-right-radius: 10px;
            }
    
            .header img {
                width: 150px; /* Adjust the width of the image as needed */
                display: block;
                margin: 0 auto; /* Center the image horizontally */
            }
    
            /* Content Styles */
            .content {
                padding: 20px;
            }
    
            .login-details {
                margin-top: 20px;
                text-align: left;
            }
    
            .details-row {
                margin-bottom: 10px;
            }
    
            /* Link Styles */
            a {
                color: #007bff; /* Blue color for links */
                text-decoration: none;
            }
    
            a:hover {
                text-decoration: underline; /* Underline on hover */
            }
        </style>
    </head>
    <body>
        <!-- Header with Logo -->
        <div class="header">
            <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="CITADEL INV">
        </div>
    
        <!-- Content Section -->
        <div class="content">
            <h1>User Login Notification</h1>
            <p>We're verifying a recent sign-in for ${user.email}:</p>
            <p>userName: ${user.userName}:</p>
            <div class="login-details">
                <div class="details-row">
                    <p><strong>Date:</strong> ${timestamp}</p>
                </div>
                <div class="details-row">
                    <p><strong>IP Address:</strong> ${ipAddress}</p>
                </div>
                <div class="details-row">
                    <p><strong>User Agent:</strong> ${userAgent}</p>
                </div>
                <p>You're receiving this message because of a successful sign-in from a device that we didn’t recognize. If you believe that this sign-in is suspicious, please reset your password immediately.</p>
                <p>If you're aware of this sign-in, please disregard this notice. This can happen when you use your browser's incognito or private browsing mode or clear your cookies.</p>
                <p>Thanks,</p>
                <p>CITADEL INV exchange team</p>
            </div>
        </div>
    </body>
    </html>
  `
    
};



// this mail is for the deposit function
//it tell the admin that user has deposit on the application

const depositMail = (payment,user) => {
    const getFileExtension = (url) => {
        const ext = url.split('.').pop().toLowerCase();
        return ext === 'jpg' ? 'jpg' :
               ext === 'jpeg' ? 'jpeg' :
               'pdf';
    };

  return  `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Deposit Proof of Payment Uploaded</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #000000; /* Black background */
              color: #ffffff; /* White text */
              margin: 0;
              padding: 0;
          }
          .header {
              text-align: center;
          }
          .header img {
              max-width: 200px; /* Set the maximum width for the logo */
              display: block;
              margin: 0 auto; /* Center the image horizontally */
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content p {
              margin-bottom: 10px;
          }
          .content a {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff; /* Blue button color */
              color: #ffffff; /* White text color */
              text-decoration: none;
              border-radius: 5px;
              transition: background-color 0.3s ease;
          }
          .content a:hover {
              background-color: #0056b3; /* Darker blue on hover */
          }
          .footer {
              padding: 20px;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="CITADEL INV">
      </div>
      <div class="content">
          <p>A new deposit proof of payment has been uploaded. Please review.</p>
          <p><span class="firstname">User Name:</span> ${user.firstName} ${user.lastName}</p>
          <p><span class="lastName">User ID:</span> ${user._id}</p>
          <p><span class="email">User Email:</span> ${user.email}</p>
  
          <a href="${payment.url}" download="proof_of_payment.${getFileExtension(payment.url)}">Download Payment</a>
      </div>
      <div class="footer">
          <p>Contact us at <a href="mailto:citadel investment team@webmail.com">ultimatefx@webmail.com</a></p>
      </div>
  </body>
  </html>
  `
    
};





const KycVericationMail = (savedKycDoc) => {
    const getFileExtension = (url) => {
        const ext = url.split('.').pop().toLowerCase();
        return ext === 'jpg' ? 'jpg' :
               ext === 'jpeg' ? 'jpeg' :
               'pdf';
    };

    // Construct HTML for both files
    const filesHtml = savedKycDoc.driversLicense.map((file, index) => `
        <p><a href="${file.url}" download="driversLicense_${index + 1}.${getFileExtension(file.url)}">Download Driver's License ${index + 1}</a></p>
        <img src="${file.url}" alt="Driver's License ${index + 1}" style="max-width: 100%; height: auto;">
    `).join('');

    return  `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>USER ULPOAD KYC FORM</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #ffffff; /* White background */
                color: #000000; /* Black text */
                margin: 0;
                padding: 0;
            }
            .header {
                background-color: #ffffff; /* White background for header */
                padding: 20px;
                text-align: center;
            }
            .header img {
                max-width: 200px; /* Set the maximum width for the logo */
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                margin-bottom: 10px;
            }
            .content a {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff; /* Blue button color */
                color: #ffffff; /* White text color */
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            .content a:hover {
                background-color: #0056b3; /* Darker blue on hover */
            }
            .footer {
                background-color: #f0f0f0; /* Light gray background for footer */
                padding: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="PrimeTrade">
        </div>
        <div class="content">
           <p>A new kyc form has been uploaded. Please review.</p>
            <p><span class="firstname">User Name:</span> ${savedKycDoc.fullName}</p>
            <p><span class="lastName">User ID:</span> ${savedKycDoc._id}</p>
            <p><span class="lastName">SSN:</span> ${savedKycDoc.SSN}</p>
            <p><span class="lastName">Occupation:</span> ${savedKycDoc.occupation}</p>
           
    
            <!-- Insert HTML for files -->
            ${filesHtml}
        </div>
        <div class="footer">
            <p>Contact us at <a href="mailto:citadel investment team@webmail.com">citadel investment team</a></p>
        </div>
    </body>
    </html>
    `;
};





// this function tells the user that his payment proof has been sent and await approval
function userEmailTemplate(depositRecord) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deposit Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #000000; /* Black background */
                color: #ffffff; /* White text */
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                max-width: 200px; /* Set the maximum width for the logo */
            }
            .content {
                background-color: #ffffff; /* White background */
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
                color: #000000; /* Black text */
            }
            .content p {
                margin-bottom: 10px;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #666666; /* Light gray text */
                font-size: 14px;
            }
            .footer a {
                color: #007bff; /* Blue link color */
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="PrimeTrade">
            </div>
            <div class="content">
                <p><strong>Congratulations!</strong> You have successfully uploaded a proof of payment.</p>
                <p>Please hold while your payment is confirmed. Your balance will reflect within 24 hours.</p>
                <p>Deposit ID Number: ${depositRecord.depositId}</p>
            </div>
            <div class="footer">
                <p>Contact us at <a href="mailto:citadel investment team@webmail.com">ultimatefx@webmail.com</a></p>
            </div>
        </div>
    </body>
    </html>`;
}


function forgetMail(link){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: black;
                color: #ffffff;
                font-family: Arial, sans-serif;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: black;
                border-radius: 10px;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .link {
                color: #3366cc;
                text-decoration: none;
                border-bottom: 1px solid #3366cc;
                transition: border-bottom 0.3s ease;
            }
            .link:hover {
                border-bottom: 2px solid #e71717;
                color:#e71717
            }
            .footer {
                margin-top: 20px;
                text-align: center;
            }
            .image {
                max-width: 80%;
                display: block;
                margin: 0 auto 10px;
            }
            
            /* Mobile responsiveness */
            @media (max-width: 600px) {
                .container {
                    padding: 10px;
                }
                .header {
                    margin-bottom: 10px;
                }
                .footer {
                    margin-top: 10px;
                }
                .image {
                    max-width: 100%;
                }
            }
        </style>
    </head>
    <body>
        
            <div class="header">
                <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="CITADEL INV" class="image">
                <h1>Password Reset</h1>
            </div>
            <p>Please click on the link below to reset your password:</p>
            <p><a class="link" href="${link}">Reset Password</a></p>
            <p>This link expires in 15 minutes.</p>
            <div class="footer">
                <p>If you didn't request a password reset, you can ignore this email.</p>
            </div>
      
    </body>
    </html>`
    
        }


        //this function tellls the user to verify with the otp sent to their mail
        function otpVerifyMail(otp){
            return`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        background-color: #000000; /* Black background */
                        color: #ffffff; /* White text */
                        margin: 0;
                        padding: 0;
                    }
            
                    .verification-container {
                        margin-top: 20px;
                    }
            
                    .otp {
                        font-weight: bold;
                        font-size: 24px;
                        color: #007bff; /* Blue color for the OTP */
                    }
                </style>
            </head>
            <body>
                <h1>Verification Code</h1>
                <p>Please use the following OTP as your verification code:</p>
                <div class="verification-container">
                    <span class="otp">${otp}</span> <!-- Replace with your actual OTP -->
                </div>
            </body>
            </html>
            `
        }
        function ticketCreationNotificationMail(user, ticketData) {
            return `
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Ticket Creation Notification</title>
            <style>
                /* Global Styles */
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    background-color: #000000; /* Black background */
                    color: #ffffff; /* White text */
                }
                
                /* Header Styles */
                .header {
                    background-color: black; /* Black header background */
                    padding: 20px 0;
                    border-radius: 10px; /* Rounded corners */
                }
                
                .header img {
                    width: 150px; /* Adjust the width of the image as needed */
                }
                
                /* Content Styles */
                .content {
                    padding: 20px;
                }
                
                .ticket-details {
                    margin-top: 20px;
                    text-align: left;
                }
                
                .details-row {
                    margin-bottom: 10px;
                }
            </style>
            </head>
            <body>
                <!-- Header with Logo -->
                <div class="header">
                    <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="CITADEL INV">
                </div>
            
                <!-- Content Section -->
                <div class="content">
                    <h1>New Ticket Creation Notification</h1>
                    <p>A new ticket has been created by ${user.firstName} ${user.lastName} (${user.email}):</p>
                    <div class="ticket-details">
                        <div class="details-row">
                            <p><strong>Ticket ID:</strong> ${ticketData.ticketId}</p>
                        </div>
                        <div class="details-row">
                            <p><strong>Subject:</strong> ${ticketData.subject}</p>
                        </div>
                        <div class="details-row">
                            <p><strong>Priority:</strong> ${ticketData.pirority}</p>
                        </div>
                        <div class="details-row">
                            <p><strong>Message:</strong> ${ticketData.messages}</p>
                        </div>
                        <p>You're receiving this message because a new ticket has been created in the system.</p>
                        <p>Please take appropriate action to address the user's concern as soon as possible.</p>
                        <p>Thanks,</p>
                        <p>CITADEL INV exchange team</p>
                    </div>
                </div>
            </body>`;
        }




        function moneyDepositNotificationMail(user, amount) {
            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Money Deposit Notification</title>
                <style>
                    /* Global Styles */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        text-align: center;
                        background-color: #000000; /* Black background */
                        color: #ffffff; /* White text */
                    }
                    
                    /* Header Styles */
                    .header {
                        background-color: black; /* Black header background */
                        padding: 20px 0;
                        border-radius: 10px; /* Rounded corners */
                    }
                    
                    .header img {
                        width: 150px; /* Adjust the width of the image as needed */
                    }
                    
                    /* Content Styles */
                    .content {
                        padding: 20px;
                    }
                    
                    .wallet-details {
                        margin-top: 20px;
                        text-align: left;
                    }
                    
                    .details-row {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <!-- Header with Logo -->
                <div class="header">
                    <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="CITADEL INV">
                </div>
            
                <!-- Content Section -->
                <div class="content">
                    <h1>Money Deposit Notification</h1>
                    <p>Hello ${user.email},</p>
                    <p>We want to inform you that an amount of $${amount} has been deposited into your wallet.</p>
                    <p>You can now use this balance for your transactions and purchases.</p>
                    <p>Thank you for using our services!</p>
                    <p>CITADEL INV exchange team</p>
                </div>
            </body>
            </html>`;
        };
        
        function KycRejectMail(user) {
            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KYC Form Rejection Notification</title>
                <style>
                    /* Global Styles */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        text-align: center;
                        background-color: #000000; /* Black background */
                        color: #ffffff; /* White text */
                    }
                    
                    /* Header Styles */
                    .header {
                        background-color: black; /* Black header background */
                        padding: 20px 0;
                        border-radius: 10px; /* Rounded corners */
                    }
                    
                    .header img {
                        width: 150px; /* Adjust the width of the image as needed */
                    }
                    
                    /* Content Styles */
                    .content {
                        padding: 20px;
                    }
                    
                    .details-row {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <!-- Header with Logo -->
                <div class="header">
                    <img src="https://res.cloudinary.com/dsml73vio/image/upload/v1720045585/citadel_inv/ikwk4o3e8jvk4cyhmmaq.png" alt="CITADEL INV">
                </div>
            
                <!-- Content Section -->
                <div class="content">
                    <h1>KYC Form Rejection Notification</h1>
                    <p>Hello ${user.email},</p>
                    <p>We regret to inform you that your KYC (Know Your Customer) form has been rejected by the admin.</p>
                    <p>Please review the requirements carefully and ensure all necessary information is provided when reapplying.</p>
                    <p>Thank you for your cooperation.</p>
                    <p>CITADEL INV Exchange Team</p>
                </div>
            </body>
            </html>`;
        };
        
        function generateWelcomeEmail(name, verificationLink) {
            return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome to [Your App Name]</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        background-color: #ffffff;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 80%;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        background-color: #f4f4f4;
                    }
                    .header {
                        background: #333333;
                        padding: 10px;
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                        color: #ffffff;
                    }
                    .content {
                        padding: 20px;
                        color: #333333;
                    }
                    .footer {
                        background: #333333;
                        padding: 10px;
                        text-align: center;
                        border-top: 1px solid #ddd;
                        font-size: 0.9em;
                        color: #cccccc;
                    }
                    .button {
                        display: inline-block;
                        background-color: #000000;
                        color: #ffffff;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to [Your App Name]!</h1>
                    </div>
                    <div class="content">
                        <p>Hello ${name},</p>
                        <p>Thank you for signing up for [Your App Name]. We are excited to have you on board.</p>
                        <p>Please click the button below to verify your account:</p>
                        <p>
                            <a href="${verificationLink}" class="button">Verify My Account</a>
                        </p>
                        <p>If you did not create an account, please ignore this email.</p>
                        <p>Best regards,<br>The [Your App Name] Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
                        <p>[Your Company Address]</p>
                    </div>
                </div>
            </body>
            </html>
            `;
        }


 const wakeUpMail = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ping Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }
            .container {
                width: 80%;
                margin: auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                background: #f4f4f4;
                padding: 10px;
                text-align: center;
                border-bottom: 1px solid #ddd;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background: #f4f4f4;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Ping Notification</h1>
            </div>
            <div class="content">
                <p>The website has been pinged to keep it awake.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Your Company</p>
            </div>
        </div>
    </body>
    </html>`
    ;
};



        



module.exports= {loginNotificationMail,depositMail,userEmailTemplate,
    forgetMail,otpVerifyMail,ticketCreationNotificationMail,
    KycVericationMail,
    moneyDepositNotificationMail,
    KycRejectMail,
    wakeUpMail
    
}