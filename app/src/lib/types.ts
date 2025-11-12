// Typer for data vi bruger i appen
export type DeliveryMode = "online" | "in_person";
export type CreateSessionData = Omit<Session, 'id' | 'created_at'>;

export type Session = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  starts_at: string;      // UTC ISO string
  ends_at: string | null; // UTC ISO string
  delivery_mode: DeliveryMode;
  location: string | null;
  meeting_url: string | null;
  is_published: boolean;
  owner: string;
  created_at: string;
};

export type Profile = {
  id: string;
  role: "student" | "teacher";
};
