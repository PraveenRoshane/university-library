import { Client as QStashClient, resend } from "@upstash/qstash";
import { Client as WorkflowClient } from "@upstash/workflow";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qsClient = new QStashClient({ token: config.env.upstash.qstashToken });

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qsClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "B&W <library.praveendesilva.site>",
      to: [email],
      subject,
      html: message,
    },
  });
};
