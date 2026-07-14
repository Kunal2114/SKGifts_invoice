import './globals.css';

export const metadata = {
  title: 'Invoice Manager',
  description: 'GST tax invoice tool'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
