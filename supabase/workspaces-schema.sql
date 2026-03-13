-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['system'::text, 'user'::text, 'assistant'::text])),
  content jsonb NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);
CREATE TABLE public.workspaces (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text,
  slug text NOT NULL DEFAULT generate_workspace_slug() UNIQUE,
  is_public boolean DEFAULT false,
  widgets jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workspaces_pkey PRIMARY KEY (id),
  CONSTRAINT workspaces_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);