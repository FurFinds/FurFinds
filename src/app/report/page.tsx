import { Metadata } from "next";
import { Container } from "@/components/Container";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = {
  title: "Report a Complaint — FurFinds",
  description: "Report an issue with a verified FurFinds business.",
};

export default function ReportPage() {
  return (
    <div className="bg-white py-14 lg:py-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-light text-black sm:text-4xl">
          Report a <span className="text-dark-blue">Complaint</span>
        </h1>
        <p className="mt-3 text-black/70">
          We take all reports seriously. Our team will review your complaint within 5-7 business
          days.
        </p>
        <div className="mt-10">
          <ReportForm />
        </div>
      </Container>
    </div>
  );
}
