import Link from "next/link";

export default function ThankYouMessage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Thank you for submitting your assignment!
      </h1>
      <Link href="/" className="text-blue-500 underline">
        Go back to form
      </Link>
    </div>
  );
}
