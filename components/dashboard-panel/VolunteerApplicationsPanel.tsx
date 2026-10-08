import { Button, Card, Table } from "@heroui/react";
import type {
  VolunteerApplication,
  VolunteerDecision,
  VolunteerStatus,
} from "@/lib/types/dashboard";
import { StatusLabel } from "../StatusLabel";

type VolunteerApplicationsPanelProps = {
  applications: VolunteerApplication[];
  isLoading: boolean;
  savingId: string | null;
  onDecision: (id: string, status: VolunteerDecision) => void;
};

const statusLabels: Record<VolunteerStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const skillAreaLabels: Record<string, string> = {
  pengajar: "Teaching",
  dokumentasi: "Documentation",
  "logistik-acara": "Event logistics",
};

function getStatusTone(status: VolunteerStatus) {
  if (status === "APPROVED") return "success" as const;
  if (status === "PENDING") return "warning" as const;
  return "danger" as const;
}

export function VolunteerApplicationsPanel({
  applications,
  isLoading,
  savingId,
  onDecision,
}: VolunteerApplicationsPanelProps) {
  return (
    <Card className="min-w-0 rounded-[24px] border-0 bg-default-100 shadow-none">
      <Card.Header className="px-6 pb-2 pt-6 sm:px-8 sm:pt-7">
        <div>
          <Card.Title className="text-xl font-semibold">
            Volunteer Application
          </Card.Title>
          <Card.Description className="mt-1">
            Review applicants and their submitted resumes
          </Card.Description>
        </div>
      </Card.Header>
      <Card.Content className="min-w-0 px-0 pb-6 pt-3">
        <Table variant="secondary" className="min-w-0">
          <Table.ScrollContainer>
            <Table.Content aria-label="Volunteer applications">
              <Table.Header>
                <Table.Column isRowHeader>Applicant</Table.Column>
                <Table.Column>Skill area</Table.Column>
                <Table.Column>Reason</Table.Column>
                <Table.Column>Resume</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Decision</Table.Column>
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="px-4 py-8 text-center text-sm text-foreground-500">
                    {isLoading
                      ? "Loading applications…"
                      : "No applications found."}
                  </div>
                )}
              >
                {applications.map((application) => (
                  <Table.Row key={application.id} id={application.id}>
                    <Table.Cell className="min-w-40 font-medium">
                      {application.userName}
                    </Table.Cell>
                    <Table.Cell className="min-w-36">
                      {skillAreaLabels[application.skillArea] ??
                        application.skillArea}
                    </Table.Cell>
                    <Table.Cell className="min-w-56 max-w-72 whitespace-normal text-sm text-foreground-500">
                      {application.reason}
                    </Table.Cell>
                    <Table.Cell className="min-w-40">
                      {application.resumeUrl ? (
                        <Button
                          size="sm"
                          variant="tertiary"
                          onPress={() =>
                            window.open(
                              application.resumeUrl,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                        >
                          View PDF
                        </Button>
                      ) : (
                        <span className="text-xs text-foreground-500">
                          No resume
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <StatusLabel
                        label={statusLabels[application.status]}
                        tone={getStatusTone(application.status)}
                      />
                    </Table.Cell>
                    <Table.Cell className="min-w-48">
                      {application.status === "PENDING" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            isDisabled={savingId === application.id}
                            isPending={savingId === application.id}
                            onPress={() =>
                              onDecision(application.id, "APPROVED")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            isDisabled={savingId === application.id}
                            onPress={() =>
                              onDecision(application.id, "REJECTED")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-foreground-500">
                          Decision recorded
                        </span>
                      )}
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
