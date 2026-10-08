"use client";

import { useEffect, useState } from "react";
import { Button, Card, Table } from "@heroui/react";
import { Donation, DonationStatus, VolunteerDecision, VolunteerStatus, VolunteerApplication, DashboardData } from "@/lib/types/dashboard";
import { DonationPanel } from "@/components/dashboard-panel/DonationPanel";
import { VolunteerApplicationsPanel } from "@/components/dashboard-panel/VolunteerApplicationsPanel";

export default function AdminDashboardPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [decisionError, setDecisionError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setLoadError("");
        const response = await fetch("/api/admin/dashboard", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Could not load dashboard data.");
        }

        const data = result as DashboardData;
        setDonations(data.donations);
        setApplications(data.applications);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load dashboard data.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadDashboard();
    return () => controller.abort();
  }, []);

  async function decideApplication(
    id: string,
    status: Exclude<VolunteerStatus, "PENDING">,
  ) {
    setSavingId(id);
    setDecisionError("");

    try {
      const response = await fetch("/api/admin/volunteers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not update the application.");
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, status } : application,
        ),
      );
    } catch (error) {
      setDecisionError(
        error instanceof Error
          ? error.message
          : "Could not update the application.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-360 px-5 py-10 sm:px-8 lg:px-[8.5%] lg:py-16">
      {loadError ? (
        <Card className="mb-5 border border-danger/30 bg-danger/5 shadow-none">
          <Card.Content className="p-4 text-sm text-danger">
            {loadError}
          </Card.Content>
        </Card>
      ) : null}
      {decisionError ? (
        <Card className="mb-5 border border-danger/30 bg-danger/5 shadow-none">
          <Card.Content className="p-4 text-sm text-danger">
            {decisionError}
          </Card.Content>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[0.9fr_1.8fr]">
        <DonationPanel 
        donations={donations} 
        isLoading={isLoading}
        />

        <VolunteerApplicationsPanel 
        applications={applications}
        isLoading={isLoading} 
        savingId={savingId} 
        onDecision={(id, status) => void decideApplication(id, status)}
        />
      </div>
    </main>
  );
}
