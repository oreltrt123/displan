export function createInvitationEmailTemplate(
  boardName: string,
  role: string,
  inviteUrl: string,
  inviterEmail: string,
) {
  return {
    subject: `You've been invited to collaborate on "${boardName}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Board Collaboration Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Collaborate on a design board</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              <strong>${inviterEmail}</strong> has invited you to collaborate on the board <strong>"${boardName}"</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #495057;">Your Role: ${role.charAt(0).toUpperCase() + role.slice(1)}</h3>
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                ${
                  role === "admin"
                    ? "Full access - can edit, comment, and manage collaborators"
                    : role === "editor"
                      ? "Can edit the board and add comments"
                      : "Read-only access - can view but not edit"
                }
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
              If you can't click the button above, copy and paste this link into your browser:<br>
              <a href="${inviteUrl}" style="color: #007bff; word-break: break-all;">${inviteUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e1e5e9; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
              This invitation was sent by DisPlan. If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
You've been invited to collaborate on "${boardName}"

${inviterEmail} has invited you to collaborate on the board "${boardName}" with ${role} access.

Your Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
${
  role === "admin"
    ? "Full access - can edit, comment, and manage collaborators"
    : role === "editor"
      ? "Can edit the board and add comments"
      : "Read-only access - can view but not edit"
}

Accept the invitation by visiting: ${inviteUrl}

If you didn't expect this invitation, you can safely ignore this email.
    `,
  }
}

export default createInvitationEmailTemplate
