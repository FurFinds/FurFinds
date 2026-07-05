import { Metadata } from "next";
import { Container } from "@/components/Container";
import { ApplyWizard } from "./ApplyWizard";

export const metadata: Metadata = {
  title: "Apply for Verification — FurFinds",
  description: "Apply to become a verified pet-friendly business on FurFinds.",
};

export default function ApplyPage() {
  return (
    <div className="bg-white py-10 lg:py-14">
      <Container className="max-w-3xl">
        <ApplyWizard />
      </Container>
    </div>
  );
}
