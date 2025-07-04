# Strapi Newsletter Subscribers Content Type Setup

## Create Newsletter Subscribers Content Type in Strapi

Follow these steps to create the newsletter subscribers content type in your Strapi admin panel:

### 1. Navigate to Content-Type Builder
Go to **Content-Type Builder** in your Strapi admin panel.

### 2. Create Collection Type
1. Click **"Create new collection type"**
2. Name: `newsletter-subscriber`
3. Advanced settings:
   - Table name: `newsletter_subscribers` (to match your Supabase table)

### 3. Add Fields

#### Email Field
- **Type**: Email
- **Name**: `email`
- **Advanced settings**:
  - Required: ✅ Yes
  - Unique: ✅ Yes
  - Max length: 255

#### Subscription Status Field
- **Type**: Enumeration
- **Name**: `subscription_status`
- **Values**: 
  - `active`
  - `unsubscribed`
- **Default value**: `active`
- **Advanced settings**:
  - Required: ✅ Yes

#### Subscribed At Field
- **Type**: DateTime
- **Name**: `subscribed_at`
- **Advanced settings**:
  - Required: ✅ Yes

#### Source Field
- **Type**: Text
- **Name**: `source`
- **Advanced settings**:
  - Default value: `website`
  - Max length: 100

#### Preferences Field
- **Type**: JSON
- **Name**: `preferences`
- **Advanced settings**:
  - Required: ❌ No

### 4. Configure Permissions

#### Public Role
- **Find**: ✅ Enabled (for unsubscribe functionality)
- **Create**: ✅ Enabled (for new subscriptions)
- **Update**: ✅ Enabled (for status changes)

#### Authenticated Role
- **Find**: ✅ Enabled
- **Create**: ✅ Enabled
- **Update**: ✅ Enabled

### 5. API Configuration

Make sure the content type is accessible via API:
- Go to **Settings** → **Roles** → **Public**
- Enable permissions for `newsletter-subscriber`

## Database Sync

Your Supabase table should already match this structure:

```sql
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscription_status VARCHAR(50) DEFAULT 'active',
  subscribed_at TIMESTAMP WITHOUT TIME ZONE,
  source VARCHAR(100),
  preferences JSONB,
  created_at TIMESTAMP WITHOUT TIME ZONE,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  published_at TIMESTAMP WITHOUT TIME ZONE,
  created_by_id INTEGER,
  updated_by_id INTEGER,
  locale VARCHAR
);
```

## Features Implemented

✅ **Frontend Newsletter Subscription**
- Sidebar newsletter form with validation
- Footer newsletter subscription
- Standalone NewsletterSubscription component
- Real-time email validation
- Loading states and error handling

✅ **Admin Panel Management**
- Newsletter Management tab in admin dashboard
- View all subscribers with filtering
- Search functionality
- Export to CSV
- Unsubscribe users
- Newsletter statistics

✅ **User Management**
- Unsubscribe page (`/unsubscribe`)
- Email validation
- Success/error feedback
- URL parameter support for pre-filled emails

✅ **Backend Integration**
- Custom hook `useNewsletter` for all operations
- Supabase integration
- Duplicate email handling
- Status tracking (active/unsubscribed)

## Usage Examples

### Basic Newsletter Form
```tsx
import { NewsletterSubscription } from '@/components/NewsletterSubscription';

// Card variant (default)
<NewsletterSubscription />

// Inline variant
<NewsletterSubscription 
  variant="inline" 
  source="homepage"
/>

// Footer variant
<NewsletterSubscription 
  variant="footer"
  title="Stay Updated"
  description="Get our latest recipes"
  source="footer"
/>
```

### Admin Panel
Navigate to `/admin` → **Newsletter** tab to manage subscribers.

### Unsubscribe
Users can unsubscribe at `/unsubscribe` or `/unsubscribe?email=user@example.com`

## Testing

1. **Subscribe**: Use any newsletter form on the site
2. **Admin View**: Check admin panel → Newsletter tab
3. **Unsubscribe**: Visit `/unsubscribe` page
4. **Re-subscribe**: Previously unsubscribed users can reactivate

## Security Notes

- Email validation on both frontend and backend
- RLS policies protect subscriber data
- Admin-only access to subscriber management
- Secure unsubscribe process
