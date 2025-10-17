# Role-Based Access Control Implementation

## 🎯 **Overview**

This implementation provides seamless role-based access control for the onboarding app:

- **Admins**: Can access the builder interface to create and publish onboarding content
- **Members**: Can only view the published onboarding flow
- **Automatic routing**: Users are automatically directed to the appropriate interface based on their role

## 🚀 **How It Works**

### **1. User Role Detection**
- Uses a mock system for development (easily replaceable with real Whop SDK)
- Automatically detects user role on app load
- Stores user information in Zustand store

### **2. Route Protection**
- **Admin routes** (`/builder`): Protected by `RouteGuard` component
- **Public routes** (`/onboarding`): Accessible to all users
- **Auto-redirect**: Main page (`/`) automatically redirects based on user role

### **3. Publishing System**
- Admins can publish onboarding content using the "Publish Onboarding" button
- Published content is stored separately from draft content
- Members see only the published version

## 🛠️ **Development Testing**

### **Access Development Helper**
Visit `/dev` to:
- Switch between admin and member roles
- Test different user scenarios
- Publish onboarding content
- Navigate between different app sections

### **Testing User Roles**

1. **Test as Admin:**
   - Go to `/dev`
   - Click "Set as Admin"
   - You'll be redirected to `/builder` (admin interface)
   - Create onboarding content
   - Click "Publish Onboarding" to make it visible to members

2. **Test as Member:**
   - Go to `/dev`
   - Click "Set as Member"
   - You'll be redirected to `/onboarding` (public interface)
   - You'll see the published onboarding content (if any)

## 📁 **File Structure**

```
app/
├── page.tsx              # Auto-redirects based on role
├── builder/page.tsx      # Admin-only builder (protected)
├── onboarding/page.tsx   # Public onboarding view
└── dev/page.tsx         # Development helper

components/
├── RouteGuard.tsx       # Route protection component
└── Layout.tsx           # Admin layout with publish button

hooks/
└── useUserRole.ts       # User role management hook

lib/
├── store.ts            # Updated with user management
└── types.ts            # Added User and PublishedOnboarding types
```

## 🔧 **Integration with Real Whop SDK**

To integrate with real Whop SDK, replace the mock function in `hooks/useUserRole.ts`:

```typescript
// Replace this mock function
function mockGetWhopUser() {
  // Mock implementation
}

// With real Whop SDK integration
import { useWhop } from '@whop-apps/sdk';

function useUserRole() {
  const { user } = useWhop();
  
  // Map Whop user to your User interface
  const mappedUser = {
    id: user.id,
    role: user.role === 'admin' ? 'admin' : 'member',
    name: user.name,
    email: user.email
  };
  
  // Rest of implementation...
}
```

## 🎨 **User Experience**

### **For Admins:**
- Full access to builder interface
- Can create, edit, and publish onboarding content
- See "Publish Onboarding" button in the top navigation
- Access denied message if trying to access without admin privileges

### **For Members:**
- Clean, focused onboarding experience
- No access to builder interface
- See published onboarding content only
- Automatic redirect to public onboarding if trying to access admin routes

## 🔒 **Security Features**

- **Route Guards**: Prevent unauthorized access to admin routes
- **Role-based UI**: Different interfaces based on user role
- **Automatic Redirects**: Seamless user experience with proper routing
- **Access Denied**: Clear messaging for unauthorized access attempts

## 🚀 **Deployment**

The system is ready for production deployment. Simply:

1. Replace the mock user detection with real Whop SDK integration
2. Deploy to your hosting platform
3. Configure Whop app permissions to control app visibility
4. Set up proper user role detection in your Whop community

## 📝 **Notes**

- All user data is stored in localStorage for persistence
- Published onboarding content is separate from draft content
- The system gracefully handles users without roles
- Development helper (`/dev`) should be removed in production
