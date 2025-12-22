import { ScrollViewStyleReset } from 'expo-router/html';

const cradleBackground = `
body {
  background-color: #F0F9FF;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0A192F;
  }
}`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        <title>Project Cradle | Pediatric Surveillance</title>
        <meta name="description" content="High-integrity biometric tracking for the modern parent." />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: cradleBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}