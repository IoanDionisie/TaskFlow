
## New features & bugs fixed

# 1.1.6

- Fixed bug: Removing a task doesn't refresh the tasks number of that page
- Fixed bug: Adding tasks make shown tasks to exceed the items / page
- Fixed bug: Cloning tasks makes list exceed page number
- Fixed bug: Completing tasks doesn't refresh the items/page
- Fixed bug: Pagination not working for completed lists
- Fixed bug: Add task' button disappears when clicking on any list
- Fixed bug: Pagination is shown even when there are no tasks in a list
- Fixed bug: Pagination now shown when a list has only completed tasks

# 1.1.5

- Fixed bug: Border added on pagination
- Fixed bug: Drag and drop not anymore working on completed tasks
- Fixed bug: Drag&drop not working on more than first page
- Fixed bug: Switching to last pages, tasks list is empty
- Fixed bug: Switching to another list should reset searchbox text
- Fixed bug: Selecting new list with no tasks, 'add task' and pagination were overlapping
- Fixed bug: Clipping effect on some elements, when changing between lists
- Fixed bug: Clicking on add task button changes its background to blue
  
# 1.1.4

- Styled 'Version' element
- Renamed some methods in services, where needed
- Added a Facade Service 
- Replaced all service injections with Facade Service
- Changelog now visible in app (when clicking on version number)

# 1.1.3

- Migrated to standalone components
- Added animation on cloning tasks
- Added tip for users in tags list component
- Fixed bug - When pressing enter on login, password was revealed
for a short time

# 1.1.2

- Added slide animations on completing/removing tasks

# 1.1.1
 
 - Added ngx toastr for notifications
 - Adding a duplicate tag now show an error message
 - Color of progress bars are now set
 - Added show/hide password button on login form
 - Added feature of changing color of tags (updating also the tasks that have that tag) 

# 1.1.0

- Moved a lot of methods from app.js to specific controllers
- Added a text when selected list has no tasks
  
# 1.0.9

- Changed layout of lists-component
- Moved the 'Add new list' button to the top of the lists-component

# 1.0.8

- Customized drag&drop placeholder
- Added login with Google account

# 1.0.7

- Added Reset Password functionality
- Added custom style for alert-danger error boxes

# 1.0.6

- User can now upload a profile picture when registering an account


# 1.0.5

- Changed the design of Register/Login pages
