# TODO List

 - Rename posts.controller.js to thread.controller.js (and rename the view file to thread.ejs or similar, you'll likely need to update app.js)
 - Create a threads page that shows threads sorted by created_ts in descending order (you already have getThreads or whatever it's called, just change asc to desc in the query)
 - The threads page should be located at "/threads"
 - Each thread listing should have 2 lines:
   - THREAD TITLE
   - Created on TIME by CREATOR NAME

  - make user submitted images be added into UserImages and displayed with there post 
   -Half of this is done we already store the name of the img in db now it's mostly front end work