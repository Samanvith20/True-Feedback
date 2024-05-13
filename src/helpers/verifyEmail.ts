
import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface VerificationEmailProps {
    username: string;
    otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
          />
        </Head>
        <Preview>Here's your verification code: {otp}</Preview>
        <Section>
          <Heading as="h2">Hello {username},</Heading>
          <Text>
            Thank you for registering. Please use the following verification code to complete your registration:
          </Text>
          <Text>{otp}</Text>
          <Text>If you did not request this code, please ignore this email.</Text>
        </Section>
      </Html>
      
    );
  }
  