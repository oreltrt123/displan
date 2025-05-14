// This script creates the published_sites table in your Supabase database
// Run this script once to set up the table

import { createClient } from "../../../../../../../supabase/server"

async function setupPublishedSitesTable() {
  console.log("Setting up published_sites table...")

  const supabase = createClient()

  // Check if the table already exists
  const { data: existingTables, error: tableError } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .eq("table_name", "published_sites")

  if (tableError) {
    console.error("Error checking if table exists:", tableError)
    return
  }

  if (existingTables && existingTables.length > 0) {
    console.log("published_sites table already exists")
    return
  }

  // Create the table using SQL
  const { error: createError } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE public.published_sites (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_id UUID NOT NULL REFERENCES public.website_projects(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        site_name TEXT NOT NULL,
        html_content TEXT NOT NULL,
        published_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        UNIQUE(project_id),
        UNIQUE(site_name)
      );
      
      -- Add indexes for performance
      CREATE INDEX published_sites_project_id_idx ON public.published_sites(project_id);
      CREATE INDEX published_sites_user_id_idx ON public.published_sites(user_id);
      CREATE INDEX published_sites_site_name_idx ON public.published_sites(site_name);
      
      -- Add RLS policies
      ALTER TABLE public.published_sites ENABLE ROW LEVEL SECURITY;
      
      -- Allow users to select their own published sites
      CREATE POLICY "Users can view their own published sites"
        ON public.published_sites
        FOR SELECT
        USING (auth.uid() = user_id);
      
      -- Allow users to insert their own published sites
      CREATE POLICY "Users can insert their own published sites"
        ON public.published_sites
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
      
      -- Allow users to update their own published sites
      CREATE POLICY "Users can update their own published sites"
        ON public.published_sites
        FOR UPDATE
        USING (auth.uid() = user_id);
      
      -- Allow users to delete their own published sites
      CREATE POLICY "Users can delete their own published sites"
        ON public.published_sites
        FOR DELETE
        USING (auth.uid() = user_id);
    `,
  })

  if (createError) {
    console.error("Error creating published_sites table:", createError)
    return
  }

  console.log("published_sites table created successfully")

  // Add columns to website_projects table if they don't exist
  const { error: alterError } = await supabase.rpc("exec_sql", {
    sql: `
      -- Check if columns exist and add them if they don't
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'website_projects' 
                      AND column_name = 'published') THEN
          ALTER TABLE public.website_projects ADD COLUMN published BOOLEAN DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'website_projects' 
                      AND column_name = 'published_url') THEN
          ALTER TABLE public.website_projects ADD COLUMN published_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'website_projects' 
                      AND column_name = 'last_published') THEN
          ALTER TABLE public.website_projects ADD COLUMN last_published TIMESTAMPTZ;
        END IF;
      END
      $$;
    `,
  })

  if (alterError) {
    console.error("Error adding columns to website_projects table:", alterError)
    return
  }

  console.log("Columns added to website_projects table successfully")
}

// Run the setup function
setupPublishedSitesTable()
  .then(() => console.log("Setup complete"))
  .catch((err) => console.error("Setup failed:", err))
