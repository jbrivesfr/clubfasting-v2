CREATE TABLE quiz_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    answers jsonb NOT NULL,
    source text NOT NULL DEFAULT 'quiz-acquisition',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_leads_email ON quiz_leads(email);
