import { Card, Table } from "@heroui/react";
import type { Donation, DonationStatus } from "@/lib/types/dashboard";
import { StatusLabel } from "../StatusLabel";

type DonationPanelProps = {
  donations: Donation[];
  isLoading: boolean;
};

const statusLabels: Record<DonationStatus, string> = {
  PENDING: "Pending",
  SETTLEMENT: "Paid",
  EXPIRED: "Expired",
  FAILED: "Failed",
};

function getStatusTone(status: DonationStatus) {
  if (status === "SETTLEMENT") return "success" as const;
  if (status === "PENDING") return "warning" as const;
  return "danger" as const;
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DonationPanel({ donations, isLoading }: DonationPanelProps) {
  return (
    <Card className="min-w-0 rounded-[24px] border-0 bg-default-100 shadow-none">
      <Card.Header className="px-6 pb-2 pt-6 sm:px-8 sm:pt-7">
        <div>
          <Card.Title className="text-xl font-semibold">Donations</Card.Title>
          <Card.Description className="mt-1">
            Recent donation orders
          </Card.Description>
        </div>
      </Card.Header>
      <Card.Content className="min-w-0 px-0 pb-6 pt-3">
        <Table variant="secondary" className="min-w-0">
          <Table.ScrollContainer>
            <Table.Content aria-label="Donation list">
              <Table.Header>
                <Table.Column isRowHeader>Order ID</Table.Column>
                <Table.Column>Donor</Table.Column>
                <Table.Column>Amount</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Payment type</Table.Column>
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="px-4 py-8 text-center text-sm text-foreground-500">
                    {isLoading ? "Loading donations…" : "No donations found."}
                  </div>
                )}
              >
                {donations.map((donation) => (
                  <Table.Row key={donation.id} id={donation.id}>
                    <Table.Cell className="whitespace-nowrap font-medium text-foreground">
                      {donation.orderId}
                    </Table.Cell>
                    <Table.Cell className="min-w-48 text-sm text-foreground-500">
                      <div className="font-medium text-foreground">
                        {donation.donorName}
                      </div>
                      <div className="mt-1 text-xs">{donation.donorEmail}</div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium">
                      {formatRupiah(donation.amount)}
                    </Table.Cell>
                    <Table.Cell>
                      <StatusLabel
                        label={statusLabels[donation.status]}
                        tone={getStatusTone(donation.status)}
                      />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">
                      {donation.paymentType || "—"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card.Content>
    </Card>
  );
}
