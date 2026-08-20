#!/bin/bash
set -e

echo "Petora Setup - Starting..."

# 1. Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm required"; exit 1; }

# 2. Install dependencies
echo "Installing dependencies..."
npm install

# 3. Setup environment
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local"
fi

# 4. Setup shadcn/ui
echo "Setting up shadcn/ui..."
npx shadcn@latest init --defaults --force

# 5. Install shadcn components
echo "Installing shadcn components..."
npx shadcn@latest add \
  button card input label textarea select checkbox radio-group \
  dialog sheet drawer dropdown-menu popover tooltip \
  table pagination form toast sonner calendar date-picker \
  tabs separator scroll-area avatar badge command combobox \
  alert-dialog accordion progress skeleton switch chart \
  navigation-menu hover-card context-menu menubar resizable slider toggle toggle-group

# 6. Setup Supabase
if command -v supabase >/dev/null 2>&1; then
  echo "Setting up Supabase..."
  supabase init
  supabase start
  supabase db push
fi

# 7. Seed default data
echo "Seeding database..."
npm run seed

# 8. Build check
echo "Running build check..."
npm run build

echo "Setup complete!"
