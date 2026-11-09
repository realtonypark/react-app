Add authentication
Change the app so that only users who are authenticated, i.e., signed in, can edit class information. This involves the following changes on the back-end Firebase side:

Enabling authentication services for the project on the Firebase web console
Add security rules to the database to allow write-access only for authenticated users
The following changes need to be made on the front-end React web app side:

Adding code to the app to track the current authenticated user, if any
Adding code to the app to let a user sign in and out
Adding code to show a course edit button on each course card only to authenticated users
The best place for a button for signing in or out would be a banner component that appears on all screens.
## Firebase setup

1. In the Firebase console, open **Authentication > Sign-in method** and enable
   the **Google** provider for the project.
2. Deploy the Realtime Database rules from this repository:

   ```sh
   firebase deploy --only database
   ```

   The rules allow anyone to read course data, but require an authenticated
   user for every write.

3. If Firestore rules have changed, deploy them with:

   ```sh
   firebase deploy --only firestore:rules
   ```

## App behavior

The banner on every screen lets users sign in with Google or sign out. Course
cards show an **Edit** button only while a user is signed in. These frontend
checks improve the user experience, but the Firebase security rules are the
authoritative protection for course data.