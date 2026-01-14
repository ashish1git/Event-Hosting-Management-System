# 👑 Admin Portal - Event Management Guide

## ✅ New Features Implemented

### 1. **Complete Event Management Portal**
We have added a dedicated **Event Management Panel** for each event, accessible from the Admin Dashboard.

- **Manage Registrations**
  - View full list of registered users
  - Filter by `Pending`, `Approved`, `Rejected`
  - Search by name or email
  - **1-Click Approve/Reject** buttons
  - **Remove User** option (Manage user details)

- **Integrated QR Scanner**
  - Built-in scanner tab for each event
  - No need to switch pages
  - Supports Camera & Manual Token Input
  - Real-time attendance updates

- **Attendance Analytics**
  - Live "Turnout Rate" calculation
  - Total Checked-in count
  - Attendance Logs (Who, When, Scanned By)

### 2. **Admin Dashboard Updates**
- Added **"Manage & Scan"** button to every event card (Active, Upcoming, Finished).
- Provides instant access to the management tools.

## 🚀 How to Use

1. **Login as Admin**: `23106034@apsit.edu.in` / `chetan.9022`
2. **Dashboard**: You will see all events.
3. **Click "Manage & Scan"** on any event.
4. **Registrations Tab**:
   - Review pending users.
   - Click ✅ to Approve (Sends email).
   - Click ❌ to Reject (Sends email).
   - Click 🗑️ to Delete (Removes user from event).
5. **Scanner Tab**:
   - Use camera or enter token manually.
   - See instant success/error feedback.
6. **Attendance Tab**:
   - View post-event statistics and user logs.

## 🔗 Quick Links

- **Dashboard**: `http://localhost:5173/admin`
- **Management Page**: `http://localhost:5173/admin/events/:id/manage`

This implementation fulfills the requirement to:
- Manage all registrations per event.
- Scan QR codes.
- Update/Delete user registrations.
- View user information.
